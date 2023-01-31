var Doc = require("./doc");
var Query = require("./query");
var Presence = require("./presence/presence");
var DocPresence = require("./presence/doc-presence");
var SnapshotVersionRequest = require("./snapshot-request/snapshot-version-request");
var SnapshotTimestampRequest = require("./snapshot-request/snapshot-timestamp-request");
var emitter = require("../emitter");
var ShareDBError = require("../error");
var types = require("../types");
var util = require("../util");
var logger = require("../logger");

var ERROR_CODE = ShareDBError.CODES;

// 如果状态等于 0 或者 1 那么 就是在连接中
function connectionState(socket) {
  if (socket.readyState === 0 || socket.readyState === 1) return "connecting";
  return "disconnected";
}

/**
 * Handles communication with the sharejs server and provides queries and
 * documents.
 *
 * We create a connection with a socket object
 *   connection = new sharejs.Connection(sockset)
 * The socket may be any object handling the websocket protocol. See the
 * documentation of bindToSocket() for details. We then wait for the connection
 * to connect
 *   connection.on('connected', ...)
 * and are finally able to work with shared documents
 *   connection.get('food', 'steak') // Doc
 *
 * @param socket @see bindToSocket
*处理与sharejs服务器的通信，并提供查询和
*文档。
＊
通过socket对象创建一个连接
 */
module.exports = Connection;
// 构造函数
function Connection(
  socket //socket对象
) {
  // 引入 events 模块 发布订阅事件
  emitter.EventEmitter.call(this);

  // Map of collection -> id -> doc object for created documents.
  // (created documents MUST BE UNIQUE)
  //集合的映射-> id ->文档对象创建的文档。
  //创建的文档必须是唯一的
  this.collections = {};

  // Each query and snapshot request is created with an id that the server uses when it sends us
  // info about the request (updates, etc)
  //每个查询和快照请求都创建了一个id，当服务器发送给我们时使用这个id
  //请求的信息(更新等)
  this.nextQueryId = 1;
  this.nextSnapshotRequestId = 1;

  // Map from query ID -> query object.
  //从查询ID ->查询对象映射。
  this.queries = {};

  // Maps from channel -> presence objects
  //从channel ->存在对象映射
  this._presences = {};

  // Map from snapshot request ID -> snapshot request
  //映射快照请求ID ->快照请求
  this._snapshotRequests = {};

  // A unique message number for the given id
  //给定id的唯一消息号
  this.seq = 1;

  // A unique message number for presence
  this._presenceSeq = 1;

  // Equals agent.src on the server
  this.id = null;

  // This direct reference from connection to agent is not used internal to
  // ShareDB, but it is handy for server-side only user code that may cache
  // state on the agent and read it in middleware
  this.agent = null;

  this.debug = false;
  //获取连接状态 如果状态等于 0 或者 1 那么 就是在连接中
  this.state = connectionState(socket);

  this.bindToSocket(socket);
}
emitter.mixin(Connection);

/**
 * Use socket to communicate with server
 *
 * Socket is an object that can handle the websocket protocol. This method
 * installs the onopen, onclose, onmessage and onerror handlers on the socket to
 * handle communication and sends messages by calling socket.send(message). The
 * sockets `readyState` property is used to determine the initaial state.
 *
 * @param socket Handles the websocket protocol
 * @param socket.readyState
 * @param socket.close
 * @param socket.send
 * @param socket.onopen
 * @param socket.onclose
 * @param socket.onmessage
 * @param socket.onerror
 */
