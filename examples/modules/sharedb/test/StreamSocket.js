/*
 * @Date: 2022-04-19 09:54:46
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-19 10:41:07
 * @FilePath: /sharedb/examples/modules/sharedb/test/StreamSocket.js
 * @Description: 
 */
var async = require("async");
var Agent = require("../lib/agent.js");
var Connection = require("../lib/client/connection");
var emitter = require("../lib/emitter");
var MemoryDB = require("../lib/db/memory");
var NoOpMilestoneDB = require("../lib/milestone-db/no-op");
var MemoryPubSub = require("../lib/pubsub/memory");
var ot = require("../lib/ot");
var projections = require("../lib/projections");
var QueryEmitter = require("../lib/query-emitter");
var ShareDBError = require("../lib/error");
var Snapshot = require("../lib/snapshot");
var StreamSocket = require("../lib/stream-socket");
var SubmitRequest = require("../lib/submit-request");
var ReadSnapshotsRequest = require("../lib/read-snapshots-request");
var util = require("../lib/util");
var logger = require("../lib/logger");

// 获取连接文档
connect = function (connection, req, callback) {
    // console.log("connection======", connection);
    // console.log("req======", req);
    // console.log("callback======", callback);

    // 创建 doc socket
    var socket = new StreamSocket();
    if (connection) {
        connection.bindToSocket(socket);
    } else {
        connection = new Connection(socket);
    }

    // socket.open=function(){
    //     console.log('open===')
    // }

    socket.onclose('open',()=>{
        // console.log('open===')
    })
    socket._open();

    socket.stream.write (JSON.stringify({name:"你好"}))


    // console.log('this.listen2=')
    // console.log('socket===================', socket)
    // var agent = this.listen(socket.stream, req);
    // Store a reference to the agent on the connection for convenience. This is
    // not used internal to ShareDB, but it is handy for server-side only user
    // code that may cache state on the agent and read it in middleware
    // connection.agent = agent;

    if (typeof callback === "function") {
        connection.once("connected", function () {
            callback(connection);
        });
    }

    return connection;
};



// 获取 连接对象
var connection = connect();
// 获取文档
var doc = connection.get("examples", "textarea");

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