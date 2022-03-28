
const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/views/image');
    },
    filename : function(req,file,cb){
        cb(null , file.originalname);
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

const profileupload = multer({storage : storage});

module.exports = {profileupload};