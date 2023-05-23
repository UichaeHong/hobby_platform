exports.logined = (req, res, next)=>{
  if (req.isAuthenticated()) {
    next();
  }else{
    res.send("<script>location.href='/main'; alert('로그인하세요')</script>");
  }
}