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
            res.render('index.ejs',{data : req.user.id});   // 로그인한 회원이라면 id값을 보낸다.
        }else{
            res.render('index.ejs',{data : '비회원'})    // 회원이아니라면 '비회원을 보내고'
        }
    },
    join : function(req,res){
        res.render('join.ejs');
    },
    login : function(req,res){
        res.render('login.ejs');
    },
    fail : function(req,res){
        res.send(JSON.stringify(req.user));
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
        var num =parseInt(req.params.num);
        db.collection('write').findOne({number : num},function(err,result){
            if(err) return console.log(err);
            res.render('writemain.ejs',{data : result});
        });
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

            db.collection('write').insertOne({id : req.user.id , title : req.body.writetitle , text : req.body.writetext,number : result.num+1 },function(err,result){
                if(err) return console.log('database err');
                res.redirect('/');
            })
            db.collection('noticeNumber').updateOne({name : 'notice'},{$inc : {num : 1}},function(err, result){
                if(err) return console.log(err)
            })
        })
    }, 
}

module.exports = {get,post};