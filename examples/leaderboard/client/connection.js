import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from 'sharedb/lib/client';

// var ReconnectingWebSocket = require('reconnecting-websocket');
// var sharedb = require('sharedb/lib/client');

// Expose a singleton WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

export default connection;

// module.exports = connection;
