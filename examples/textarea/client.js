/*
 * @Date: 2022-03-31 09:46:25
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-21 14:08:23
 * @FilePath: /sharedb/examples/textarea/client.js
 * @Description:
 */

// sharedb 协同
var sharedb = require('../modules/sharedb/lib/client')
// websocket 连接
var ReconnectingWebSocket = require('../modules/reconnecting-websocket').default

// console.log('ReconnectingWebSocket=', ReconnectingWebSocket)

//给input添加onChange事件，触发onChange事件 变成op，调用sharedb 发布op消息 
var StringBinding = require('../modules/sharedb-string-binding')
// socket
var socket = new ReconnectingWebSocket('ws://' + window.location.host)

var connection = new sharedb.Connection(socket)

// textarea dom
var element = document.querySelector('textarea')
//  dom
var statusSpan = document.getElementById('status-span')

statusSpan.innerHTML = 'Not Connected'

element.style.backgroundColor = 'gray'
socket.addEventListener('open', function () {
  statusSpan.innerHTML = 'Connected'
  element.style.backgroundColor = 'white'
})

socket.addEventListener('close', function () {
  statusSpan.innerHTML = 'Closed'
  element.style.backgroundColor = 'gray'
})

socket.addEventListener('error', function () {
  statusSpan.innerHTML = 'Error'
  element.style.backgroundColor = 'red'
})

// Create local Doc instance mapped to 'examples' collection document with id 'textarea'
//创建本地文档实例映射到id为“textarea”的“examples”集合文档
// 获取到文档对象
var doc = connection.get('examples', 'textarea')
// console.log("doc.subscribe=", doc.subscribe);
// 获取到文档对象
doc.subscribe(function (err) {
  if (err) {
    throw err
  }
  //绑定 input 事件
  var binding = new StringBinding(element, doc, ['content'])
  // 初始化
  binding.setup()
})
