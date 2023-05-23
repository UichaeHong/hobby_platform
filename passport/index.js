const passport = require('passport')
const local = require('./localStrategy')
const User_Info = require('../models/User_Info')

module.exports = ()=>{
    // id를 이용해 세션을 저장(로그인 성공시 발동)
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id,done)=>{
        User_Info.findOne({where:id})
        .then(user => done(null,user))
        .catch(err=>done(err))
    })
    local()
};

 