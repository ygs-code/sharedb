var async = require('../../../modules/async');
var Agent = require('./agent');
var Connection = require('./client/connection');
var emitter = require('./emitter');
var MemoryDB = require('./db/memory');
var NoOpMilestoneDB = require('./milestone-db/no-op');
var MemoryPubSub = require('./pubsub/memory');
var ot = require('./ot');
var projections = require('./projections');
var QueryEmitter = require('./query-emitter');
var ShareDBError = require('./error');
var Snapshot = require('./snapshot');
var StreamSocket = require('./stream-socket');
var SubmitRequest = require('./submit-request');
var ReadSnapshotsRequest = require('./read-snapshots-request');
var util = require('./util');
var logger = require('./logger');

var ERROR_CODE = ShareDBError.CODES;

function Backend(options) {
    if (!(this instanceof Backend)) {
        return new Backend(options);
    }
    emitter.EventEmitter.call(this);

    if (!options) options = {};
    this.db = options.db || new MemoryDB();
    this.pubsub = options.pubsub || new MemoryPubSub();
    // This contains any extra databases that can be queried
    this.extraDbs = options.extraDbs || {};
    this.milestoneDb = options.milestoneDb || new NoOpMilestoneDB();

    // Map from projected collection -> {type, fields}
    this.projections = {};

    this.suppressPublish = !!options.suppressPublish;
    this.maxSubmitRetries = options.maxSubmitRetries || null;
    this.presenceEnabled = !!options.presence;
    this.doNotForwardSendPresenceErrorsToClient =
        !!options.doNotForwardSendPresenceErrorsToClient;
    if (this.presenceEnabled && !this.doNotForwardSendPresenceErrorsToClient) {
        logger.warn(
            'Broadcasting "sendPresence" middleware errors to clients is deprecated ' +
                'and will be removed in a future release. Disable this behaviour with:\n\n' +
                'new Backend({doNotForwardSendPresenceErrorsToClient: true})\n\n'
        );
    }

    // Map from event name to a list of middleware
    this.middleware = {};

    // The number of open agents for monitoring and testing memory leaks
    this.agentsCount = 0;
    this.remoteAgentsCount = 0;

    this.errorHandler =
        typeof options.errorHandler === 'function'
            ? options.errorHandler
            : // eslint-disable-next-line no-unused-vars
              function (error, context) {
                  logger.error(error);
              };
}
module.exports = Backend;
emitter.mixin(Backend);

//中间件动作
Backend.prototype.MIDDLEWARE_ACTIONS = {
    // An operation was successfully written to the database.
    afterWrite: 'afterWrite',
    // An operation is about to be applied to a snapshot before being committed to the database
    apply: 'apply',
    // An operation was applied to a snapshot; The operation and new snapshot are about to be written to the database.
    commit: 'commit',
    // A new client connected to the server.
    connect: 'connect',
    // An operation was loaded from the database
    op: 'op',
    // A query is about to be sent to the database
    query: 'query',
    // Snapshot(s) were received from the database and are about to be returned to a client
    readSnapshots: 'readSnapshots',
    // Received a message from a client
    receive: 'receive',
    // About to send a non-error reply to a client message.
    // WARNING: This gets passed a direct reference to the reply object, so
    // be cautious with it. While modifications to the reply message are possible
    // by design, changing existing reply properties can cause weird bugs, since
    // the rest of ShareDB would be unaware of those changes.
    reply: 'reply',
    // The server received presence information
    receivePresence: 'receivePresence',
    // About to send presence information to a client
    sendPresence: 'sendPresence',
    // An operation is about to be submitted to the database
    submit: 'submit',
};

Backend.prototype.SNAPSHOT_TYPES = {
    // The current snapshot is being fetched (eg through backend.fetch)
    current: 'current',
    // A specific snapshot is being fetched by version (eg through backend.fetchSnapshot)
    byVersion: 'byVersion',
    // A specific snapshot is being fetch by timestamp (eg through backend.fetchSnapshotByTimestamp)
    byTimestamp: 'byTimestamp',
};

