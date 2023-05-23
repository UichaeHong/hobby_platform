const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {getCryptoPassword} = require('../utils/Encrypt')
const User_Info = require('../models/User_Info')

module.exports = ()=>{
  passport.use(new LocalStrategy({
    usernameField : 'id',
    passwordField : 'pw',
  }, async(user_id,user_pw,done)=>{
    try{
      let result = User_Info.findOne({email:user_id})
      if(result){
        const getcry = getCryptoPassword(user_pw,result.salt)
        if(getcry == result.pw){
          done(null,result)
        }
        else{
          done(null,false,{message:'wrong password'})
        }
      }
      else{
        done(null,false,{message:'not exist'})
      }
    }
    catch(err){
      console.error(err)
      done(err)
    }
  }
  ))
}