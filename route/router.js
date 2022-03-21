const express = require('express');
const con = require('./control');
const router = express.Router();
const log = require('./session');   //->세션모듈

//get 요청 응답
router.get('/',con.get.home);  //홈페이지
router.get('/join',con.get.join);   //회원가입창
router.get('/login',con.get.login);  //로그인창
router.get('/fail',con.get.fail);    //실패창
router.get('/mypage',log.checkLogin,con.get.mypage);   //마이페이지창
router.get('/logout',log.checkLogin,con.get.logout);   //로그아웃하기
//////////////////// log.checkLogin은 req.user가 있는지 확인한다.(로그인했는지 안했는지)



//post 요청 응답
router.post('/join',con.post.join);  //회원가입요청
router.post('/login',log.passport.authenticate('local',{//->로그인 인증을 통해 세션을 부하한다
    failureRedirect : '/login', 
}),con.post.login);  
router.post('/checkid',con.post.checkid);  //가입시중복아이디 체크
router.post('/pwchange',con.post.pwchange); //비밀번호 변경
///////////////////
module.exports = router;