Backend.prototype.close = function (callback) {
    var wait = 4;
    var backend = this;
    function finish(err) {
        if (err) {
            if (callback) return callback(err);
            return backend.emit('error', err);
        }
        if (--wait) return;
        if (callback) callback();
    }
    this.pubsub.close(finish);
    this.db.close(finish);
    this.milestoneDb.close(finish);
    for (var name in this.extraDbs) {
        wait++;
        this.extraDbs[name].close(finish);
    }
    finish();
};

// 获取连接文档
Backend.prototype.connect = function (connection, req, callback) {
    // console.log('connection======', connection);
    // console.log('req======', req);
    // console.log('callback======', callback);

    // 创建 doc  socket
    var socket = new StreamSocket();
    if (connection) {
        // 客户端
        connection.bindToSocket(socket);
    } else {
        // 服务端
        connection = new Connection(socket);
    }
    socket._open();

    // console.log('this.listen2=');
    // console.log('socket===================', socket);
    var agent = this.listen(socket.stream, req);
    // Store a reference to the agent on the connection for convenience. This is
    // not used internal to ShareDB, but it is handy for server-side only user
    // code that may cache state on the agent and read it in middleware
    connection.agent = agent;

    if (typeof callback === 'function') {
        connection.once('connected', function () {
            callback(connection);
        });
    }

    return connection;
};

/** A client has connected through the specified stream. Listen for messages.
 *
 * The optional second argument (req) is an initial request which is passed
 * through to any connect() middleware. This is useful for inspecting cookies
 * or an express session or whatever on the request object in your middleware.
 *
 * (The agent is available through all middleware) 代理可以通过所有中间件使用
 */
Backend.prototype.listen = function (
    stream, // websocket
    req // node req
) {
    //
    // console.log('stream======================');

    var agent = new Agent(this, stream);
    this.trigger(
        this.MIDDLEWARE_ACTIONS.connect,
        agent,
        { stream: stream, req: req },
        function (err) {
            if (err) {
                return agent.close(err);
            }
            // open连接
            agent._open();
        }
    );
    return agent;
};

Backend.prototype.addProjection = function (name, collection, fields) {
    if (this.projections[name]) {
        throw new Error('Projection ' + name + ' already exists');
    }

    for (var key in fields) {
        if (fields[key] !== true) {
            throw new Error(
                'Invalid field ' +
                    key +
                    ' - fields must be {somekey: true}. Subfields not currently supported.'
            );
        }
    }

    this.projections[name] = {
        target: collection,
        fields: fields,
    };
};

/**
 * Add middleware to an action or array of actions
 */
Backend.prototype.use = function (action, fn) {
    if (Array.isArray(action)) {
        for (var i = 0; i < action.length; i++) {
            this.use(action[i], fn);
        }
        return this;
    }
    var fns = this.middleware[action] || (this.middleware[action] = []);
    fns.push(fn);
    return this;
};

/**
 * Passes request through the middleware stack
 *
 * Middleware may modify the request object. After all middleware have been
 * invoked we call `callback` with `null` and the modified request. If one of
 * the middleware resturns an error the callback is called with that error.
 * *通过中间件堆栈传递请求  
＊  
*中间件可以修改请求对象。 毕竟中间件已经有了  
*我们调用' callback '与' null '和修改的请求。 如果一个人的  
*中间件返回一个回调函数被调用时的错误。  
 */
Backend.prototype.trigger = function (
    action, //　动作
    agent,
    request,
    callback
) {
    request.action = action;
    request.agent = agent;
    request.backend = this;

    var fns = this.middleware[action];
    // console.log('fns=======', fns);
    if (!fns) {
        return callback();
    }

    // Copying the triggers we'll fire so they don't get edited while we iterate.
    //复制我们将触发的触发器，这样它们在迭代时不会被编辑。
    fns = fns.slice();
    var next = function (err) {
        if (err) {
            return callback(err);
        }
        var fn = fns.shift();
        if (!fn) {
            return callback();
        }
        fn(request, next);
    };
    next();
};

// Submit an operation on the named collection/docname. op should contain a
// {op:}, {create:} or {del:} field. It should probably contain a v: field (if
// it doesn't, it defaults to the current version).
//提交指定集合的操作/docname。 操作应该包含
// {op:}， {create:}或{del:}字段。 它应该包含一个v:字段(if
//它没有，它默认为当前版本)。
  // 发送给其他客户端
