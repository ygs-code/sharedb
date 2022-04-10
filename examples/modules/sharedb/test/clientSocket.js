
// 相当于订阅发布，不需要端口号啥的
var StreamSocket = require("../lib/stream-socket");

// 创建 doc socket
var socket = new StreamSocket();




// socket 已经连接上
socket.onopen = function () {
    console.log('onopen=')
};

socket.onerror = function (err) {

};

socket.onclose = function (reason) {

};
// 获取服务端 socket消息
socket.onmessage = function (event) {
    console.log('event=',event)
};
// 客户端推送给服务器
socket.send(JSON.stringify({ name: "hello" }))



// 连上了
socket._open();



// 服务器发送消息客户端
socket.stream.write(JSON.stringify({ name: "你好" }))
// 获取客户端 socket send 信息
socket.stream.on('data',(...ags)=>{
    console.log('data=',ags)
})



