
//该模板是用来写用户后台数据库处理的代码



const Mongodb=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';

MongoClient.connect(url,function(err,client){
    if(err) throw  err;
    const db=client.db('');
    db.collection('').insertOne();
})