require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect(process.env.DB_URL,function(err,client){
    if(err) return console.log(err+'database error');
    db = client.db('web');
})

const get = {
    home : function(req,res){
        if(req.user){
            db.collection('user').findOne({id : req.user.id} ,function(err , result){
                if(err) return console.log(err);
                res.render('index.ejs',{data : result});   // 로그인한 회원이라면 id값을 보낸다.
            })
        }else{                          //req.user가 없다면 아무런정보가 없기때문에 data.id , data.imaname 똑같이 보내야 회원이든 비회원이든  
                                        // ejs 에서 읽을 수 있다.  // 회원이아니라면 '비회원을 보내고'
            res.render('index.ejs',{data : {id : '비회원' , imgname : 'defultimg.png'}})    
        }
    },
    join : function(req,res){
        res.render('join.ejs');
    },
    login : function(req,res){
        res.render('login.ejs');
    },
    fail : function(req,res){
        res.render('fail.ejs');
    },
    mypage : function(req, res){
        res.render('mypage.ejs',{data : req.user});
    },
    logout : function(req , res){
        req.logout();
        res.redirect('/');
    },
    write : function(req,res){
        res.render('write.ejs',{data : req.user});
    },
    writelist : function(req,res){
        db.collection('write').find().toArray(function(err,result){
            res.render('writelist.ejs',{data : result});
        })
    },
    ///////////////중요 url에 인자를 담아서 데이터를 보내서 처리함 굉장히 좋은 전략
    writemain : function(req,res){
        //ajax는 render요청이 안되서 url안에 파라미터를 담아서 요청처리함     
        var num = parseInt(req.params.num);
        db.collection('write').findOne({number : num},function(err,result){
            if(err) return console.log(err);
            if(!result){
                res.redirect('/fail');
            }
            // console.log(result.img); //-> 밑에 res.render지우니깐 됨 뭔가 순서문제인듯
            res.render('writemain.ejs',{data : result});
        });
    },
    mylist : function(req,res){
        var name = req.user.id;  // 굳이 url의 파라미터로 받지않아도 user가 있잖아!!
        db.collection('write').find({id : name}).toArray(function(err,result){
            if(result.length === 0){ //DB에 아무런 값이 없다면은 -> 발행한 게시물이 없기때문에 /fail로간다.
                res.redirect('/fail');
            }else{ // 하나라도 쓰면 result.length인 배열이 하나라도 나오기때문에 render해준다.
                res.render('writemylist.ejs',{data : result});
            }
        })
    },
    writechange : function(req,res){
        var num = parseInt(req.params.num);  //--> url에서 넘어온 파라미터 숫자로변경
        db.collection('write').findOne({number : num},function(err , result){
            //-> url을 이용해서 다른계정의 글수정을 들어갈려고하는 것을 막음 (보안)
            //보안보안보안보안보안보안보안보안보안보안보안보안보안보안보안보안보안보안
            if(!result){
                return res.redirect('/fail'); //다른계정글 수정 페이지를 url에 넣어서 침투할려했을때
            }
            if(result.id == req.user.id){   //자기글수정이 자기계정 글수정이 맞는지
                if(err) return res.redirect('/fail');
                res.render('writechange.ejs',{data : result});
            }else{
                res.redirect('/fail');
            }
        })
    },
    search : function(req,res){
        var searchtitle = [
            {
                $search : {
                    index : 'searchTitle',
                    text : {
                        query : req.query.value,
                        path : ['title','text']  //db에 저장된 이름 , 내용도 검색
                    }
                }
            }
        ]

        db.collection('write').aggregate(searchtitle).toArray(function(err,result){
            if(err ) console.log(err);
            res.render('writelist.ejs',{data : result});
        })
    },
    upload : function(req,res){
        res.render('upload.ejs');
    }
}

const post ={
    join : function(req,res){
    
        var user = req.body;

        db.collection('members').findOne({member : 'member'},function(err,result){
            if(err) return console.log(err);

            db.collection('user').insertOne({
                number : result.count+1,
                id : user.id,
                pw : user.pw,
                phoneNumber : user.phone
            },function(err,result){
                console.log('새로운회원 가입 신규_id는  '+result.insertedId);
                res.redirect('/login');
            })

            db.collection('members').updateOne({member:'member'},{$inc : {count : 1}},function(err,result){
                if(err) return console.log('dbupdateerr'+err);
            })
        })
        req.logout();
    },

    login : function(req,res){
        res.redirect('/');
    },

    checkid : function(req,res){
        db.collection('user').findOne({id : req.body.id},function(err,result){
            if(result){//-> 중복된 아이디가 있다면
                res.send({msg : '중복된아이디 입니다' , num : 0})
            }else{
                res.send({msg : '사용가능한 입니다', num :1 })
            }
        })
    },
    pwchange : function(req,res){
        var data = req.body;
        db.collection('user').findOne({id : data.id},function(err , result){
            if(err) return console.log('database err');

            if(data.pw == result.pw){
                db.collection('user').updateOne({id : data.id},{$set:{pw : data.newpw}},function(err,result){
                    req.logout();
                    res.send({msg : '비밀번호변경완료 로그아웃',code : 1});
                })
            }else{
                res.send({msg : '기존비밀번호 틀림'});
            }
        })
    },
    write : function(req,res){
        db.collection('noticeNumber').findOne({name : 'notice'},function(err, result){
            if(err) return console.log(err);
            

            //에러 시발 고쳐야됨 갑자기왜이러냐
            if(!req.file){
                db.collection('write').insertOne({id : req.user.id , title : req.body.writetitle , 
                    text : req.body.writetext,number : result.num+1 },function(err,result){
                    if(err) return console.log('database err');
                    res.redirect('/');
                })
            }else{
                db.collection('write').insertOne({id : req.user.id , title : req.body.writetitle , 
                    text : req.body.writetext,number : result.num+1,img : req.file.filename },function(err,result){
                    if(err) return console.log('database err');
                    res.redirect('/');
                })
            }


            db.collection('noticeNumber').updateOne({name : 'notice'},{$inc : {num : 1}},function(err, result){
                if(err) return console.log(err)
            })
        })
    }, 
    writechange : function(req,res){
        if(req.body.id == req.user.id){
            var title_ = req.body.writetitle_;
            var text_ = req.body.writetext_;
            var num_ = req.body.writenum_;
            num_ = parseInt(num_);
            db.collection('write').updateOne({number : num_},{$set : {title : title_ , text : text_} },function(err,result){
                if(err) return res.redirect('/fail');
                res.send({msg : "게시물 수정완료"})
            })
        }else{
            res.redirect('/fail');
        }
    },
    //삭제 함
    writedelete : function(req,res){
        var num = parseInt(req.body.number);
        db.collection('write').deleteOne({number : num},function(err,result){
            if(err) return console.log(err+'errrrrrrr');
            res.send({msg : 'delete'});
        })
    },
    upload : function(req,res){
         //image폴더 경로찾아보기 dirname의 상위폴더 코드 찾기
        //그리고 이미지 중복저장이안되서 다시한번 찾아봐야됨
        db.collection('user').updateOne({id : req.user.id},{$set : {profile : req.file.path , imgname : req.file.originalname }},function(err,result){
            if(err) return console.log(err)
            res.redirect('/');
        })
    }
}

module.exports = {get,post};