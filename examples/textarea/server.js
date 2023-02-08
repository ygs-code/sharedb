/*
 * @Date: 2022-04-19 09:54:46
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-01 17:54:59
 * @FilePath: /sharedb/examples/textarea/server.js
 * @Description:
 */
var http = require("http");
var express = require("express");
// var ShareDB = require("sharedb");
var ShareDB = require("sharedb");
// WebSocket
var WebSocket = require("ws");
var bodyParser = require("body-parser");
// ShareDB.types.register(require("rich-text").type);
// import { WebSocketServer } from 'ws';

var WebSocketJSONStream = require("../modules/@teamwork/websocket-json-stream");
// var WebSocketJSONStream = require("@teamwork/websocket-json-stream");

var backend = new ShareDB();
// 订阅 send 事件
backend.on("send", () => {
  console.log("backend.on(send)");
});

// Create initial document then fire callback
function createDoc(callback, options) {
  const { id, type } = options;
  console.log("options===", options);
  // 客户端
  // 获取 连接对象
  var connection = backend.connect();
  // 获取文档
  var doc = connection.get(type, id);
  // console.log('doc=========',doc)
  // 客户端
  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null) {
      // 创建一个空的文档
      doc.create({ content: "" }, callback);
      return;
    }
    // 服务端
    callback();
  });
}

// 获取回调地址参数
function getUrlParams(url) {
  // 通过 ? 分割获取后面的参数字符串
  let urlStr = url.split("?")[1] || "";

  // 创建空对象存储参数
  let obj = {};
  // 再通过 & 将每一个参数单独分割出来
  let paramsArr = urlStr.split("&");
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    let arr = paramsArr[i].split("=");
    obj[arr[0]] = arr[1];
  }
  return obj;
}

var app = express();
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 应用中间件
app.use(express.json());
app.use(express.urlencoded());
var server = http.createServer(app);

// Connect any incoming WebSocket connection to ShareDB
// var wss = new WebSocket.Server({ server: server });
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", function upgrade(request, socket, head) {
  console.log("request==", request.url);
  const { id, type } = getUrlParams(request.url) || {}; // 如果没有id则不给连接
  console.log("id===", id);
  if (!id || !type) {
    return false;
  }

  //
  wss.handleUpgrade(request, socket, head, function done(ws) {
    // 触发连接
    wss.emit("connection", ws, request, { id, type });
  });
});

wss.on("connection", function (ws, request, options) {
  console.log("connection==========");
  // 创建服务
  createDoc(() => {
    // 远程socket
    var stream = new WebSocketJSONStream(ws);
    // stream.write({
    //   name:'abc'
    // })
    //  console.log('backend.listen1')
    backend.listen(stream);
  }, options);
});

server.listen(8091);

function startServer() {
  // return
  // Create a web server to serve files and listen to WebSocket connections

  console.log("Listening on http://localhost:8091");
}