Backend.prototype.submit = function (
    agent,
    index,
    id,
    op,
    options,
    originalCallback
) {
    var backend = this;
    // 提交给其他socket 客户端
    var request = new SubmitRequest(this, agent, index, id, op, options);
    // console.log('Backend.prototype.submit request====',request)
    var callback = function (error, ops) {
        backend.emit('submitRequestEnd', error, request);
        originalCallback(error, ops);
    };
    // 检测op
    var err = ot.checkOp(op);
    if (err) return callback(err);
    backend.trigger(
        backend.MIDDLEWARE_ACTIONS.submit,
        agent,
        request,
        function (err) {
            if (err) return callback(err);
            // 发送op给其他客户
            request.submit(function (err) {
                if (err) return callback(err);
                backend.trigger(
                    backend.MIDDLEWARE_ACTIONS.afterWrite,
                    agent,
                    request,
                    function (err) {
                        if (err) return callback(err);
                        backend._sanitizeOps(
                            agent,
                            request.projection,
                            request.collection,
                            id,
                            request.ops,
                            function (err) {
                                if (err) return callback(err);
                                backend.emit(
                                    'timing',
                                    'submit.total',
                                    Date.now() - request.start,
                                    request
                                );
                                callback(err, request.ops);
                            }
                        );
                    }
                );
            });
        }
    );
};

Backend.prototype.sanitizeOp = function (agent, index, id, op, callback) {
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    this._sanitizeOp(agent, projection, collection, id, op, callback);
};

Backend.prototype._sanitizeOp = function (
    agent,
    projection,
    collection,
    id,
    op,
    callback
) {
    if (projection) {
        try {
            projections.projectOp(projection.fields, op);
        } catch (err) {
            return callback(err);
        }
    }
    this.trigger(
        this.MIDDLEWARE_ACTIONS.op,
        agent,
        { collection: collection, id: id, op: op },
        callback
    );
};
Backend.prototype._sanitizeOps = function (
    agent,
    projection,
    collection,
    id,
    ops,
    callback
) {
    var backend = this;
    async.each(
        ops,
        function (op, eachCb) {
            backend._sanitizeOp(
                agent,
                projection,
                collection,
                id,
                op,
                function (err) {
                    util.nextTick(eachCb, err);
                }
            );
        },
        callback
    );
};
Backend.prototype._sanitizeOpsBulk = function (
    agent,
    projection,
    collection,
    opsMap,
    callback
) {
    var backend = this;
    async.forEachOf(
        opsMap,
        function (ops, id, eachCb) {
            backend._sanitizeOps(
                agent,
                projection,
                collection,
                id,
                ops,
                eachCb
            );
        },
        callback
    );
};
// sanitize快照
Backend.prototype._sanitizeSnapshots = function (
    agent,
    projection,
    collection,
    snapshots,
    snapshotType,
    callback
) {
    if (projection) {
        try {
            projections.projectSnapshots(projection.fields, snapshots);
        } catch (err) {
            return callback(err);
        }
    }

    var request = new ReadSnapshotsRequest(collection, snapshots, snapshotType);

    this.trigger(
        this.MIDDLEWARE_ACTIONS.readSnapshots,
        agent,
        request,
        function (err) {
            if (err) return callback(err);
            // Handle "partial rejection" - "readSnapshots" middleware functions can use
            // `request.rejectSnapshotRead(snapshot, error)` to reject the read of a specific snapshot.
            if (request.hasSnapshotRejection()) {
                err = request.getReadSnapshotsError();
            }
            if (err) {
                callback(err);
            } else {
                callback();
            }
        }
    );
};

Backend.prototype._getSnapshotProjection = function (db, projection) {
    return db.projectsSnapshots ? null : projection;
};

Backend.prototype._getSnapshotsFromMap = function (ids, snapshotMap) {
    var snapshots = new Array(ids.length);
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        snapshots[i] = snapshotMap[id];
    }
    return snapshots;
};

