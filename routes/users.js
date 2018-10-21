var express = require('express');
var router = express.Router();
const usersmoude=require('../module/usersmoude.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册处理

router.post('/register',function(req,res){
  console.log('获取传递过来的post请求数据');
    if(!/^[a-zA-Z0-9]{6,10}$/.test(req.body.username)){
      res.render('werror',{
        code:-1,
        msg:'用户名必须由6-10位数字、或字母组成'
      })
      return;
    }
    if(!(req.body.password==req.body.repassword)){
      res.render('werror',{
        code:-1,
        msg:'两次密码不一致'
      })
      return;
    }
    var info=req.body.password==""||req.body.repassword==""||req.body.phone==""||req.body.username=="";
    console.log(info);
    if(info){
      res.render('werror',{
        code:-1,
        msg:'用户名、密码或手机号不能为空'
      })
      return;
    }
    usersmoude.add(req.body,function(err){
      if(err){
        res.render('werror',err)
        }; 
       res. redirect('/login.html');
      });      
});
// 登录处理
router.post('/login',function(req,res){
    usersmoude.login(req.body,function(err){
      if(err){
          res.render('werror',err);
      }
      res. redirect('/');
    });
})
module.exports = router;
