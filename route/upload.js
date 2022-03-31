
const multer = require('multer');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

var db;
var imgnum;
MongoClient.connect(process.env.DB_URL,function(err,client){
    if(err) return console.log(err+'database error');
    db = client.db('web');
})

const profilestorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/views/image');
    },
    filename : function(req,file,cb){
        cb(null , req.user.id + file.originalname);
    }
})

const writeimgst = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null , './public/views/writeimg'); // 저장할 폴더 이름
    },
    filename : function(req , file , cb){
        db.collection('imgnumber').findOne({name : 'imgnumber'},function(err,result){
            if(err) return console.log(err);
            imgnum = result.number;
            cb(null , String(imgnum) + file.originalname );   //-> 저장될 파일이름  img는 앞에 번호를 붙혀서 저장한다
        })
    }
})

//이곳저곳에서 이미지경로들이 다를텐데 여기서 설정해서 exports로 넘겨서 사용하자


// var memstorage = multer.memoryStorage({
//     destination : function(req,file,cb){
//         cb(null,'./public/image/profile');
//     },
//     filename : function(req,file,cb){
//         cb(null , '메모리저장이름');
//     }
// })

const profileupload = multer({storage : profilestorage});
const writeimg = multer({storage : writeimgst});

module.exports = {profileupload , writeimg};