Backend.prototype._getSanitizedOps = function (
    agent,
    projection,
    collection,
    id,
    from,
    to,
    opsOptions,
    callback
) {
    var backend = this;
    if (!opsOptions) opsOptions = {};
    if (agent) opsOptions.agentCustom = agent.custom;
    backend.db.getOps(
        collection,
        id,
        from,
        to,
        opsOptions,
        function (err, ops) {
            if (err) return callback(err);
            backend._sanitizeOps(
                agent,
                projection,
                collection,
                id,
                ops,
                function (err) {
                    if (err) return callback(err);
                    callback(null, ops);
                }
            );
        }
    );
};

Backend.prototype._getSanitizedOpsBulk = function (
    agent,
    projection,
    collection,
    fromMap,
    toMap,
    opsOptions,
    callback
) {
    var backend = this;
    if (!opsOptions) opsOptions = {};
    if (agent) opsOptions.agentCustom = agent.custom;
    backend.db.getOpsBulk(
        collection,
        fromMap,
        toMap,
        opsOptions,
        function (err, opsMap) {
            if (err) return callback(err);
            backend._sanitizeOpsBulk(
                agent,
                projection,
                collection,
                opsMap,
                function (err) {
                    if (err) return callback(err);
                    callback(null, opsMap);
                }
            );
        }
    );
};

// Non inclusive - gets ops from [from, to). Ie, all relevant ops. If to is
// not defined (null or undefined) then it returns all ops.
Backend.prototype.getOps = function (
    agent,
    index,
    id,
    from,
    to,
    options,
    callback
) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    var start = Date.now();
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var backend = this;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        id: id,
        from: from,
        to: to,
    };
    var opsOptions = options && options.opsOptions;
    backend._getSanitizedOps(
        agent,
        projection,
        collection,
        id,
        from,
        to,
        opsOptions,
        function (err, ops) {
            if (err) return callback(err);
            backend.emit('timing', 'getOps', Date.now() - start, request);
            callback(null, ops);
        }
    );
};

Backend.prototype.getOpsBulk = function (
    agent,
    index,
    fromMap,
    toMap,
    options,
    callback
) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    var start = Date.now();
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var backend = this;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        fromMap: fromMap,
        toMap: toMap,
    };
    var opsOptions = options && options.opsOptions;
    backend._getSanitizedOpsBulk(
        agent,
        projection,
        collection,
        fromMap,
        toMap,
        opsOptions,
        function (err, opsMap) {
            if (err) return callback(err);
            backend.emit('timing', 'getOpsBulk', Date.now() - start, request);
            callback(null, opsMap);
        }
    );
};
// 获取文档
Backend.prototype.fetch = function (agent, index, id, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    var start = Date.now();
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var fields = projection && projection.fields;
    var backend = this;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        id: id,
    };
    var snapshotOptions = (options && options.snapshotOptions) || {};
    snapshotOptions.agentCustom = agent.custom;
    // 获取文档快照对象
    backend.db.getSnapshot(
        collection,
        id,
        fields,
        snapshotOptions,
        function (err, snapshot) {
            if (err) return callback(err);
            var snapshotProjection = backend._getSnapshotProjection(
                backend.db,
                projection
            );
            var snapshots = [snapshot];
            backend._sanitizeSnapshots(
                agent,
                snapshotProjection,
                collection,
                snapshots,
                backend.SNAPSHOT_TYPES.current,
                function (err) {
                    if (err) {
                        return callback(err);
                    }
                    backend.emit(
                        'timing',
                        'fetch',
                        Date.now() - start,
                        request
                    );
                    callback(null, snapshot);
                }
            );
        }
    );
};

/**
 * Map of document id to Snapshot or error object.
 * @typedef {{ [id: string]: Snapshot | { error: Error | string } }} SnapshotMap
 */

/**
 * @param {Agent} agent
 * @param {string} index
 * @param {string[]} ids
 * @param {*} options
 * @param {(err?: Error | string, snapshotMap?: SnapshotMap) => void} callback
 */
