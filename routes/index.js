var express = require('express');
var router = express.Router();
const usersmoude=require('../module/usersmoude.js');

/* GET home page. */
// 首页
router.get('/', function(req, res, next) {

  if(req.cookies.username) {
  res.render('index', {
    username:req.cookies.username,
    nickname:req.cookies.nickname,
    isAdmin:parseInt(req.cookies.isAdmin) ?'(管理员)':''
   });
  }else{
    res.redirect('/');
  }
});

// 注册页面
router.get('/register.html',function(req,res){
  res.render('register');
});

// 登录页面
router.get('/login.html',function(req,res){
  res.render('login');
});

// 用户管理
router.get('/user-manager.html',function(req,res){
    if(req.cookies.username&&parseInt(req.cookies.isAdmin)){
      let page=req.query.page||1;
      let pageSize=req.query.pageSize||5;
      usersmoude.getUserList({
           page:page,
           pageSize:pageSize
       },function(err,data){
              if(err){
                 res.render('werror',err);
              }else{
                    res.render('user-manager',{
                    username:req.cookies.username,
                    nickname:req.cookies.nickname,
                    isAdmin:parseInt(req.cookies.isAdmin) ?'(管理员)':'',
                    userList:data.userList,
                    totalPage:data.totalPage,
                    page:data.page,
                    tips:data.tips,
                    nick:data.nick,
                    pageSize:req.query.pageSize
                    });  
                    
              }
              
         })
      }
})

  // 查询
router.get('/search.html',function(req,res){
  if(req.cookies.username&&parseInt(req.cookies.isAdmin)){
  let page=req.query.page||1;
  let pageSize=req.query.pageSize||5;
  let nickname=req.query.nickname;
  usersmoude.getUserList({
    page:page,
    pageSize:pageSize,
    nickname:nickname},function(err,data){
        if(err){
          res.render('werror',err);
        }else{
          res.render('user-manager',{
            username:req.cookies.username,
            nickname:req.cookies.nickname,
            isAdmin:parseInt(req.cookies.isAdmin) ?'(管理员)':'',
            userList:data.userList,
            nick:data.nick,
            tips:data.tips,
            totalPage:data.totalPage,
            page:data.page,
            pageSize:req.query.pageSize
            });
        }
    })
  }
})
      // 修改
router.post('/update.html',function(req,res){
  if(req.cookies.username&&parseInt(req.cookies.isAdmin)){
    usersmoude.update({
      username:req.body.username,
      password:req.body.password,
      nickname:req.body.nickname,
      phone:req.body.phone,
      age:req.body.age,
      sex:req.body.sex},function(err,data){
        if(err){
             res.render('werror',{mas:err})
        }else{
           res.redirect('/user-manager.html')
        }
    })
  }          
})
// 删除
router.get('/delete.html',function(req,res){
  if(req.cookies.username&&parseInt(req.cookies.isAdmin)){
    console.log('用户名:',req.query.username)
    usersmoude.delete({
      username:req.query.username},function(err,data){
        if(err){
             res.render('werror',{mas:err})
        }else{
           res.redirect('/user-manager.html')
        }
    })
  }          
})


// 手机管理
router.get('/phone-manager.html',function(req,res){
    if(req.cookies.username){
    res.render('phone-manager',{
      username:req.cookies.username,
      nickname:req.cookies.nickname,
      isAdmin:parseInt(req.cookies.isAdmin) ?'(管理员)':''
    });
  }else{
    res.redirect('login.html');
  }
})


// 品牌管理
router.get('/brand-manager.html',function(req,res){
  if(req.cookies.username){
    res.render('brand-manager',{
    });
  }else{
    res.redirect('login.html');
  }
})




module.exports = router;
