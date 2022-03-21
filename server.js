require('dotenv').config();  //-> 환경변수만들어줌
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./route/router');
const log = require('./route/session');

app.use(log.session({secret : 'secretkey' , resave : true , saveUninitialized : false}));
app.use(log.passport.initialize());
app.use(log.passport.session());

app.set('views','./public/views');
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));



app.use('/',router) //->router middle ware
app.listen(process.env.PORT,function(){
    console.log('server on 3030');
})

// 로그인 , 회원가입 , 마이페이지 , 정보 만들기 , 비밀번호변경