/*
 * @Date: 2022-03-31 09:46:25
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:22:48
 * @FilePath: /sharedb/examples/counter/server.js
 * @Description: 
 */
var http = require('http');
var express = require('express');
// var ShareDB = require('sharedb');
var ShareDB = require('../modules/sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

var backend = new ShareDB();
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'counter');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create({numClicks: 0}, callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8089);
  console.log('Listening on http://localhost:8080');
}
