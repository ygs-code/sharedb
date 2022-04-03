/*
 * @Date: 2022-03-31 09:46:25
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-02 18:59:41
 * @FilePath: /sharedb/examples/textarea/client.js
 * @Description:
 */

// sharedb 协同
import sharedb from "sharedb/lib/client"; 
// websocket 连接
import ReconnectingWebSocket from "reconnecting-websocket"; 

// 绑定
var StringBinding = require("sharedb-string-binding");
// socket
var socket = new ReconnectingWebSocket("ws://" + window.location.host);

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
var doc = connection.get("examples", "textarea");
doc.subscribe(function (err) {
  if (err) throw err;

  var binding = new StringBinding(element, doc, ["content"]);
  binding.setup();
});