Backend.prototype.fetchBulk = function (agent, index, ids, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    var start = Date.now();
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var fields = projection && projection.fields;
    var backend = this;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        ids: ids,
    };
    var snapshotOptions = (options && options.snapshotOptions) || {};
    snapshotOptions.agentCustom = agent.custom;
    backend.db.getSnapshotBulk(
        collection,
        ids,
        fields,
        snapshotOptions,
        function (err, snapshotMap) {
            if (err) return callback(err);
            var snapshotProjection = backend._getSnapshotProjection(
                backend.db,
                projection
            );
            var snapshots = backend._getSnapshotsFromMap(ids, snapshotMap);
            backend._sanitizeSnapshots(
                agent,
                snapshotProjection,
                collection,
                snapshots,
                backend.SNAPSHOT_TYPES.current,
                function (err) {
                    if (err) {
                        if (
                            err.code === ERROR_CODE.ERR_SNAPSHOT_READS_REJECTED
                        ) {
                            for (var docId in err.idToError) {
                                snapshotMap[docId] = {
                                    error: err.idToError[docId],
                                };
                            }
                            err = undefined;
                        } else {
                            snapshotMap = undefined;
                        }
                    }
                    backend.emit(
                        'timing',
                        'fetchBulk',
                        Date.now() - start,
                        request
                    );
                    callback(err, snapshotMap);
                }
            );
        }
    );
};

// Subscribe to the document from the specified version or null version
//订阅指定版本或空版本的文档
Backend.prototype.subscribe = function (
    agent,
    index,
    id,
    version,
    options,
    callback
) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    if (options) {
        // We haven't yet implemented the ability to pass options to subscribe. This is because we need to
        // add the ability to SubmitRequest.commit to optionally pass the metadata to other clients on
        // PubSub. This behaviour is not needed right now, but we have added an options object to the
        // subscribe() signature so that it remains consistent with getOps() and fetch().
        return callback(
            new ShareDBError(
                ERROR_CODE.ERR_DATABASE_METHOD_NOT_IMPLEMENTED,
                'Passing options to subscribe has not been implemented'
            )
        );
    }
    // 时间戳
    var start = Date.now();
    var projection = this.projections[index];
    // console.log('this.projections', projection);

    var collection = projection ? projection.target : index;
    // 获取文档集合key
    // console.log('index=======', index);
    // console.log('collection=======', collection);
    // console.log('id=======', id);
    var channel = this.getDocChannel(collection, id);
    // console.log('channel=======', channel);

    var backend = this;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        id: id,
        version: version,
    };
    // console.log(
    //     ' backend.pubsub.subscribe=',
    //     backend.pubsub.subscribe.toString()
    // );
    //   pubsub._createStream 创建stream
    backend.pubsub.subscribe(channel, function (err, stream) {
        if (err) return callback(err);
        // console.log('version========',version)
        if (version == null) {
            // Subscribing from null means that the agent doesn't have a document
            // and needs to fetch it as well as subscribing
            //从null订阅意味着代理没有文档
            //和需要获取它以及订阅
            // 获取文档 快照
            backend.fetch(agent, index, id, function (err, snapshot) {
                if (err) {
                    stream.destroy();
                    return callback(err);
                }
                
                backend.emit(
                    'timing',
                    'subscribe.snapshot',
                    Date.now() - start,
                    request
                );
                callback(
                    null,
                    stream, // stream
                    snapshot // 文档快照 文档内容
                );
            });
        } else {
            backend._getSanitizedOps(
                agent,
                projection,
                collection,
                id,
                version,
                null,
                null,
                function (err, ops) {
                    if (err) {
                        stream.destroy();
                        return callback(err);
                    }
                    backend.emit(
                        'timing',
                        'subscribe.ops',
                        Date.now() - start,
                        request
                    );

                    callback(null, stream, null, ops);
                }
            );
        }
    });
};

/**
 * Map of document id to pubsub stream.
 * @typedef {{ [id: string]: Stream }} StreamMap
 */
/**
 * Map of document id to array of ops for the doc.
 * @typedef {{ [id: string]: Op[] }} OpsMap
 */

/**
 * @param {Agent} agent
 * @param {string} index
 * @param {string[]} versions
 * @param {(
 *   err?: Error | string | null,
 *   streams?: StreamMap,
 *   snapshotMap?: SnapshotMap | null
 *   opsMap?: OpsMap
 * ) => void} callback
 */
