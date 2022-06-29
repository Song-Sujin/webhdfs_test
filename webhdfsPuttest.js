var WebHDFS = require("webhdfs");
var hdfs = WebHDFS.createClient();
var fs = require("fs");
var express = require("express");
var app = express();

//var fileupload = require("express-fileupload");
//app.use(fileupload());

// body-parser 설정
//var bodyParser = require("body-parser");
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 객체 생성
var hdfs = WebHDFS.createClient({
  user: "hdfs",
  host: "192.168.100.177",
  port: 50070,
  path: "/webhdfs/v1",
});

var form =
  "<!DOCTYPE HTML><html><body>" + "<form method='post' action='/upload' enctype='multipart/form-data'>" + "<input type='file' name='image'/>" + "<input type='submit' /></form>" + "</body></html>";

//app.set("view engine", "pug");
app.get("/upload", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(form);
});

app.post("/upload", function (req, res) {
  //console.log("body : %j", req.files.userfiles);
  //console.log(req.files.tempFilePath);
  //console.log(req.body);
  console.log(req.files);
  console.log(req.bodyParser);
  //console.log(req);

  //console.log(req.body);
  //console.log(req.files.userfiles);
  // 파일 PUT 하기
  // 파일을 가져올 곳
  console.log("__dirname : " + __dirname + "/uploads/adminmain.PNG");
  var localFileStream = fs.createReadStream("C:\\sujin\\testfile.txt");
  // 파일을 저장할 곳
  var remoteFileStream = hdfs.createWriteStream("/platform/testfile.txt");

  localFileStream.pipe(remoteFileStream);

  remoteFileStream.on("error", function onError(err) {
    // Do something with the error
    console.log("error : " + err);
  });

  remoteFileStream.on("finish", function onFinish() {
    // Upload is done
    console.log("success");
  });

  res.send("uploaded");
});

app.listen(8081, () => {
  console.log("connecting server: http://localhost:" + 8081);
});
