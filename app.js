const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
const cookieParser = require('cookie-parser')
require("dotenv").config();

const passport = require('passport')
const passportConfig = require('./passport')
const session = require("express-session");

passportConfig()

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  session({
    resave: false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie: {
      httpOnly : true,
      secure : false,
    }
  })
)

app.use(passport.initialize());
app.use(passport.session());

const render_router = require('./routes/Render_Router')
const room_router = require('./routes/Room_Router')
const user_router = require('./routes/User_Info_Router')
app.use('/',render_router)
app.use('/',room_router)
app.use('/',user_router)

// static & views 설정
app.set("view engine", "ejs");
app.set("/views", "views");
app.use("/static", express.static(__dirname + "/static"));

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, { dbName: 'CODINGON' });




// =========================================


// 로그인 실패 (뺄거)
// app.get("/login_fail", (req, res) => {
//   res.render("login_fail");
// });

// ====================================
// 채팅 부분
io.on("connection", (socket)=>{
  console.log("연결됨");
  socket.on("user-send",(data)=>{
    io.emit("broadcast", data); // 모든 사람들에게 전송
  });
});

// listen
http.listen(process.env.PORT, () => {
  console.log("listen");
});