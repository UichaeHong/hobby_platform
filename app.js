const express = require("express");
const app = express();
const PORT = 8080;

// static & views 설정
app.set("view engine", "ejs");
app.set("/views", "views");
app.use("/static", express.static(__dirname + "/static"));

app.get("/loading", (req, res) => {
  res.render("loading");
});
// 나중에 라우팅될 코드 get 요청 이용해서 작성
app.get("/main", (req, res) => {
  res.render("main");
});

//포트 열기
app.listen(PORT, () => {
  console.log(PORT + "is open");
  console.log(`http://localhost:${PORT}`);
});
