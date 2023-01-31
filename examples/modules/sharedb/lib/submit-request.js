var ot = require('./ot');
var projections = require('./projections');
var ShareDBError = require('./error');

var ERROR_CODE = ShareDBError.CODES;

function SubmitRequest(backend, agent, index, id, op, options) {
    this.backend = backend;
    this.agent = agent;
    // If a projection, rewrite the call into a call against the collection
    var projection = backend.projections[index];
    this.index = index;
    this.projection = projection;
    this.collection = projection ? projection.target : index;
    this.id = id;
    this.op = op;
    this.options = options;

    this.extra = op.x;
    delete op.x;

    this.start = Date.now();
    this._addOpMeta();

    // Set as this request is sent through middleware
    this.action = null;
    // For custom use in middleware
    this.custom = {};

    // Whether or not to store a milestone snapshot. If left as null, the milestone
    // snapshots are saved according to the interval provided to the milestone db
    // options. If overridden to a boolean value, then that value is used instead of
    // the interval logic.
    this.saveMilestoneSnapshot = null;
    this.suppressPublish = backend.suppressPublish;
    this.maxRetries = backend.maxSubmitRetries;
    this.retries = 0;

    // return values
    this.snapshot = null;
    this.ops = [];
    this.channels = null;
}
module.exports = SubmitRequest;

// 发送op给其他客户
SubmitRequest.prototype.submit = function (callback) {
    var request = this;
    var backend = this.backend;
    var collection = this.collection;
    var id = this.id;
    var op = this.op;
    // Send a special projection so that getSnapshot knows to return all fields.
    // With a null projection, it strips document metadata
    //发送一个特殊的投影，以便getSnapshot知道返回所有字段。
    //对于null投影，它剥离文档元数据
    var fields = { $submit: true };

    var snapshotOptions = {};
    snapshotOptions.agentCustom = request.agent.custom;
    // 从数据取出文档
    backend.db.getSnapshot(
        collection,
        id,
        fields,
        snapshotOptions,
        function (err, snapshot) {
            if (err) return callback(err);

            request.snapshot = snapshot;
            //
            request._addSnapshotMeta();

            if (op.v == null) {
                if (op.create && snapshot.type && op.src) {
                    // If the document was already created by another op, we will return a
                    // 'Document already exists' error in response and fail to submit this
                    // op. However, this could also happen in the case that the op was
                    // already committed and the create op was simply resent. In that
                    // case, we should return a non-fatal 'Op already submitted' error. We
                    // must get the past ops and check their src and seq values to
                    // differentiate.
                    //如果文档已经被另一个操作创建，我们将返回a
                    //“文档已经存在”的响应错误，并未能提交此
                    // 然而，这种情况也可能发生在op是
                    //已经提交，并且创建的op只是重新发送。 在那
                    // case，我们应该返回一个非致命的'Op already submitted'错误。 我们
                    //必须获取过去的操作并检查它们的SRC和seq值
                    //区分。
                    backend.db.getCommittedOpVersion(
                        collection,
                        id,
                        snapshot,
                        op,
                        null,
                        function (err, version) {
                            if (err) return callback(err);
                            if (version == null) {
                                callback(request.alreadyCreatedError());
                            } else {
                                op.v = version;
                                callback(request.alreadySubmittedError());
                            }
                        }
                    );
                    return;
                }

                // Submitting an op with a null version means that it should get the
                // version from the latest snapshot. Generally this will mean the op
                // won't be transformed, though transform could be called on it in the
                // case of a retry from a simultaneous submit
                op.v = snapshot.v;
            }

            if (op.v === snapshot.v) {
                // The snapshot hasn't changed since the op's base version. Apply
                // without transforming the op
           
                // console.log('backend.db.getSnapshot')
                // console.log('request.apply=',request.apply)
                // console.log('request.apply.name=',request.apply.name)
                // console.log('request.apply.name=',request.apply.toString())
               
                return request.apply(callback);
            }

            if (op.v > snapshot.v) {
                // The op version should be from a previous snapshot, so it should never
                // never exceed the current snapshot's version
                return callback(request.newerVersionError());
            }

            // Transform the op up to the current snapshot version, then apply
            var from = op.v;
            backend.db.getOpsToSnapshot(
                collection,
                id,
                from,
                snapshot,
                null,
                function (err, ops) {
                    if (err) return callback(err);

                    if (ops.length !== snapshot.v - from) {
                        return callback(request.missingOpsError());
                    }

                    err = request._transformOp(ops);
                    if (err) return callback(err);

                    if (op.v !== snapshot.v) {
                        // This shouldn't happen, but is just a final sanity check to make
                        // sure we have transformed the op to the current snapshot version
                        return callback(request.versionAfterTransformError());
                    }
            
                    request.apply(callback);
                }
            );
        }
    );
};

//合并op
SubmitRequest.prototype.apply = function (callback) {
    // If we're being projected, verify that the op is allowed
    var projection = this.projection;
    if (
        projection &&
        !projections.isOpAllowed(this.snapshot.type, projection.fields, this.op)
    ) {
        return callback(this.projectionError());
    }

    // Always set the channels before each attempt to apply. If the channels are
    // modified in a middleware and we retry, we want to reset to a new array
    //每次尝试应用之前总是设置通道。 如果通道是
    //在中间件中修改，我们重试，我们想重置到一个新的数组
    // 获取文档key
    this.channels = this.backend.getChannels(this.collection, this.id);

    var request = this;
    this.backend.trigger(
        this.backend.MIDDLEWARE_ACTIONS.apply,
        this.agent,
        this,
        function (err) {
            if (err) return callback(err);

            // Apply the submitted op to the snapshot //将提交的op应用到快照
            // 合并op
            // console.log(' this.backend.trigger==')
         
            err = ot.apply(request.snapshot, request.op);
            if (err) return callback(err);

            request.commit(callback);
        }
    );
};

