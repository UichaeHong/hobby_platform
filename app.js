const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
//DB
const MongoClient = require("mongodb").MongoClient;
const URL =
  "mongodb+srv://admin:qwer1234@cluster0.paftxqv.mongodb.net/CODINGON?retryWrites=true&w=majority";
var db;
MongoClient.connect(URL, { useUnifiedTopology: true }, (error, client) => {
  if (error) return console.log("error");
  db = client.db("CODINGON");
  // listen
  app.listen(PORT, () => {
    console.log("listen");
  });
});

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { ReplSet } = require("mongodb/lib/core");

app.use(session({ secret: "비밀코드", resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//로그인
app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (input_id, input_pw, done) {
      console.log(input_id, input_pw);
      db.collection("User_Info").findOne({ id: input_id }, function (err, res) {
        if (err) return done(err);
        if (!res) return done(null, false, { messgae: "Not exist" });
        if (input_pw == res.pw) {
          return done(null, res);
        } else {
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
passport.deserializeUser(function (id, done) {
  done(null, {});
});

// static & views 설정
app.set("view engine", "ejs");
app.set("/views", "views");
app.use("/static", express.static(__dirname + "/static"));

// 나중에 라우팅될 코드 get 요청 이용해서 작성
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/loading", (req, res) => {
  res.render("loading");
});

// 회원가입
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const r = req.body;
  console.log(req.body);
  db.collection("User_Info").insertOne(
    { name: r.name, birthday: r.birthday, id: r.id, pw: r.pw, gender: r.gender },
    function (err, res) {
      console.log("저장완료");
    }
  );
  res.redirect("/");
});