Backend.prototype.subscribeBulk = function (agent, index, versions, callback) {
    var start = Date.now();
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var backend = this;
    var streams = {};
    var doFetch = Array.isArray(versions);
    var ids = doFetch ? versions : Object.keys(versions);
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        versions: versions,
    };
    async.each(
        ids,
        function (id, eachCb) {
            var channel = backend.getDocChannel(collection, id);
            backend.pubsub.subscribe(channel, function (err, stream) {
                if (err) return eachCb(err);
                streams[id] = stream;
                eachCb();
            });
        },
        function (err) {
            if (err) {
                destroyStreams(streams);
                return callback(err);
            }
            if (doFetch) {
                // If an array of ids, get current snapshots
                backend.fetchBulk(
                    agent,
                    index,
                    ids,
                    function (err, snapshotMap) {
                        if (err) {
                            // Full error, destroy all streams.
                            destroyStreams(streams);
                            streams = undefined;
                            snapshotMap = undefined;
                        }
                        for (var docId in snapshotMap) {
                            // The doc id could map to an object `{error: Error | string}`, which indicates that
                            // particular snapshot's read was rejected. Destroy the streams fur such docs.
                            if (snapshotMap[docId].error) {
                                streams[docId].destroy();
                                delete streams[docId];
                            }
                        }
                        backend.emit(
                            'timing',
                            'subscribeBulk.snapshot',
                            Date.now() - start,
                            request
                        );
                        callback(err, streams, snapshotMap);
                    }
                );
            } else {
                // If a versions map, get ops since requested versions
                backend._getSanitizedOpsBulk(
                    agent,
                    projection,
                    collection,
                    versions,
                    null,
                    null,
                    function (err, opsMap) {
                        if (err) {
                            destroyStreams(streams);
                            return callback(err);
                        }
                        backend.emit(
                            'timing',
                            'subscribeBulk.ops',
                            Date.now() - start,
                            request
                        );
                        callback(null, streams, null, opsMap);
                    }
                );
            }
        }
    );
};
function destroyStreams(streams) {
    for (var id in streams) {
        streams[id].destroy();
    }
}

Backend.prototype.queryFetch = function (
    agent,
    index,
    query,
    options,
    callback
) {
    var start = Date.now();
    var backend = this;
    backend._triggerQuery(
        agent,
        index,
        query,
        options,
        function (err, request) {
            if (err) return callback(err);
            backend._query(agent, request, function (err, snapshots, extra) {
                if (err) return callback(err);
                backend.emit(
                    'timing',
                    'queryFetch',
                    Date.now() - start,
                    request
                );
                callback(null, snapshots, extra);
            });
        }
    );
};

// Options can contain:
// db: The name of the DB (if the DB is specified in the otherDbs when the backend instance is created)
// skipPoll: function(collection, id, op, query) {return true or false; }
//  this is a synchronous function which can be used as an early filter for
//  operations going through the system to reduce the load on the DB.
// pollDebounce: Minimum delay between subsequent database polls. This is
//  used to batch updates to reduce load on the database at the expense of
//  liveness
Backend.prototype.querySubscribe = function (
    agent,
    index,
    query,
    options,
    callback
) {
    var start = Date.now();
    var backend = this;
    backend._triggerQuery(
        agent,
        index,
        query,
        options,
        function (err, request) {
            if (err) return callback(err);
            if (request.db.disableSubscribe) {
                return callback(
                    new ShareDBError(
                        ERROR_CODE.ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE,
                        'DB does not support subscribe'
                    )
                );
            }
            backend.pubsub.subscribe(request.channel, function (err, stream) {
                if (err) return callback(err);
                if (options.ids) {
                    var queryEmitter = new QueryEmitter(
                        request,
                        stream,
                        options.ids
                    );
                    backend.emit(
                        'timing',
                        'querySubscribe.reconnect',
                        Date.now() - start,
                        request
                    );
                    callback(null, queryEmitter);
                    return;
                }
                // Issue query on db to get our initial results
                backend._query(
                    agent,
                    request,
                    function (err, snapshots, extra) {
                        if (err) {
                            stream.destroy();
                            return callback(err);
                        }
                        var ids = pluckIds(snapshots);
                        var queryEmitter = new QueryEmitter(
                            request,
                            stream,
                            ids,
                            extra
                        );
                        backend.emit(
                            'timing',
                            'querySubscribe.initial',
                            Date.now() - start,
                            request
                        );
                        callback(null, queryEmitter, snapshots, extra);
                    }
                );
            });
        }
    );
};