// 绑定 Socket
Connection.prototype.bindToSocket = function (socket) {
  if (this.socket) {
    // 关闭连接
    this.socket.close();
    this.socket.onmessage = null;
    this.socket.onopen = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
  }

  this.socket = socket;

  // State of the connection. The corresponding events are emitted when this changes
  //
  // - 'connecting'   The connection is still being established, or we are still
  //                    waiting on the server to send us the initialization message
  // - 'connected'    The connection is open and we have connected to a server
  //                    and recieved the initialization message
  // - 'disconnected' Connection is closed, but it will reconnect automatically
  // - 'closed'       The connection was closed by the client, and will not reconnect
  // - 'stopped'      The connection was closed by the server, and will not reconnect
  // 获取最新的状态
  var newState = connectionState(socket);
  // 设置socket状态
  this._setState(newState);

  // This is a helper variable the document uses to see whether we're
  // currently in a 'live' state. It is true if and only if we're connected
  this.canSend = false;

  var connection = this;
  // 获取socket消息
  socket.onmessage = function (event) {
    // console.log("event=", event);

    try {
      var data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch (err) {
      logger.warn("Failed to parse message", event);
      return;
    }

    if (connection.debug) {
      logger.info("RECV", JSON.stringify(data));
    }

    var request = { data: data };
    connection.emit("receive", request);
    if (!request.data) return;

    try {
      // 接收到服务器消息
      console.log("接收到后台服务器消息:", request.data);
      connection.handleMessage(request.data);
    } catch (err) {
      util.nextTick(function () {
        connection.emit("error", err);
      });
    }
  };

  // If socket is already open, do handshake immediately. //如果socket已经打开，立即握手。
  // 如果socket已经打开，则先发一个 hs 给服务器
  if (socket.readyState === 1) {
    connection._initializeHandshake();
  }

  // socket 已经连接上
  socket.onopen = function () {
    // 设置状态
    connection._setState("connecting");

    connection._initializeHandshake();
  };

  socket.onerror = function (err) {
    // This isn't the same as a regular error, because it will happen normally
    // from time to time. Your connection should probably automatically
    // reconnect anyway, but that should be triggered off onclose not onerror.
    // (onclose happens when onerror gets called anyway).
    connection.emit("connection error", err);
  };

  socket.onclose = function (reason) {
    // node-browserchannel reason values:
    //   'Closed' - The socket was manually closed by calling socket.close()
    //   'Stopped by server' - The server sent the stop message to tell the client not to try connecting
    //   'Request failed' - Server didn't respond to request (temporary, usually offline)
    //   'Unknown session ID' - Server session for client is missing (temporary, will immediately reestablish)

    if (reason === "closed" || reason === "Closed") {
      connection._setState("closed", reason);
    } else if (reason === "stopped" || reason === "Stopped by server") {
      connection._setState("stopped", reason);
    } else {
      connection._setState("disconnected", reason);
    }
  };
};

/**
 * @param {object} message
 * @param {string} message.a action
 */
// websocket 响应信息
Connection.prototype.handleMessage = function (message) {
  console.log("handleMessage=", message);

  var err = null;
  if (message.error) {
    err = wrapErrorData(message.error, message);
    delete message.error;
  }
  // Switch on the message action. Most messages are for documents and are
  // handled in the doc class.
  //打开消息动作。大多数消息都是用于文档的
  //在doc类中处理。
  switch (message.a) {
    case "init":
      // Client initialization packet
      // 初始化 获取到服务器init 信息的时候  会推送"hs" 给服务器
      // 初始化告诉服务器 客户端已经连上   设置已经连上状态
      return this._handleLegacyInit(message);
    case "hs":
      // 设置已经连上状态 告诉服务器 客户端socket已经连上
      return this._handleHandshake(err, message);
    case "qf":
      var query = this.queries[message.id];
      if (query) query._handleFetch(err, message.data, message.extra);
      return;
    case "qs":
      var query = this.queries[message.id];
      if (query) query._handleSubscribe(err, message.data, message.extra);
      return;
    case "qu":
      // Queries are removed immediately on calls to destroy, so we ignore
      // replies to query unsubscribes. Perhaps there should be a callback for
      // destroy, but this is currently unimplemented
      return;
    case "q":
      // Query message. Pass this to the appropriate query object.
      var query = this.queries[message.id];
      if (!query) return;
      if (err) return query._handleError(err);
      if (message.diff) query._handleDiff(message.diff);
      if (message.hasOwnProperty("extra")) query._handleExtra(message.extra);
      return;

    case "bf":
      return this._handleBulkMessage(err, message, "_handleFetch");
    case "bs":
    case "bu":
      return this._handleBulkMessage(err, message, "_handleSubscribe");

    case "nf":
    case "nt":
      return this._handleSnapshotFetch(err, message);

    case "f":
      var doc = this.getExisting(message.c, message.d);
      if (doc) doc._handleFetch(err, message.data);
      return;
    case "s":
    case "u":
      var doc = this.getExisting(message.c, message.d);
      if (doc) doc._handleSubscribe(err, message.data);
      return;
    // op 增量
    case "op":
      var doc = this.getExisting(message.c, message.d);
      if (doc) {
        doc._handleOp(err, message);
      }
      return;
    case "p":
      return this._handlePresence(err, message);
    case "ps":
      return this._handlePresenceSubscribe(err, message);
    case "pu":
      return this._handlePresenceUnsubscribe(err, message);
    case "pr":
      return this._handlePresenceRequest(err, message);

    default:
      logger.warn("Ignoring unrecognized message", message);
  }
};

function wrapErrorData(errorData, fullMessage) {
  // wrap in Error object so can be passed through event emitters
  var err = new Error(errorData.message);
  err.code = errorData.code;
  if (fullMessage) {
    // Add the message data to the error object for more context
    err.data = fullMessage;
  }
  return err;
}

Connection.prototype._handleBulkMessage = function (err, message, method) {
  if (message.data) {
    for (var id in message.data) {
      var dataForId = message.data[id];
      var doc = this.getExisting(message.c, id);
      if (doc) {
        if (err) {
          doc[method](err);
        } else if (dataForId.error) {
          // Bulk reply snapshot-specific errorr - see agent.js getMapResult
          doc[method](wrapErrorData(dataForId.error));
        } else {
          doc[method](null, dataForId);
        }
      }
    }
  } else if (Array.isArray(message.b)) {
    for (var i = 0; i < message.b.length; i++) {
      var id = message.b[i];
      var doc = this.getExisting(message.c, id);
      if (doc) doc[method](err);
    }
  } else if (message.b) {
    for (var id in message.b) {
      var doc = this.getExisting(message.c, id);
      if (doc) doc[method](err);
    }
  } else {
    logger.error("Invalid bulk message", message);
  }
};

//
Connection.prototype._reset = function () {
  this.agent = null;
};

// Set the connection's state. The connection is basically a state machine. 设置连接的状态。连接基本上是一个状态机。
Connection.prototype._setState = function (newState, reason) {
  // console.log('this.state======',this.state)
  // console.log('newState======',newState)

  if (this.state === newState) return;

  // I made a state diagram. The only invalid transitions are getting to
  // 'connecting' from anywhere other than 'disconnected' and getting to
  // 'connected' from anywhere other than 'connecting'.
  if (
    (newState === "connecting" &&
      this.state !== "disconnected" &&
      this.state !== "stopped" &&
      this.state !== "closed") ||
    (newState === "connected" && this.state !== "connecting")
  ) {
    var err = new ShareDBError(
      ERROR_CODE.ERR_CONNECTION_STATE_TRANSITION_INVALID,
      "Cannot transition directly from " + this.state + " to " + newState
    );
    return this.emit("error", err);
  }

  this.state = newState;
  this.canSend = newState === "connected";

  if (
    newState === "disconnected" ||
    newState === "stopped" ||
    newState === "closed"
  ) {
    this._reset();
  }

  // Group subscribes together to help server make more efficient calls 分组订阅可以帮助服务器进行更高效的呼叫
  this.startBulk();
  // Emit the event to all queries 向所有查询发出事件
  for (var id in this.queries) {
    var query = this.queries[id];
    query._onConnectionStateChanged();
  }
  // console.log(" this.bulk =", this.bulk);
  // Emit the event to all documents 向所有文档发出事件

  for (var collection in this.collections) {
    var docs = this.collections[collection];
    // console.log("docs=", docs);
    for (var id in docs) {
      docs[id]._onConnectionStateChanged();
    }
  }
  // console.log(" this.bulk =", this.bulk);

  // Emit the event to all Presences //向所有存在发出事件
  for (var channel in this._presences) {
    this._presences[channel]._onConnectionStateChanged();
  }
  // console.log(" this.bulk =", this.bulk);
  // Emit the event to all snapshots //将事件发送到所有快照
  for (var id in this._snapshotRequests) {
    var snapshotRequest = this._snapshotRequests[id];
    snapshotRequest._onConnectionStateChanged();
  }
  // console.log(" this.bulk =", this.bulk);

  this.endBulk();

  this.emit(newState, reason);
  this.emit("state", newState, reason);
};
// 设置批量订阅标志
Connection.prototype.startBulk = function () {
  // 批量订阅标志
  if (!this.bulk) {
    this.bulk = {};
  }
};

Connection.prototype.endBulk = function () {
  if (this.bulk) {
    for (var collection in this.bulk) {
      var actions = this.bulk[collection];
      this._sendBulk("f", collection, actions.f);
      this._sendBulk("s", collection, actions.s);
      this._sendBulk("u", collection, actions.u);
    }
  }
  this.bulk = null;
};

Connection.prototype._sendBulk = function (action, collection, values) {
  if (!values) return;
  var ids = [];
  var versions = {};
  var versionsCount = 0;
  var versionId;
  for (var id in values) {
    var value = values[id];
    if (value == null) {
      ids.push(id);
    } else {
      versions[id] = value;
      versionId = id;
      versionsCount++;
    }
  }
  if (ids.length === 1) {
    var id = ids[0];
    this.send({ a: action, c: collection, d: id });
  } else if (ids.length) {
    this.send({ a: "b" + action, c: collection, b: ids });
  }
  if (versionsCount === 1) {
    var version = versions[versionId];
    this.send({ a: action, c: collection, d: versionId, v: version });
  } else if (versionsCount) {
    this.send({ a: "b" + action, c: collection, b: versions });
  }
};

// 发送动作  // 把文档注入到this.collections对象中 ，为this.bulk注入action和版本号
Connection.prototype._sendAction = function (
  action, // 动作
  doc, // 文档对象
  version // 版本号
) {
  // Ensure the doc is registered so that it receives the reply message

  // 把文档注入到this.collections对象中
  this._addDoc(doc);
  // console.log("this.bulk===========", this.bulk);
  // console.log("this.bulk===========", this.bulk);
  // ;
  // console.log('this.bulk12======',this.bulk)
  if (this.bulk) {
    //批量订阅
    // Bulk subscribe  collection 文档集合key
    // actions = this.bulk[doc.collection] = {}
    /*
     actions = this.bulk[doc.collection] = {}
     相当于 this.bulk ={
            [doc.collection] : {}    ,   // 然后等于actions
     } 

     var versions = actions[action] || (actions[action] = {});
     actions[action] = {}
     相当于
    this.bulk ={
            [doc.collection] : {
              [action]:{}  // 然后等于actions
            }    ,  
     } 

     action 如果是 's' 
     那么 
     this.bulk ={
            [doc.collection] : {
              's':{}// 然后等于actions
            }    ,    
     } 


     var versions = actions[action] || (actions[action] = {});
     versions[doc.id] = version; 
     然后  相当于
        this.bulk ={
            [doc.collection] : {
              's':{
                [doc.id]:version
              }
            }    ,   // 然后等于actions
        } 
    */
    var actions = this.bulk[doc.collection] || (this.bulk[doc.collection] = {});
    var versions = actions[action] || (actions[action] = {});
    var isDuplicate = versions.hasOwnProperty(doc.id);
    versions[doc.id] = version; //
    // console.log("version=", version); //
    // console.log("isDuplicate=", isDuplicate); //
    // console.log("this.bulk=", this.bulk);

    return isDuplicate; // false
  } else {
    // Send single doc subscribe message 发送单个文档订阅消息

    var message = { a: action, c: doc.collection, d: doc.id, v: version };
    console.log("message======", message);
    // ;
    this.send(message);
  }
};

Connection.prototype.sendFetch = function (doc) {
  return this._sendAction("f", doc, doc.version);
};

//发送订阅 告诉服务器文档信息 发送s
Connection.prototype.sendSubscribe = function (doc) {
  // 发送客户端文档信息给服务器
  return this._sendAction(
    "s",
    doc, // 文档对象
    doc.version //文档版本号
  );
};

Connection.prototype.sendUnsubscribe = function (doc) {
  return this._sendAction("u", doc);
};

// 发送op给服务器
Connection.prototype.sendOp = function (doc, op) {
  // console.log("sendOp============");
  // ;
  // Ensure the doc is registered so that it receives the reply message
  // 把文档注入到this.collections对象中
  this._addDoc(doc);

  var message = {
    a: "op",
    c: doc.collection,
    d: doc.id,
    v: doc.version,
    src: op.src,
    seq: op.seq,
    x: {},
  };
  if ("op" in op) {
    message.op = op.op;
  }
  if (op.create) {
    message.create = op.create;
  }
  if (op.del) {
    message.del = op.del;
  }
  if (doc.submitSource) {
    message.x.source = op.source;
  }
  // console.log('message2=', message)
  //
  // 发消息给服务器
  // ;
  this.send(message);
};

/**
 * Sends a message down the socket 发送消息给后台服务器
 */
Connection.prototype.send = function (message) {
  console.log("发送消息给后台服务器=", message);
  // ;
  if (this.debug) {
    logger.info("SEND", JSON.stringify(message));
  }

  this.emit("send", message);
  // 发送消息
  this.socket.send(JSON.stringify(message));
};

/**
 * Closes the socket and emits 'closed'
 */
Connection.prototype.close = function () {
  this.socket.close();
};

Connection.prototype.getExisting = function (collection, id) {
  if (this.collections[collection]) {
    return this.collections[collection][id];
  }
};

/**
 * Get or create a document.
 * 获取或创建文档。
 * @param collection
 * @param id
 * @return {Doc}
 */
// 集合 collection 和 文档 id
Connection.prototype.get = function (
  collection, //collections 集合key
  id //文档id 集合key
) {
  var docs =
    this.collections[collection] || (this.collections[collection] = {});

  var doc = docs[id];
  // 如果文档不存在则创建一个文档
  if (!doc) {
    doc = docs[id] = new Doc(this, collection, id);
    this.emit("doc", doc);
  }
  // console.log("doc========", doc);
  // ;
  return doc;
};

/**
 * Remove document from this.collections
 *
 * @private
 */
Connection.prototype._destroyDoc = function (doc) {
  util.digAndRemove(this.collections, doc.collection, doc.id);
};

// 把文档注入到this.collections对象中
Connection.prototype._addDoc = function (doc) {
  // 把文档注入到this.collections对象中
  var docs = this.collections[doc.collection];
  if (!docs) {
    docs = this.collections[doc.collection] = {};
  }
  if (docs[doc.id] !== doc) {
    docs[doc.id] = doc;
  }
};

// Helper for createFetchQuery and createSubscribeQuery, below.
Connection.prototype._createQuery = function (
  action,
  collection,
  q,
  options,
  callback
) {
  var id = this.nextQueryId++;
  var query = new Query(action, this, id, collection, q, options, callback);
  this.queries[id] = query;
  query.send();
  return query;
};

// Internal function. Use query.destroy() to remove queries.
Connection.prototype._destroyQuery = function (query) {
  delete this.queries[query.id];
};

// The query options object can contain the following fields:
//
// db: Name of the db for the query. You can attach extraDbs to ShareDB and
//   pick which one the query should hit using this parameter.

// Create a fetch query. Fetch queries are only issued once, returning the
// results directly into the callback.
//
// The callback should have the signature function(error, results, extra)
// where results is a list of Doc objects.
Connection.prototype.createFetchQuery = function (
  collection,
  q,
  options,
  callback
) {
  return this._createQuery("qf", collection, q, options, callback);
};

// Create a subscribe query. Subscribe queries return with the initial data
// through the callback, then update themselves whenever the query result set
// changes via their own event emitter.
//
// If present, the callback should have the signature function(error, results, extra)
// where results is a list of Doc objects.
Connection.prototype.createSubscribeQuery = function (
  collection,
  q,
  options,
  callback
) {
  return this._createQuery("qs", collection, q, options, callback);
};

Connection.prototype.hasPending = function () {
  return !!(
    this._firstDoc(hasPending) ||
    this._firstQuery(hasPending) ||
    this._firstSnapshotRequest()
  );
};
function hasPending(object) {
  return object.hasPending();
}

Connection.prototype.hasWritePending = function () {
  return !!this._firstDoc(hasWritePending);
};
function hasWritePending(object) {
  return object.hasWritePending();
}

Connection.prototype.whenNothingPending = function (callback) {
  var doc = this._firstDoc(hasPending);
  if (doc) {
    // If a document is found with a pending operation, wait for it to emit
    // that nothing is pending anymore, and then recheck all documents again.
    // We have to recheck all documents, just in case another mutation has
    // been made in the meantime as a result of an event callback
    doc.once("nothing pending", this._nothingPendingRetry(callback));
    return;
  }
  var query = this._firstQuery(hasPending);
  if (query) {
    query.once("ready", this._nothingPendingRetry(callback));
    return;
  }
  var snapshotRequest = this._firstSnapshotRequest();
  if (snapshotRequest) {
    snapshotRequest.once("ready", this._nothingPendingRetry(callback));
    return;
  }
  // Call back when no pending operations
  util.nextTick(callback);
};
Connection.prototype._nothingPendingRetry = function (callback) {
  var connection = this;
  return function () {
    util.nextTick(function () {
      connection.whenNothingPending(callback);
    });
  };
};

Connection.prototype._firstDoc = function (fn) {
  for (var collection in this.collections) {
    var docs = this.collections[collection];
    for (var id in docs) {
      var doc = docs[id];
      if (fn(doc)) {
        return doc;
      }
    }
  }
};

Connection.prototype._firstQuery = function (fn) {
  for (var id in this.queries) {
    var query = this.queries[id];
    if (fn(query)) {
      return query;
    }
  }
};

Connection.prototype._firstSnapshotRequest = function () {
  for (var id in this._snapshotRequests) {
    return this._snapshotRequests[id];
  }
};

/**
 * Fetch a read-only snapshot at a given version
 *
 * @param collection - the collection name of the snapshot
 * @param id - the ID of the snapshot
 * @param version (optional) - the version number to fetch. If null, the latest version is fetched.
 * @param callback - (error, snapshot) => void, where snapshot takes the following schema:
 *
 * {
 *   id: string;         // ID of the snapshot
 *   v: number;          // version number of the snapshot
 *   type: string;       // the OT type of the snapshot, or null if it doesn't exist or is deleted
 *   data: any;          // the snapshot
 * }
 *
 */
Connection.prototype.fetchSnapshot = function (
  collection,
  id,
  version,
  callback
) {
  if (typeof version === "function") {
    callback = version;
    version = null;
  }

  var requestId = this.nextSnapshotRequestId++;
  var snapshotRequest = new SnapshotVersionRequest(
    this,
    requestId,
    collection,
    id,
    version,
    callback
  );
  this._snapshotRequests[snapshotRequest.requestId] = snapshotRequest;
  snapshotRequest.send();
};

/**
 * Fetch a read-only snapshot at a given timestamp
 *
 * @param collection - the collection name of the snapshot
 * @param id - the ID of the snapshot
 * @param timestamp (optional) - the timestamp to fetch. If null, the latest version is fetched.
 * @param callback - (error, snapshot) => void, where snapshot takes the following schema:
 *
 * {
 *   id: string;         // ID of the snapshot
 *   v: number;          // version number of the snapshot
 *   type: string;       // the OT type of the snapshot, or null if it doesn't exist or is deleted
 *   data: any;          // the snapshot
 * }
 *
 */
Connection.prototype.fetchSnapshotByTimestamp = function (
  collection,
  id,
  timestamp,
  callback
) {
  if (typeof timestamp === "function") {
    callback = timestamp;
    timestamp = null;
  }

  var requestId = this.nextSnapshotRequestId++;
  var snapshotRequest = new SnapshotTimestampRequest(
    this,
    requestId,
    collection,
    id,
    timestamp,
    callback
  );
  this._snapshotRequests[snapshotRequest.requestId] = snapshotRequest;
  snapshotRequest.send();
};

Connection.prototype._handleSnapshotFetch = function (error, message) {
  var snapshotRequest = this._snapshotRequests[message.id];
  if (!snapshotRequest) return;
  delete this._snapshotRequests[message.id];
  snapshotRequest._handleResponse(error, message);
};
// 初始化告诉服务器 客户端已经连上   设置已经连上状态
Connection.prototype._handleLegacyInit = function (message) {
  // If the minor protocol version has been set, we want to use the
  // new handshake protocol. Let's send a handshake initialize, because
  // we now know the server is ready. If we've already sent it, we'll
  // just ignore the response anyway.
  //如果已经设置了次要协议版本，我们希望使用
  //新建握手协议。让我们发送一个握手初始化，因为
  //我们现在知道服务器已经准备好了。如果我们已经发送了，我们会的
  //忽略响应。
  if (message.protocolMinor) {
    // 初始化告诉服务器 客户端已经连上
    return this._initializeHandshake();
  }
  // 设置已经连上状态
  this._initialize(message);
};

// 发送{ a: "hs", id: this.id }给服务器
Connection.prototype._initializeHandshake = function () {
  // 发送 消息
  this.send({ a: "hs", id: this.id });
};

// 设置已经连上状态 告诉服务器 客户端socket已经连上
Connection.prototype._handleHandshake = function (error, message) {
  if (error) return this.emit("error", error);
  // 设置已经连上状态
  this._initialize(message);
};

// 设置已经连上状态
Connection.prototype._initialize = function (message) {
  if (this.state !== "connecting") return;

  if (message.protocol !== 1) {
    return this.emit(
      "error",
      new ShareDBError(
        ERROR_CODE.ERR_PROTOCOL_VERSION_NOT_SUPPORTED,
        "Unsupported protocol version: " + message.protocol
      )
    );
  }
  if (types.map[message.type] !== types.defaultType) {
    return this.emit(
      "error",
      new ShareDBError(
        ERROR_CODE.ERR_DEFAULT_TYPE_MISMATCH,
        message.type + " does not match the server default type"
      )
    );
  }
  if (typeof message.id !== "string") {
    return this.emit(
      "error",
      new ShareDBError(
        ERROR_CODE.ERR_CLIENT_ID_BADLY_FORMED,
        "Client id must be a string"
      )
    );
  }
  this.id = message.id;

  this._setState("connected");
};

Connection.prototype.getPresence = function (channel) {
  var connection = this;
  return util.digOrCreate(this._presences, channel, function () {
    return new Presence(connection, channel);
  });
};

Connection.prototype.getDocPresence = function (collection, id) {
  var channel = DocPresence.channel(collection, id);
  var connection = this;
  return util.digOrCreate(this._presences, channel, function () {
    return new DocPresence(connection, collection, id);
  });
};

Connection.prototype._sendPresenceAction = function (action, seq, presence) {
  // Ensure the presence is registered so that it receives the reply message
  this._addPresence(presence);
  var message = { a: action, ch: presence.channel, seq: seq };
  this.send(message);
  return message.seq;
};

Connection.prototype._addPresence = function (presence) {
  util.digOrCreate(this._presences, presence.channel, function () {
    return presence;
  });
};

Connection.prototype._handlePresenceSubscribe = function (error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence) presence._handleSubscribe(error, message.seq);
};

Connection.prototype._handlePresenceUnsubscribe = function (error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence) presence._handleUnsubscribe(error, message.seq);
};

Connection.prototype._handlePresence = function (error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence) presence._receiveUpdate(error, message);
};

Connection.prototype._handlePresenceRequest = function (error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence) presence._broadcastAllLocalPresence(error, message);
};
