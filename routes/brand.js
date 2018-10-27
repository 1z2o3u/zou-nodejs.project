var express=require('express');
var router=express.Router();
var MongoClient=require('mongodb').MongoClient;
var multer=require('multer');
var fs=require('fs');
var path=require('path');
var upload=multer({dest:'C:/tmp'});
var url='mongodb://127.0.0.1:27017';
var async=require('async');

router.post('/add',upload.single('brandImg'),function(req,res){
    fs.readFile(req.file.path,function(err,fileData){
            if(err){
                res.render({msg:'读取文件失败'})
            }else{
                var fileName=new Date().getTime()+'_'+req.file.originalname;
                var dest_path=path.resolve(__dirname,'../public/brands',fileName);
                fs.writeFile(dest_path,fileData,function(err){
                    if(err){
                        res.send({msg:'写入文件失败'})
                    }else{
                        MongoClient.connect(url,function(err,client){
                            if(err){
                                res.send({msg:'连接数据库失败'})
                            }else{
                                var db=client.db('user');
                                var saveData=req.body;
                                saveData.phoneHref=fileName;
                                async.series([
                                    function(callback){
                                        db.collection('brand').find().count(function(err,num){
                                            if(err){
                                                res.send({msg:'查询数据库记录条数失败'})
                                            }else{
                                                saveData._id=num+1;
                                                callback(null);
                                            }
                                        })    
                                    },
                                    function(callback){
                                            db.collection('brand').insertOne(saveData,function(err){
                                                if(err){
                                                    res.send({msg:'插入数据库失败'})
                                                }else{
                                                    callback(null);
                                                }
                                            })
                                    }],
                                    function(err,results){
                                            if(err){
                                                res.send({msg:'添加品牌失败!'})
                                            }else{
                                                res.send({msg:'添加品牌成功!'})
                                            }
                                    })
                            }
                        })
                    }
                })
            }
    })
})

   // 加载数据
router.get('/list',function(req,res){
    var page=parseInt(req.query.page);
    var pageSize=parseInt(req.query.pageSize);
    MongoClient.connect(url,function(err,client){
        if(err){
            res.send({msg:'连接数据库失败'})
        }else{
            var db= client.db('user');
            async.parallel([
                function(callback){
                    db.collection('brand').find().count(function(err,num){
                        if(err){
                            callback({msg:'查询数据库失败'})
                        }else{
                            totalPage=Math.ceil(num/pageSize);
                            callback(null,{totalPage,num});
                        }
                    })
                },
                function(callback){
                    db.collection('brand').find().limit(pageSize).skip(page*pageSize-pageSize).toArray(function(err,array){
                        if(err){
                            callback({msg:err});
                        }else{
                            callback(null,array);
                        }
                    })
                }],
                function(err,results){
                if(err){
                    res.send(err);
                }else{
                    res.send({msg:'查询成功',data:{
                        list:results[1],
                        totalPage:totalPage,
                        count:results[0],
                        pageSize:pageSize
                    }
                    })
                }
            })
            client.close();
        }
    })
})

// 加载下拉列表

router.get('/add_select',function(req,res){
    MongoClient.connect(url,function(err,client){
        if(err){
            res.send({msg:'连接数据库失败'})
        }else{
            var db= client.db('user');
                db.collection('brand').find().toArray(function(err,array){
                    if(err){
                      res.send({msg:'查询数据库失败!'})
                    }else{
                        res.send(array);
                    }
                })
        }
        client.close();
    }) 
})      


module.exports=router;

