exports.logined = (req, res, next)=>{
  console.log(req.user)
  if (req.user) {
    next();
  }else{
    res.send("<script>location.href='/main'; alert('로그인하세요')</script>");
  }
}