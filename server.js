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
app.use(express.static('./public/views/image'));   //->여기서 이미지프로파일경로를 뒤에 안짜르고 바로쓸려고 정적파일로 만들어버렸다. ex)
app.use(bodyParser.json());                        // /public/views/image/img.jpg -> 이게아니라 ejs에서 img.jpg이것만 쓰기위해 req.file.originalname
app.use(bodyParser.urlencoded({extended : true})); //에서 가져와 삽입해서 바로쓸 수 있게 정적폴더로 바꾸고 쓴다. 다른이미지 폴더도 정적파일로 해서 생성해야됨



app.use('/',router) //->router middle ware
app.listen(process.env.PORT,function(){
    console.log('server on 3030');
})

// 로그인 , 회원가입 , 마이페이지 , 정보 만들기 , 비밀번호변경