//发布数据给 stream.on('data',()=>{}) 订阅数据监听 发送数据给其他客户端
SubmitRequest.prototype.commit = function (callback) {
    var request = this;
    var backend = this.backend;
    backend.trigger(
        backend.MIDDLEWARE_ACTIONS.commit,
        this.agent,
        this,
        function (err) {
            if (err) return callback(err);

            // Try committing the operation and snapshot to the database atomically
            //尝试以原子方式提交操作和快照  
            backend.db.commit(
                request.collection,
                request.id,
                request.op,
                request.snapshot,
                request.options,
                function (err, succeeded) {
                    if (err) return callback(err);
                    if (!succeeded) {
                        // Between our fetch and our call to commit, another client committed an
                        // operation. We expect this to be relatively infrequent but normal.
                        return request.retry(callback);
                    }
                    if (!request.suppressPublish) {
                        var op = request.op;
                        op.c = request.collection;
                        op.d = request.id;
                        op.m = undefined;
                        // Needed for agent to detect if it can ignore sending the op back to
                        // the client that submitted it in subscriptions
                        if (request.collection !== request.index)
                            op.i = request.index;
                        //发布数据给 stream.on('data',()=>{}) 订阅数据监听
                        // console.log('backend.pubsub.publish=', op);
                        backend.pubsub.publish(request.channels, op);
                    }
                    if (
                        request._shouldSaveMilestoneSnapshot(request.snapshot)
                    ) {
                        request.backend.milestoneDb.saveMilestoneSnapshot(
                            request.collection,
                            request.snapshot
                        );
                    }
                    callback();
                }
            );
        }
    );
};

SubmitRequest.prototype.retry = function (callback) {
    this.retries++;
    if (this.maxRetries != null && this.retries > this.maxRetries) {
        return callback(this.maxRetriesError());
    }
    this.backend.emit('timing', 'submit.retry', Date.now() - this.start, this);
    this.submit(callback);
};

SubmitRequest.prototype._transformOp = function (ops) {
    var type = this.snapshot.type;
    for (var i = 0; i < ops.length; i++) {
        var op = ops[i];

        if (this.op.src && this.op.src === op.src && this.op.seq === op.seq) {
            // The op has already been submitted. There are a variety of ways this
            // can happen in normal operation, such as a client resending an
            // unacknowledged operation at reconnect. It's important we don't apply
            // the same op twice
            return this.alreadySubmittedError();
        }

        if (this.op.v !== op.v) {
            return this.versionDuringTransformError();
        }

        var err = ot.transform(type, this.op, op);
        if (err) return err;
        this.ops.push(op);
    }
};

SubmitRequest.prototype._addOpMeta = function () {
    this.op.m = {
        ts: this.start,
    };
    if (this.op.create) {
        // Consistently store the full URI of the type, not just its short name 始终存储该类型的完整URI，而不仅仅是它的短名称
        this.op.create.type = ot.normalizeType(this.op.create.type);
    }
};
// 添加快照元
SubmitRequest.prototype._addSnapshotMeta = function () {
    var meta = this.snapshot.m || (this.snapshot.m = {});
    if (this.op.create) {
        meta.ctime = this.start;
    } else if (this.op.del) {
        this.op.m.data = this.snapshot.data;
    }
    meta.mtime = this.start;
};

SubmitRequest.prototype._shouldSaveMilestoneSnapshot = function (snapshot) {
    // If the flag is null, it's not been overridden by the consumer, so apply the interval
    if (this.saveMilestoneSnapshot === null) {
        return snapshot && snapshot.v % this.backend.milestoneDb.interval === 0;
    }

    return this.saveMilestoneSnapshot;
};

// Non-fatal client errors:
SubmitRequest.prototype.alreadySubmittedError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_OP_ALREADY_SUBMITTED,
        'Op already submitted'
    );
};
SubmitRequest.prototype.rejectedError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_OP_SUBMIT_REJECTED,
        'Op submit rejected'
    );
};
// Fatal client errors:
SubmitRequest.prototype.alreadyCreatedError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_DOC_ALREADY_CREATED,
        'Invalid op submitted. Document already created'
    );
};
SubmitRequest.prototype.newerVersionError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT,
        'Invalid op submitted. Op version newer than current snapshot'
    );
};
SubmitRequest.prototype.projectionError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_OP_NOT_ALLOWED_IN_PROJECTION,
        'Invalid op submitted. Operation invalid in projected collection'
    );
};
// Fatal internal errors:
SubmitRequest.prototype.missingOpsError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND,
        'Op submit failed. DB missing ops needed to transform it up to the current snapshot version'
    );
};
SubmitRequest.prototype.versionDuringTransformError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM,
        'Op submit failed. Versions mismatched during op transform'
    );
};
SubmitRequest.prototype.versionAfterTransformError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM,
        'Op submit failed. Op version mismatches snapshot after op transform'
    );
};
SubmitRequest.prototype.maxRetriesError = function () {
    return new ShareDBError(
        ERROR_CODE.ERR_MAX_SUBMIT_RETRIES_EXCEEDED,
        'Op submit failed. Exceeded max submit retries of ' + this.maxRetries
    );
};
