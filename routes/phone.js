var express=require('express');
var router=express.Router();
var MongoClient=require('mongodb').MongoClient;
const multer=require('multer');
const fs=require('fs');
var path=require('path');
const upload=multer({
    dest:'C:/tmp'
});
var url='mongodb://127.0.0.1:27017';
var async = require('async');
// 新增手机
router.post('/add',upload.single('phoneImg'),function(req,res){  
    fs.readFile(req.file.path,function(err,fileData){
        if(err){
            console.log('读取失败')
            res.send({msg:'读取文件失败'})
        }else{
            var fileName=new Date().getTime()+'_'+req.file.originalname;
            var dest_path=path.resolve(__dirname,"../public/phones",fileName);
            fs.writeFile(dest_path,fileData,function(err){
                if(err){
                    console.log('写入失败')
                   res.send({msg:'写入文件失败'}) 
                }else{
                    MongoClient.connect(url,function(err,client){
                        if(err){
                            res.send({msg:'连接数据库失败'})
                        }else{
                            var db=client.db('user');
                            var saveData=req.body;
                             saveData.phoneHref=fileName;
                             console.log(req.body)
                             db.collection('phone').find().count(function(err,num){
                                if(err) { 
                                    res.send({msg:'查询用户记录条数失败'});
                                }else{
                                    saveData._id=num+1;
                                    db.collection('phone').insertOne(saveData,function(err){
                                        if(err){
                                            res.send({msg:'插入数据库失败'})
                                        }else{
                                            res.send('/phone-manager.html')
                                            client.close();   
                                        }     
                                    })    
                                }
                            })    
                           
                        }
                    })
                }
            })
        }
    })
   
})
    // 修改
 router.post('/update',upload.single('phoneImg'),function(req,res){  
        fs.readFile(req.file.path,function(err,fileData){
            if(err){
                console.log('读取失败')
                res.send({msg:'读取文件失败'})
            }else{
                var fileName=new Date().getTime()+'_'+req.file.originalname;
                var dest_path=path.resolve(__dirname,"../public/phones",fileName);
                fs.writeFile(dest_path,fileData,function(err){
                    if(err){
                        console.log('写入失败')
                       res.send({msg:'写入文件失败'}) 
                    }else{
                        MongoClient.connect(url,function(err,client){
                            if(err){
                                res.send({msg:'连接数据库失败'})
                            }else{
                                var db=client.db('user');
                                var saveData=req.body;
                                var id=parseInt(saveData.id)
                                 saveData.phoneHref=fileName;
                                 db.collection('phone').update({_id:id},
                                    {$set:{
                                        phoneName:saveData.phoneName,
                                        phoneBrand:saveData.phoneBrand,
                                        phonePrice:saveData.phonePrice,
                                        recoverPrice:saveData.recoverPrice,
                                        phoneHref:saveData.phoneHref
                                        }
                                    },function(err){
                                       if(err){
                                          res.send({msg:"查询数据库失败"})
                                       }else{
                                            res.send({msg:'修改手机成功'})}
                                   })
                            }
                        })
                    }
                })
            }
        })
    })
        // 删除
router.get('/del',function(req,res){   
   var id=req.query.id ;
   MongoClient.connect(url,function(err,client){
        if(err){res.send({msg:'连接数据库失败'});
        }else{
        const db=client.db('user');
        async.parallel([
           function(callback) {
               db.collection('phone').remove({_id:parseInt(id)},function(err){
                   if(err){
                       callback({msg:"删除失败"})
                   }else{
                       callback(null);
                       console.log(id)
                   }
               })
            }], 
            function(err,results){
            
                if(err){res.send(err)
                }else{
                    res.redirect('/phone-manager.html')
                    res.send("删除成功")
                }
            })     
        client.close();  
        }
    }) 
})   
    // 加载数据
router.get('/list',function(req,res){
    console.log('1111111');
    var page=parseInt(req.query.page);
    var pageSize=parseInt(req.query.pageSize);
    MongoClient.connect(url,function(err,client){
        if(err){
            res.send({msg:'连接数据库失败'})
        }else{
            var db= client.db('user');
            async.parallel([
                function(callback){
                    db.collection('phone').find().count(function(err,num){
                        if(err){
                            callback({msg:'查询数据库失败'})
                        }else{
                            totalPage=Math.ceil(num/pageSize);
                            callback(null,{
                                totalPage:totalPage,
                                num:num
                            });
                        }
                    })
                },
                function(callback){
                    db.collection('phone').find().limit(pageSize).skip(page*pageSize-pageSize).toArray(function(err,array){
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
                    /*res.send({msg:'查询成功',data:{
                        list:results[1],
                        totalPage:results[0].totalPage,
                        count:results[0].num,
                        pageSize:pageSize
                    }
                     });*/
                     res.send(results);
                    console.log(results)
                }
            })
            client.close();
        }
    })
})

 module.exports=router;