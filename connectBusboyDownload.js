var WebHDFS = require("webhdfs");
var hdfs = WebHDFS.createClient();
var fs = require("fs");

var express = require("express");

var app = express();
const busboy = require("connect-busboy");
app.use(busboy());

// 객체 생성
var hdfs = WebHDFS.createClient({
  user: "hdfs",
  host: "192.168.100.177",
  port: 50070,
  path: "/webhdfs/v1",
});

app.set("view engine", "pug");
//app.set("views", path.join(__dirname, "html"));

app.get("/upload", function (req, res) {
  res.render("upload");
});

app.post("/upload", function (req, res) {
  var fstream;
  req.pipe(req.busboy);
  var counter;

  req.busboy.on("file", function (filedname, file, filename) {
    console.log("Uploading: " + filename.filename);

    // 다시 확인 필요
    fstream = hdfs.createReadStream("/platform/");
    fstream = hdfs.createWriteStream("/platform/" + filename.filename);
    file.pipe(fstream);
    counter++;
  });
  res.send("uploaded");
});

app.listen(3000, () => {
  console.log("connecting server: http://localhost:" + 3000);
});
