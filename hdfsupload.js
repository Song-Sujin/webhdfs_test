var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");

// bodyParser 설정
//app.use(express.bodyParser());

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("connecting server: http://localhost:" + 3000);
});

app.get("/", function (req, res) {
  res.render("index");
});

// 파일 업로드 라우팅 설정
app.post("/uploadfile", function (req, res) {
  // bodyParser 없을 경우 req.files 에러 발생
  console.log("req.files : " + req.files);
});