Backend.prototype._triggerQuery = function (
    agent,
    index,
    query,
    options,
    callback
) {
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var fields = projection && projection.fields;
    var request = {
        index: index,
        collection: collection,
        projection: projection,
        fields: fields,
        channel: this.getCollectionChannel(collection),
        query: query,
        options: options,
        db: null,
        snapshotProjection: null,
    };
    var backend = this;
    backend.trigger(
        backend.MIDDLEWARE_ACTIONS.query,
        agent,
        request,
        function (err) {
            if (err) return callback(err);
            // Set the DB reference for the request after the middleware trigger so
            // that the db option can be changed in middleware
            request.db = options.db ? backend.extraDbs[options.db] : backend.db;
            if (!request.db)
                return callback(
                    new ShareDBError(
                        ERROR_CODE.ERR_DATABASE_ADAPTER_NOT_FOUND,
                        'DB not found'
                    )
                );
            request.snapshotProjection = backend._getSnapshotProjection(
                request.db,
                projection
            );
            callback(null, request);
        }
    );
};

Backend.prototype._query = function (agent, request, callback) {
    var backend = this;
    request.db.query(
        request.collection,
        request.query,
        request.fields,
        request.options,
        function (err, snapshots, extra) {
            if (err) return callback(err);
            backend._sanitizeSnapshots(
                agent,
                request.snapshotProjection,
                request.collection,
                snapshots,
                backend.SNAPSHOT_TYPES.current,
                function (err) {
                    callback(err, snapshots, extra);
                }
            );
        }
    );
};

Backend.prototype.getCollectionChannel = function (collection) {
    return collection;
};

Backend.prototype.getDocChannel = function (collection, id) {
    return collection + '.' + id;
};

//获取 文档key
Backend.prototype.getChannels = function (collection, id) {
    return [
        this.getCollectionChannel(collection),
        this.getDocChannel(collection, id),
    ];
};

Backend.prototype.fetchSnapshot = function (
    agent,
    index,
    id,
    version,
    callback
) {
     
    var start = Date.now();
    var backend = this;
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        id: id,
        version: version,
    };

    this._fetchSnapshot(collection, id, version, function (error, snapshot) {
        if (error) return callback(error);
        var snapshotProjection = backend._getSnapshotProjection(
            backend.db,
            projection
        );
        var snapshots = [snapshot];
        var snapshotType = backend.SNAPSHOT_TYPES.byVersion;
        backend._sanitizeSnapshots(
            agent,
            snapshotProjection,
            collection,
            snapshots,
            snapshotType,
            function (error) {
                if (error) return callback(error);
                backend.emit(
                    'timing',
                    'fetchSnapshot',
                    Date.now() - start,
                    request
                );
                callback(null, snapshot);
            }
        );
    });
};

Backend.prototype._fetchSnapshot = function (
    collection,
    id,
    version,
    callback
) {
    var db = this.db;
    var backend = this;

    var shouldGetLatestSnapshot = version === null;
    if (shouldGetLatestSnapshot) {
        return backend.db.getSnapshot(
            collection,
            id,
            null,
            null,
            function (error, snapshot) {
                if (error) return callback(error);

                callback(null, snapshot);
            }
        );
    }

    this.milestoneDb.getMilestoneSnapshot(
        collection,
        id,
        version,
        function (error, milestoneSnapshot) {
            if (error) return callback(error);

            // Bypass backend.getOps so that we don't call _sanitizeOps. We want to avoid this, because:
            // - we want to avoid the 'op' middleware, because we later use the 'readSnapshots' middleware in _sanitizeSnapshots
            // - we handle the projection in _sanitizeSnapshots
            var from = milestoneSnapshot ? milestoneSnapshot.v : 0;
            db.getOps(
                collection,
                id,
                from,
                version,
                null,
                function (error, ops) {
                    if (error) return callback(error);

                    backend._buildSnapshotFromOps(
                        id,
                        milestoneSnapshot,
                        ops,
                        function (error, snapshot) {
                            if (error) return callback(error);

                            if (version > snapshot.v) {
                                return callback(
                                    new ShareDBError(
                                        ERROR_CODE.ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT,
                                        'Requested version exceeds latest snapshot version'
                                    )
                                );
                            }

                            callback(null, snapshot);
                        }
                    );
                }
            );
        }
    );
};

