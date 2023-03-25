const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
require("dotenv").config();

//DB
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");
const mongoose = require("mongoose");

var db;
MongoClient.connect(
  process.env.DB_URL,
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) return console.log("error");
    db = client.db("CODINGON");
    // listen
    http.listen(process.env.PORT, () => {
      console.log("listen");
    });
  }
);

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { ReplSet } = require("mongodb/lib/core");
const { currentLogger } = require("mongodb/lib/core/connection/logger");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

//로그인
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/login_fail", (req, res) => {
  res.render("login_fail");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login_fail",
  }),
  function (req, res) {
    res.render("main_logout");
  }
);
app.get("/main_logout", logined, (req, res) => {
  res.render("main_logout");
});

app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    } else {
      console.log("로그아웃됨");
      res.send(
        "<script>location.href='/main'; alert('로그아웃 되었습니다!');</script>"
      );
    }
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (input_id, input_pw, done) {
      db.collection("User_Info").findOne({ id: input_id }, function (err, res) {
        if (err) return done(err);
        if (!res) return done(null, false, { messgae: "Not exist" });
        if (input_pw == res.pw) {
          return done(null, res);
        } else {
          console.log(res);
          return done(null, false, { messgae: "wrong password" });
        }
      });
    }
  )
);

// id를 이용해 세션을 저장(로그인 성공시 발동)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// 마이페이지 접속시
passport.deserializeUser(function (email, done) {
  db.collection("User_Info").findOne({ id: email }, function (err, res) {
    done(null, res);
  });
});

function logined(req, res, next) {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    res.send("<script>location.href='/main'; alert('로그인하세요')</script>");
  }
}
app.get("/DetailedPage/:id", logined, (req, result) => {
  let getId = req.params.id;
  console.log("getId:", getId);
  console.log("getId:", typeof getId);
  db.collection("Room").findOne(
    { _id: mongodb.ObjectId(getId) },
    function (err, res) {
      console.log("방정보", res);
      result.render("DetailedPage", { data: res });
    }
  );
});
// static & views 설정
app.set("view engine", "ejs");
app.set("/views", "views");
app.use("/static", express.static(__dirname + "/static"));

// 바로 지울 코드
app.get("/text", (req, res) => {
  res.render("text");
});
// app.get("/DetailedPage", (req, res) => {
//   res.render("DetailedPage");
// });
// 로딩페이지
app.get("/loading", (req, res) => {
  res.render("loading");
});

// 메인페이지(초기 렌더링)
app.get("/main", (req, result) => {
  db.collection("Room")
    .find()
    .toArray(function (err, res) {
      result.render("main.ejs", { data: res });
    });
});

app.get("/main2", (req, res) => {
  res.render("main2");
});

// 달력 및 인풋 위한 데이터 받아오기
app.get("/getData", (req, result) => {
  db.collection("Room")
    .find()
    .toArray(function (err, res) {
      console.log(res);
      result.send({ data: res });
    });
});

// 회원가입
app.get("/signup", (req, res) => {
  res.render("signup");
});

// 방만들기
app.get("/makeRoom", (req, res) => {
  res.render("makeRoom");
});

app.post("/signup", async (req, result) => {
  const r = req.body;
  // id중복 체크
  await db.collection("User_Info").findOne({ id: r.id }, function (err, res) {
    // 중복자 없으면
    if (res == null) {
      db.collection("User_Info").insertOne(
        {
          name: r.name,
          birthday: r.birthday,
          id: r.id,
          pw: r.pw,
          gender: r.gender,
        },
        function (err, res) {
          console.log("유저정보 저장완료");
        }
      );
      result.redirect("/login");
    } else {
      console.log("중복자 발견");
      result.send(
        "<script>location.href='/signup'; alert('ID가 중복되었어요!');</script>"
      );
    }
  });
});

app.post("/makeRoom", logined, (req, res) => {
  const r = req.body;
  let img_src;
  switch (r.category) {
    case "축구":
      img_src = "../static/img/soccer.jpg";
      break;
    case "야구":
      img_src = "../static/img/baseball.jpeg";
      break;
    case "농구":
      img_src = "../static/img/basketball.jpeg";
      break;
    case "배구":
      img_src = "../static/img/volleyball.jpeg";
    default:
      break;
  }
  console.log(img_src);
  db.collection("Room").insertOne(
    {
      src: img_src,
      title: r.title,
      date: r.date,
      location: r.location,
      personnel: r.personnel,
      price: r.price,
      category: r.category,
    },
    function (err, res) {
      console.log("방정보 저장완료");
    }
  );
  res.redirect("/main_logout");
});

// 채팅
app.get("/chatRoom", (req, res) => {
  res.render("chatRoom");
});

io.on("connection", function (socket) {
  console.log("연결됨");

  socket.on("user-send", function (data) {
    console.log(data);
    io.emit("broadcast", data); // 모든 사람들에게 전송
  });
});
