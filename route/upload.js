
const multer = require('multer');

const profilestorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/views/image');
    },
    filename : function(req,file,cb){
        cb(null , file.originalname);
    }
})

const writeimgst = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null , './public/views/writeimg'); // 저장할 폴더 이름
    },
    filename : function(req , file , cb){
        cb(null , new Date() + file.originalname );   //-> 저장될 파일이름
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