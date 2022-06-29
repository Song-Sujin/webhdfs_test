var WebHDFS = require("webhdfs");
var hdfs = WebHDFS.createClient();
var fs = require("fs");

var express = require("express");
var multer = require("multer"); // multer 모듈 적용하기
var _storage = multer.diskStorage({
  // {}안에 있는건 객체를 표현한다. destination과 filename. 둘다 함수다.
  destination: function (req, file, cb) {
    // 사용자가 전송한 파일을 어느 디렉토리에 저장할 것인가
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // 사용자가 전송한 파일의 이름을 어떻게 할 것인가
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: _storage }).single("userfiles");
// 1mb 용량 제한
//var upload = multer({ storage: _storage, limits: { fileSize: 1024 * 1024 } }).single("userfiles");
//var upload = multer({ storage: _storage });
//var upload = multer({ dest: "uploads/" }); // 입력한 파일이 uploads/ 폴더 내에 저장된다. 미들웨어를 리턴한다.
var app = express();

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

// view단에서 post로 전송한 데이터를 여기서 처리
// 두번째 인자 : 미들웨어. 저 미들웨어는 세번째 인자인 function이 실행되기 전에 실행이 된다.
// 사용자가 전송한 데이터에서 만약에 파일이 포함되어 있다면, 그 파일을 가공해서 request객체의 파일 이라는 property를 암시적으로 추가하도록 약속되어 있는 함수
// 정확하게는 미들웨어.
// 그러고 나서 function이 실행이 되는데, 그 때 request객체 안에 파일이라는 property가 포함되어 있다.
// 정리하면 중간의 저 미들웨어는, 세번째 인자인 함수가 실행되기 전에 먼저 실행이 되서,
// 저 함수가 받을 request 객체의 파일이라는 property에 사용자가 전송한 파일에 대한 정보를 넣어줌
// 따라서 우리는 저 req.file이라는 property를 통해서 여러가지 정보를 알아낼 수 있음

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // 업로드시 multer 에러 발생 ex. 파일용량제한
      console.log("multer error : " + err);
    } else if (err) {
      // 업로드시 그냥 에러 발생
      console.log("unknown error : " + err);
    } else {
      // 에러 발생하지 않았을 경우
      console.log("req.file.path : " + req.file.path);
      //res.set({ "content-type": "application/json; charset=utf-8" });
      //res.send("Uploaded : " + req.files[0].filename + " + " + req.files[1].filename);

      // 파일을 가져올 곳
      var localFileStream = fs.createReadStream(__dirname + "/" + req.file.path);
      // 파일을 저장할 곳
      var remoteFileStream = hdfs.createWriteStream("/platform/" + req.file.filename);

      localFileStream.pipe(remoteFileStream);

      remoteFileStream.on("error", function onError(err) {
        // Do something with the error
        console.log("error : " + err);
      });

      remoteFileStream.on("finish", function onFinish() {
        // Upload is done
        console.log("success");
      });

      res.send("uploaded : " + req.file.filename);
    }
  });
});

app.listen(3000, () => {
  console.log("connecting server: http://localhost:" + 3000);
});
