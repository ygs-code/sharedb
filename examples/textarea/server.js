var http = require("http");
var express = require("express");
// var ShareDB = require("sharedb");
var ShareDB = require("../modules/sharedb");
// WebSocket
var WebSocket = require("ws");

var WebSocketJSONStream = require("../modules/@teamwork/websocket-json-stream");
// var WebSocketJSONStream = require("@teamwork/websocket-json-stream");

var backend = new ShareDB();
// 订阅 send 事件
backend.on('send',()=>{
  console.log('backend.on(send)')
})
 
 

// Create initial document then fire callback
function createDoc(callback) {
  // 获取 连接对象
  var connection = backend.connect();
  // 获取文档
  var doc = connection.get("examples", "textarea");
  console.log('doc=========',doc)
  //
  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null) {
      // 创建一个空的文档
      doc.create({ content: "" }, callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static("static"));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({ server: server });
  wss.on("connection", function (ws) {
    console.log('connection==========')
    var stream = new WebSocketJSONStream(ws);
    // stream.write({
    //   name:'abc'
    // })
   console.log('backend.listen1') 
    backend.listen(stream);
  });

  server.listen(8080);
  console.log("Listening on http://localhost:8080");
}


// 创建服务
createDoc(startServer);
