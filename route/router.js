const express = require('express');
const con = require('./control');
const router = express.Router();
const log = require('./session');   //->세션모듈
const uploadmoudle = require('./upload'); //-> 만든 upload모듈 불러옴

//get 요청 응답
router.get('/',con.get.home);  //홈페이지
router.get('/join',con.get.join);   //회원가입창
router.get('/login',con.get.login);  //로그인창
router.get('/fail',con.get.fail);    //실패창
router.get('/mypage',log.checkLogin,con.get.mypage);   //마이페이지창
router.get('/logout',log.checkLogin,con.get.logout);   //로그아웃하기
router.get('/write',log.checkLogin,con.get.write);
router.get('/write/list',log.checkLogin,con.get.writelist);
router.get('/writemain/:num',log.checkLogin,con.get.writemain);
router.get('/writemain/writechange/:num',log.checkLogin,con.get.writechange);
router.get('/write/list/mylist/:id',log.checkLogin,con.get.mylist);
router.get('/writesearch',log.checkLogin,con.get.search);
router.get('/upload',log.checkLogin,con.get.upload);
//////////////////// log.checkLogin은 req.user가 있는지 확인한다.(로그인했는지 안했는지)



//post 요청 응답
router.post('/join',con.post.join);  //회원가입요청
router.post('/login',log.passport.authenticate('local',{//->로그인 인증을 통해 세션을 부하한다
    failureRedirect : '/login', 
}),con.post.login);  
router.post('/checkid',con.post.checkid);  //가입시중복아이디 체크
router.post('/pwchange',con.post.pwchange); //비밀번호 변경
router.post('/write',con.post.write);
router.post('/writemain/writechange',log.checkLogin,con.post.writechange);
router.post('/write/delete',log.checkLogin,con.post.writedelete);
router.post('/upload',log.checkLogin,uploadmoudle.profileupload.single('img'),con.post.upload);
///////////////////
module.exports = router;