Backend.prototype.fetchSnapshotByTimestamp = function (
    agent,
    index,
    id,
    timestamp,
    callback
) {
    var start = Date.now();
    var backend = this;
    var projection = this.projections[index];
    var collection = projection ? projection.target : index;
    var request = {
        agent: agent,
        index: index,
        collection: collection,
        id: id,
        timestamp: timestamp,
    };

    this._fetchSnapshotByTimestamp(
        collection,
        id,
        timestamp,
        function (error, snapshot) {
            if (error) return callback(error);
            var snapshotProjection = backend._getSnapshotProjection(
                backend.db,
                projection
            );
            var snapshots = [snapshot];
            var snapshotType = backend.SNAPSHOT_TYPES.byTimestamp;
            backend._sanitizeSnapshots(
                agent,
                snapshotProjection,
                collection,
                snapshots,
                snapshotType,
                function (error) {
                    if (error) return callback(error);
                    backend.emit(
                        'timing',
                        'fetchSnapshot',
                        Date.now() - start,
                        request
                    );
                    callback(null, snapshot);
                }
            );
        }
    );
};

Backend.prototype._fetchSnapshotByTimestamp = function (
    collection,
    id,
    timestamp,
    callback
) {
    var db = this.db;
    var milestoneDb = this.milestoneDb;
    var backend = this;

    var milestoneSnapshot;
    var from = 0;
    var to = null;

    var shouldGetLatestSnapshot = timestamp === null;
    if (shouldGetLatestSnapshot) {
        return backend.db.getSnapshot(
            collection,
            id,
            null,
            null,
            function (error, snapshot) {
                if (error) return callback(error);

                callback(null, snapshot);
            }
        );
    }

    milestoneDb.getMilestoneSnapshotAtOrBeforeTime(
        collection,
        id,
        timestamp,
        function (error, snapshot) {
            if (error) return callback(error);
            milestoneSnapshot = snapshot;
            if (snapshot) from = snapshot.v;

            milestoneDb.getMilestoneSnapshotAtOrAfterTime(
                collection,
                id,
                timestamp,
                function (error, snapshot) {
                    if (error) return callback(error);
                    if (snapshot) to = snapshot.v;

                    var options = { metadata: true };
                    db.getOps(
                        collection,
                        id,
                        from,
                        to,
                        options,
                        function (error, ops) {
                            if (error) return callback(error);
                            filterOpsInPlaceBeforeTimestamp(ops, timestamp);
                            backend._buildSnapshotFromOps(
                                id,
                                milestoneSnapshot,
                                ops,
                                callback
                            );
                        }
                    );
                }
            );
        }
    );
};

Backend.prototype._buildSnapshotFromOps = function (
    id,
    startingSnapshot,
    ops,
    callback
) {
     
    var snapshot =
        startingSnapshot || new Snapshot(id, 0, null, undefined, null);
    var error = ot.applyOps(snapshot, ops, { _normalizeLegacyJson0Ops: true });
    callback(error, snapshot);
};

Backend.prototype.transformPresenceToLatestVersion = function (
    agent,
    presence,
    callback
) {
    if (!presence.c || !presence.d) return callback(null, presence);
    this.getOps(
        agent,
        presence.c,
        presence.d,
        presence.v,
        null,
        function (error, ops) {
            if (error) return callback(error);
            for (var i = 0; i < ops.length; i++) {
                var op = ops[i];
                var isOwnOp = op.src === presence.src;
                var transformError = ot.transformPresence(
                    presence,
                    op,
                    isOwnOp
                );
                if (transformError) {
                    return callback(transformError);
                }
            }
            callback(null, presence);
        }
    );
};

function pluckIds(snapshots) {
    var ids = [];
    for (var i = 0; i < snapshots.length; i++) {
        ids.push(snapshots[i].id);
    }
    return ids;
}

function filterOpsInPlaceBeforeTimestamp(ops, timestamp) {
    for (var i = 0; i < ops.length; i++) {
        var op = ops[i];
        var opTimestamp = op.m && op.m.ts;
        if (opTimestamp > timestamp) {
            ops.length = i;
            return;
        }
    }
}
