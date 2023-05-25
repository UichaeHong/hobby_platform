exports.RenderMain = (req,res) =>{
    res.render('main')
}
// 로그인 페이지
exports.RenderLogin = (req, res) => {
    res.render("login");
};

// 회원가입 페이지
exports.RenderSignup = (req, res) => {
    res.render("signup");
};

// 방 생성 페이지
exports.RenderMakeRoom = (req,res)=>{
    res.render('makeRoom')
}

// 채팅 페이지
exports.RenderChat = (req, res) => {
    res.render("chatRoom");
};
