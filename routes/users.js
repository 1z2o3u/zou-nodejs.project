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
      });
    return;
    }
    usersmoude.add(req.body,function(err){
      console.log(req.body);
      if(err){
        res.render('werror',err)
      }; 
       res. redirect('/login.html');
      });      
});
// 登录处理
router.post('/login',function(req,res){
    usersmoude.login(req.body,function(err,data){
      if(err){
          res.render('werror',err);
      }
      console.log('当前登录信息：',data)
      res.cookie('username',data.username,{
        maxAge:1000*60*100,
      });
      res.cookie('nickname',data.nickname,{
        maxAge:1000*60*100,
      });
      res.cookie('isAdmin',data.isAdmin,{
        maxAge:1000*60*100,
      });
      res. redirect('/');
    });
})
// 退出登录
  router.get('/logout',function(req,res){

    res.clearCookie('username');
    res.clearCookie('nickname');
    res.clearCookie('isAdmin');
    res.redirect('/login.html')
    // res.send('<script>location.replace("users/")</script>');
  })

  


module.exports = router;
