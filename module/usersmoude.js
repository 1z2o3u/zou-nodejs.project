

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const async=require('async')
const usersmoude={
    // 注册操作
    /**
     * 
     * @param {Object} data  注册信息
     * @param {Function} cb回调函数
     */
    //  后台数据库验证（add)
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err) {
                console.log('连接数据库失败') ;
                cb({msg:'链接数据库失败'});
                return;
            }
            const db=client.db('user');
              let Data={
               username:data.username,
               password:data.password,
               nickname:data.nickname,
               repassword:data.repassword,
               phone:data.phone,
               isAdmin:data.isAdmin
                }
            db.collection('users').find({username:data.username}).count(function(err,num){
                    if(err) { 
                        cb({msg:'查询用户是否存在失败'});
                        client.close();
                        console.log(num);
                    }
                    else if(num==0){
                        db.collection('users').find().count(function(err,num){
                            if(err) { 
                                cb({msg:'查询用户记录条数失败'});
                                client.close();
                            }
                            Data._id=num+1;
                            console.log(Data);
                            //将注册用户插入数据库
                            db.collection('users').insertOne(Data,function(err){
                                if(err) { 
                                        cb({msg:'用户注册失败'});      
                                } 
                                console.log(Data);
                                cb(null);  
                                client.close();
                            });
                        });
                    }else{
                        cb({msg:'用户名已存在'});  
                        client.close();
                    }   
            });
         });
    },
  

    // 登录验证
   login(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err){
                cb({msg:'连接数据库失败'});
            }else{
                const db=client.db('user');
                    db.collection('users').find({
                    username:data.username,
                    password:data.password
                }).toArray(function(err,data){
                    if(err){cb({msg:err});client.close();}
                    else if(data.length<=0){
                            cb({msg:'用户名或密码错误'});
                    }else{cb(null,{
                            username:data[0].username,
                            isAdmin:data[0].isAdmin,
                            nickname:data[0].nickname
                         })
                    }
                    client.close();
                });
               
            }
        })
   },

//    加载用户数据、搜索昵称
   getUserList(data,cb){
       MongoClient.connect(url,function(err,client){
           if(err){cb({msg:'连接数据库失败'});
           }else{
               const db=client.db('user');
               var skipNum=data.page*data.pageSize-data.pageSize;
               async.parallel([
                  function(callback) {
                      db.collection('users').find().count(function(err,num){
                          if(err){
                              callback({msg:"查询数据库失败"})
                          }else{callback(null,num);}
                      })
                  },
                  

                   function(callback){
                    db.collection('users').find({'nickname':eval('/'+data.nickname+'/')}).toArray(function(err,data){
                        if(err){
                            callback({msg:'查询数据库失败'});
                        }else{callback(null,data)
                        }
                    })
                },
                function(callback){
                    db.collection('users').find().limit(parseInt(data.pageSize)).skip(skipNum).toArray(function(err,data){
                        if(err){
                            callback({msg:'查询数据库失败'});
                        }else if(data._id==""){
                                callback(null,{msg:'没有相关记录'})
                        }else{
                            callback(null,data);
                        }
                    })
                   }] ,  
                
                function(err,results){
                    
                    if(err){cb(err)
                    }else{cb(null,{
                        totalPage:Math.ceil(results[0]/data.pageSize),
                        userList:results[2],
                        nick:results[1],
                        page:data.page,
                        tips:data.nickname,
                        pageSize:data.pageSize
                      })
                    } 
                })
                client.close();
            }
        })
    },

    // 修改
    update(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err){cb({msg:'连接数据库失败'});
            }else{
                const db=client.db('user');
                async.parallel([
                   function(callback) {
                       db.collection('users').update({username:data.username},
                        {$set:{
                            password:data.password,
                            nickname:data.nickname,
                            age:data.age,
                            sex:data.sex,
                            phone:data.phone
                            }
                        },function(err){
                           if(err){
                               callback({msg:"查询数据库失败"})
                           }else{callback(null);}
                       })
                   } ],
                function(err,results){
                    
                    if(err){cb(err)
                    }else{cb(null)
                    }
                })     
               
                client.close();  
            }
        })
    },   
    
    // 删除
    delete(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err){cb({msg:'连接数据库失败'});
            }else{
                const db=client.db('user');
                async.parallel([
                   function(callback) {
                       db.collection('users').deleteOne({username:data.username},function(err){
                           if(err){
                               callback({msg:"删除失败"})
                           }else{
                               callback(null);
                           }
                       })
                    }], 
                function(err,results){
                    
                    if(err){cb(err)
                    }else{cb(null)
                    }
                })     
                console.log(data)
                client.close();  
            }
        })
    }
}

module.exports=usersmoude;
