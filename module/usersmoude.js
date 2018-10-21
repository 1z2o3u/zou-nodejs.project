


const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const sync=require('sync')

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
               repassword:data.password,
               phone:data.phone,
               isAdmin:data.isAdmin
                }

            if(db.collection('users').find({username:data.username}).count(function(err,num){

                    if(err) { 
                        cb({msg:'查询用户是否存在失败'});
                        client.close();
                    }
                    else if(num==0){
                        db.collection('users').find().count(function(err,num){
                            if(err) { 
                                cb({msg:'查询用户记录条数失败'});
                                client.close();
                            }
                            Data._id=num+1;
                                console.log(num);
                                //将注册用户插入数据库
                            db.collection('users').insertOne(Data,function(err){
                                if(err) { 
                                        cb({msg:'用户注册失败'});
                                } 
                                console.log(Data);
                                cb(null);  
                            });
                            client.close();
                        });
                    }else{
                        cb({msg:'用户名已存在'});  
                        client.close();
                    }
                       
            }));
         })
    }
  


    
}

module.exports=usersmoude;

