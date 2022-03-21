const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.fzemf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',function(err,result){
    if(err) return console.log(err + 'database err');
    db = result.db('web');
})


passport.use(new LocalStrategy({
    usernameField : 'id',
    passwordField : 'pw',
    session : true,
    passReqToCallback : false,
},function(_id , _pw , done){
    db.collection('user').findOne({id : _id},function(err , result){
        if(err) return done(null,false,{msg:'db err'})

        if(!result) return done(null , false , {msg : 'not find id'})

        if(_pw == result.pw){
            return done(null,result)
        }else{
            return done(null , false , {msg : "not find pw"});
        }
    })

}))

function checkLogin(req,res,next){
    if(req.user){ //로그인을 한 상태라면 req.user가 항상 달려있어야한다.
        next();   //로그인을 했다면 다음콜백으로 넘어감
    }else{
        res.redirect('/login'); // 로그인 한상태가 아니라면 다시 로그인 창으로
    }
}

passport.serializeUser(function(user,done){
    done(null , user);
})
passport.deserializeUser(function(user,done){
    db.collection('user').findOne({id : user.id} , function(err, result){
        done(null,result);
    })
    //끌어다 올려서 씀 ex)req.user
    //로그인한 유저의 개인정보를 DB에서 찾는역할
})




module.exports = {passport, session , LocalStrategy,checkLogin};