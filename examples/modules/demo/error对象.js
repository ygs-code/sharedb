/*
 captureStackTrace应该是Error构造函数自身的一个方法。因此，很自然的想到从ECMAScript标准文档中寻找答案。不幸的是，在标准文档的19.5 Error Objects章节中，并未提及任何有关captureStackTrace的内容。看来，这一语句和语言的运行环境有关，并非由JavaScript标准所定义。
 原文链接：https://blog.csdn.net/enzymer/article/details/52668114
 */

try {
  throw new Error(
    "Connection seq has exceeded the max safe integer, maybe from being open for too long"
  );
} catch (e) {
  // e.stack 中包含了堆栈数据，可以进行处理从而忽略不感兴趣的堆栈信息
  console.log("e=", e);
}

function MyError(code, message) {
  this.code = code;
  this.message = message || "";
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, MyError);
  } else {
    this.stack = new Error().stack;
  }
}

MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;
MyError.prototype.name = "MyError";
let myError = new MyError(
  9999,
  "Connection seq has exceeded the max safe integer, maybe from being open for too long"
);
console.log("myError=", myError);

function ShareDBError(code, message) {
  this.code = code;
  this.message = message || "";
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ShareDBError);
  } else {
    this.stack = new Error().stack;
  }
}

ShareDBError.prototype = Object.create(Error.prototype);
ShareDBError.prototype.constructor = ShareDBError;
ShareDBError.prototype.name = "ShareDBError";

ShareDBError.CODES = {
  ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT:
    "ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT",
  ERR_APPLY_SNAPSHOT_NOT_PROVIDED: "ERR_APPLY_SNAPSHOT_NOT_PROVIDED",
  ERR_CLIENT_ID_BADLY_FORMED: "ERR_CLIENT_ID_BADLY_FORMED",
  ERR_CONNECTION_SEQ_INTEGER_OVERFLOW: "ERR_CONNECTION_SEQ_INTEGER_OVERFLOW",
  ERR_CONNECTION_STATE_TRANSITION_INVALID:
    "ERR_CONNECTION_STATE_TRANSITION_INVALID",
  ERR_DATABASE_ADAPTER_NOT_FOUND: "ERR_DATABASE_ADAPTER_NOT_FOUND",
  ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE:
    "ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE",
  ERR_DATABASE_METHOD_NOT_IMPLEMENTED: "ERR_DATABASE_METHOD_NOT_IMPLEMENTED",
  ERR_DEFAULT_TYPE_MISMATCH: "ERR_DEFAULT_TYPE_MISMATCH",
  ERR_DOC_MISSING_VERSION: "ERR_DOC_MISSING_VERSION",
  ERR_DOC_ALREADY_CREATED: "ERR_DOC_ALREADY_CREATED",
  ERR_DOC_DOES_NOT_EXIST: "ERR_DOC_DOES_NOT_EXIST",
  ERR_DOC_TYPE_NOT_RECOGNIZED: "ERR_DOC_TYPE_NOT_RECOGNIZED",
  ERR_DOC_WAS_DELETED: "ERR_DOC_WAS_DELETED",
  ERR_INFLIGHT_OP_MISSING: "ERR_INFLIGHT_OP_MISSING",
  ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION: "ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION",
  ERR_MAX_SUBMIT_RETRIES_EXCEEDED: "ERR_MAX_SUBMIT_RETRIES_EXCEEDED",
  ERR_MESSAGE_BADLY_FORMED: "ERR_MESSAGE_BADLY_FORMED",
  ERR_MILESTONE_ARGUMENT_INVALID: "ERR_MILESTONE_ARGUMENT_INVALID",
  ERR_OP_ALREADY_SUBMITTED: "ERR_OP_ALREADY_SUBMITTED",
  ERR_OP_NOT_ALLOWED_IN_PROJECTION: "ERR_OP_NOT_ALLOWED_IN_PROJECTION",
  ERR_OP_SUBMIT_REJECTED: "ERR_OP_SUBMIT_REJECTED",
  ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM:
    "ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM",
  ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM:
    "ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM",
  ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT:
    "ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT",
  ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED:
    "ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED",
  ERR_OT_OP_BADLY_FORMED: "ERR_OT_OP_BADLY_FORMED",
  ERR_OT_OP_NOT_APPLIED: "ERR_OT_OP_NOT_APPLIED",
  ERR_OT_OP_NOT_PROVIDED: "ERR_OT_OP_NOT_PROVIDED",
  ERR_PRESENCE_TRANSFORM_FAILED: "ERR_PRESENCE_TRANSFORM_FAILED",
  ERR_PROTOCOL_VERSION_NOT_SUPPORTED: "ERR_PROTOCOL_VERSION_NOT_SUPPORTED",
  ERR_QUERY_EMITTER_LISTENER_NOT_ASSIGNED:
    "ERR_QUERY_EMITTER_LISTENER_NOT_ASSIGNED",
  /**
   * A special error that a "readSnapshots" middleware implementation can use to indicate that it
   * wishes for the ShareDB client to treat it as a silent rejection, not passing the error back to
   * user code.
   *
   * For subscribes, the ShareDB client will still cancel the document subscription.
   */
  ERR_SNAPSHOT_READ_SILENT_REJECTION: "ERR_SNAPSHOT_READ_SILENT_REJECTION",
  /**
   * A "readSnapshots" middleware rejected the reads of specific snapshots.
   *
   * This error code is mostly for server use and generally will not be encountered on the client.
   * Instead, each specific doc that encountered an error will receive its specific error.
   *
   * The one exception is for queries, where a "readSnapshots" rejection of specific snapshots will
   * cause the client to receive this error for the whole query, since queries don't support
   * doc-specific errors.
   */
  ERR_SNAPSHOT_READS_REJECTED: "ERR_SNAPSHOT_READS_REJECTED",
  ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND: "ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND",
  ERR_TYPE_CANNOT_BE_PROJECTED: "ERR_TYPE_CANNOT_BE_PROJECTED",
  ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE: "ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE",
  ERR_UNKNOWN_ERROR: "ERR_UNKNOWN_ERROR",
};

let shareDBError = new ShareDBError(
  "ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT",
  "Connection seq has exceeded the max safe integer, maybe from being open for too long"
);
console.log("shareDBError=", shareDBError);
