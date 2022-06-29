var WebHDFS = require("webhdfs");
var fs = require("fs");

// 객체 생성
var hdfs = WebHDFS.createClient({
  user: "hdfs",
  host: "192.168.100.177",
  port: 50070,
  path: "/webhdfs/v1",
});

// 파일 Get 하기 시도

// 파일을 가져올 곳
var remoteFileStream = hdfs.createReadStream("/platform/pdftest.pdf");
// 파일을 저장할 곳
var localFileStream = fs.createWriteStream("C:\\sujin\\pdftest123.pdf");

remoteFileStream.pipe(localFileStream);

remoteFileStream.on("error", function onError(err) {
  console.log("errrrrrrr: " + err);
});

remoteFileStream.on("data", function onChunk(chunk) {
  // Do something with the data chunk
  //console.log("data chunkkkkkkkkkkk : " + chunk);
});

remoteFileStream.on("finish", function onFinish() {
  // Upload is done
  console.log("finnnnnnnnnn");
});
