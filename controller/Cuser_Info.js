const passport = require("passport");
const {createCryptoPassword} = require('../utils/Encrypt')
require('../passport/localStrategy')

const User_Info = require('../models/User_Info')
//(?)
exports.Login = (req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            console.error(err)
            return next(err)
        }
        if(!user){
            return res.send("<script>location.href='/login'; alert('비밀번호가 일치하지 않습니다!');</script>");
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.log(loginError)
                return next(loginError)
            }
            return res.redirect('/main')
        })
    })(req,res,next)
}

// 로그아웃
exports.Logout = (req,res)=>{
    req.logout()
    req.session.destroy()
    res.redirect('/')
}

// 회원가입
exports.Signup = async (req, res) => {
    const r = req.body;
    console.log(r)
    let cryptoPassword = await createCryptoPassword(r.pw);
    const result = await User_Info.find({id : r.id})
    console.log('res!: ',result)
    if(result.length===0){
        User_Info.create(
            {
              name: r.name,
              birthday: r.birthday,
              email: r.id,
              pw: cryptoPassword.password,
              salt: cryptoPassword.salt,
              gender: r.gender,
            }).then((re)=>{
                console.log('유저정보 저장 완료')
            }).catch((err)=>{
                console.log(err)
            })
        res.redirect("/login");
    }
    else{
        console.log("중복자 발견");
        res.send("<script>location.href='/signup'; alert('ID가 중복되었어요!');</script>");
    }
};