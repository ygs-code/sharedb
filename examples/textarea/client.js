/*
 * @Date: 2022-03-31 09:46:25
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-21 14:08:23
 * @FilePath: /sharedb/examples/textarea/client.js
 * @Description:
 */

// sharedb 协同
var sharedb = require("../modules/sharedb/lib/client");
ShareDB.types.register(require("rich-text").type);
// websocket 连接
var ReconnectingWebSocket =
  require("../modules/reconnecting-websocket").default;

// console.log('ReconnectingWebSocket=', ReconnectingWebSocket)

//给input添加onChange事件，触发onChange事件 变成op，调用sharedb 发布op消息
var StringBinding = require("../modules/sharedb-string-binding");
// socket

console.log("window.location=", window.location);

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

const { id ,type } = getUrlParams(window.location.href);

var socket = new ReconnectingWebSocket(
  "ws://" + window.location.host + `?id=${id}&type=${type}`
);

var connection = new sharedb.Connection(socket);

// textarea dom
var element = document.querySelector("textarea");
//  dom
var statusSpan = document.getElementById("status-span");

statusSpan.innerHTML = "Not Connected";

element.style.backgroundColor = "gray";
socket.addEventListener("open", function () {
  statusSpan.innerHTML = "Connected";
  element.style.backgroundColor = "white";
});

socket.addEventListener("close", function () {
  statusSpan.innerHTML = "Closed";
  element.style.backgroundColor = "gray";
});

socket.addEventListener("error", function () {
  statusSpan.innerHTML = "Error";
  element.style.backgroundColor = "red";
});

// Create local Doc instance mapped to 'examples' collection document with id 'textarea'
//创建本地文档实例映射到id为“textarea”的“examples”集合文档
// 获取到文档对象
var doc = connection.get(type, id);
// console.log("doc.subscribe=", doc.subscribe);
// 获取到文档对象
doc.subscribe(function (err) {
  if (err) {
    throw err;
  }
  //绑定 input 事件
  var binding = new StringBinding(element, doc, ["content"]);
  // 初始化
  binding.setup();
});
