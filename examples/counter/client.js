/*
 * @Date: 2022-03-31 09:46:25
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:35:39
 * @FilePath: /sharedb/examples/counter/client.js
 * @Description:
 */
// import webpack from "webpack";

import ReconnectingWebSocket  from "reconnecting-websocket" 
import sharedb   from "../modules/sharedb/lib/client"

console.log('sharedb=', sharedb)

// Open WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket( "ws://127.0.0.1:8089");
var connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
// 创建本地Doc实例，映射到id为“counter”的“examples”集合文档
var doc = connection.get("examples", "counter");

// Get initial value of document and subscribe to changes
doc.subscribe(showNumbers);
// When document changes (by this client or any other, or the server),
// update the number on the page
doc.on("op", showNumbers);

function showNumbers() {
  document.querySelector("#num-clicks").textContent = doc.data.numClicks;
}

// When clicking on the '+1' button, change the number in the local
// document and sync the change to the server and other connected
// clients
function increment() {
  // Increment `doc.data.numClicks`. See
  // https://github.com/ottypes/json0 for list of valid operations.
  doc.submitOp([{ p: ["numClicks"], na: 1 }]);
}

window.onload = function () {
  var button = document.getElementById("button");
  button.onclick = function () {
    increment();
  };
};

// Expose to index.html
// global.increment = increment;
