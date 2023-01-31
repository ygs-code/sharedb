/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../modules/events/events.js":
/*!***********************************!*\
  !*** ../modules/events/events.js ***!
  \***********************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });

    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }

      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

/***/ }),

/***/ "../modules/fast-deep-equal/index.js":
/*!*******************************************!*\
  !*** ../modules/fast-deep-equal/index.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
 // do not edit .js files directly - edit src/index.jst
// 深度比较两个对象是否相同

module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;
    var length, i, keys;

    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;

      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  } // true if both NaN, false otherwise


  return a !== a && b !== b;
};

/***/ }),

/***/ "../modules/hat/index.js":
/*!*******************************!*\
  !*** ../modules/hat/index.js ***!
  \*******************************/
/***/ ((module) => {

var hat = module.exports = function (bits, base) {
  if (!base) base = 16;
  if (bits === undefined) bits = 128;
  if (bits <= 0) return '0';
  var digits = Math.log(Math.pow(2, bits)) / Math.log(base);

  for (var i = 2; digits === Infinity; i *= 2) {
    digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
  }

  var rem = digits - Math.floor(digits);
  var res = '';

  for (var i = 0; i < Math.floor(digits); i++) {
    var x = Math.floor(Math.random() * base).toString(base);
    res = x + res;
  }

  if (rem) {
    var b = Math.pow(base, rem);
    var x = Math.floor(Math.random() * b).toString(base);
    res = x + res;
  }

  var parsed = parseInt(res, base);

  if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
    return hat(bits, base);
  } else return res;
};

hat.rack = function (bits, base, expandBy) {
  var fn = function (data) {
    var iters = 0;

    do {
      if (iters++ > 10) {
        if (expandBy) bits += expandBy;else throw new Error('too many ID collisions, use more bits');
      }

      var id = hat(bits, base);
    } while (Object.hasOwnProperty.call(hats, id));

    hats[id] = data;
    return id;
  };

  var hats = fn.hats = {};

  fn.get = function (id) {
    return fn.hats[id];
  };

  fn.set = function (id, value) {
    fn.hats[id] = value;
    return fn;
  };

  fn.bits = bits || 128;
  fn.base = base || 16;
  return fn;
};

/***/ }),

/***/ "../modules/ot-json0/lib/bootstrapTransform.js":
/*!*****************************************************!*\
  !*** ../modules/ot-json0/lib/bootstrapTransform.js ***!
  \*****************************************************/
/***/ ((module) => {

/*
 * @Date: 2022-03-31 16:07:41
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-07 17:01:15
 * @FilePath: /sharedb/examples/modules/ot-json0/lib/bootstrapTransform.js
 * @Description: 
 */
// These methods let you build a transform function from a transformComponent
// function for OT types like JSON0 in which operations are lists of components
// and transforming them requires N^2 work. I find it kind of nasty that I need
// this, but I'm not really sure what a better solution is. Maybe I should do
// this automatically to types that don't have a compose function defined.
// Add transform and transformX functions for an OT type which has
// transformComponent defined.  transformComponent(destination array,
// component, other component, side)
function bootstrapTransform(type, transformComponent, checkValidOp, append) {
  var transformComponentX = function (left, right, destLeft, destRight) {
    transformComponent(destLeft, left, right, 'left');
    transformComponent(destRight, right, left, 'right');
  };

  var transformX = type.transformX = function (leftOp, rightOp) {
    checkValidOp(leftOp);
    checkValidOp(rightOp);
    var newRightOp = [];

    for (var i = 0; i < rightOp.length; i++) {
      var rightComponent = rightOp[i]; // Generate newLeftOp by composing leftOp by rightComponent

      var newLeftOp = [];
      var k = 0;

      while (k < leftOp.length) {
        var nextC = [];
        transformComponentX(leftOp[k], rightComponent, newLeftOp, nextC);
        k++;

        if (nextC.length === 1) {
          rightComponent = nextC[0];
        } else if (nextC.length === 0) {
          for (var j = k; j < leftOp.length; j++) {
            append(newLeftOp, leftOp[j]);
          }

          rightComponent = null;
          break;
        } else {
          // Recurse.
          var pair = transformX(leftOp.slice(k), nextC);

          for (var l = 0; l < pair[0].length; l++) {
            append(newLeftOp, pair[0][l]);
          }

          for (var r = 0; r < pair[1].length; r++) {
            append(newRightOp, pair[1][r]);
          }

          rightComponent = null;
          break;
        }
      }

      if (rightComponent != null) {
        append(newRightOp, rightComponent);
      }

      leftOp = newLeftOp;
    }

    return [leftOp, newRightOp];
  }; // Transforms op with specified type ('left' or 'right') by otherOp.


  type.transform = function (op, otherOp, type) {
    // debugger;
    if (!(type === 'left' || type === 'right')) throw new Error("type must be 'left' or 'right'");
    if (otherOp.length === 0) return op;
    if (op.length === 1 && otherOp.length === 1) return transformComponent([], op[0], otherOp[0], type);
    if (type === 'left') return transformX(op, otherOp)[0];else return transformX(otherOp, op)[1];
  };
}

;
module.exports = bootstrapTransform;

/***/ }),

/***/ "../modules/ot-json0/lib/index.js":
/*!****************************************!*\
  !*** ../modules/ot-json0/lib/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Only the JSON type is exported, because the text type is deprecated
// otherwise. (If you want to use it somewhere, you're welcome to pull it out
// into a separate module that json0 can depend on).
module.exports = {
  type: __webpack_require__(/*! ./json0 */ "../modules/ot-json0/lib/json0.js")
};

/***/ }),

/***/ "../modules/ot-json0/lib/json0.js":
/*!****************************************!*\
  !*** ../modules/ot-json0/lib/json0.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 This is the implementation of the JSON OT type.

 Spec is here: https://github.com/josephg/ShareJS/wiki/JSON-Operations

 Note: This is being made obsolete. It will soon be replaced by the JSON2 type.
*/

/**
 * UTILITY FUNCTIONS
 */

/**
 * Checks if the passed object is an Array instance. Can't use Array.isArray
 * yet because its not supported on IE8.
 *
 * @param obj
 * @returns {boolean}
 */
// 判断是否是数组
var isArray = function (obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
};
/**
 * Checks if the passed object is an Object instance.
 * No function call (fast) version
 *
 * @param obj
 * @returns {boolean}
 */
// 判断是否是对象


var isObject = function (obj) {
  return !!obj && obj.constructor === Object;
};
/**
 * Clones the passed object using JSON serialization (which is slow).
 *
 * hax, copied from test/types/json. Apparently this is still the fastest way
 * to deep clone an object, assuming we have browser support for JSON.  @see
 * http://jsperf.com/cloning-an-object/12
 */
// 克隆对象


var clone = function (o) {
  return JSON.parse(JSON.stringify(o));
};
/**
 * JSON OT Type
 * @type {*}
 */


var json = {
  name: "json0",
  uri: "http://sharejs.org/types/JSONv0"
}; // You can register another OT type as a subtype in a JSON document using
// the following function. This allows another type to handle certain
// operations instead of the builtin JSON type.
//你可以注册另一个OT类型作为子类型的JSON文档使用
//下面的函数。这允许另一种类型处理某些
//操作而不是内置的JSON类型。

var subtypes = {}; // 注册子类型

json.registerSubtype = function (subtype) {
  subtypes[subtype.name] = subtype;
}; // 创建


json.create = function (data) {
  // Null instead of undefined if you don't pass an argument.
  return data === undefined ? null : clone(data);
}; // 转换组件


json.invertComponent = function (c) {
  var c_ = {
    p: c.p
  }; // handle subtype ops

  if (c.t && subtypes[c.t]) {
    c_.t = c.t;
    c_.o = subtypes[c.t].invert(c.o);
  }

  if (c.si !== void 0) c_.sd = c.si;
  if (c.sd !== void 0) c_.si = c.sd;
  if (c.oi !== void 0) c_.od = c.oi;
  if (c.od !== void 0) c_.oi = c.od;
  if (c.li !== void 0) c_.ld = c.li;
  if (c.ld !== void 0) c_.li = c.ld;
  if (c.na !== void 0) c_.na = -c.na;

  if (c.lm !== void 0) {
    c_.lm = c.p[c.p.length - 1];
    c_.p = c.p.slice(0, c.p.length - 1).concat([c.lm]);
  }

  return c_;
}; // 取反


json.invert = function (op) {
  // 取反
  var op_ = op.slice().reverse();
  var iop = [];

  for (var i = 0; i < op_.length; i++) {
    iop.push(json.invertComponent(op_[i]));
  }

  return iop;
}; // 检查是否是数组


json.checkValidOp = function (op) {
  for (var i = 0; i < op.length; i++) {
    if (!isArray(op[i].p)) throw new Error("Missing path");
  }
}; // 检查list 队列


json.checkList = function (elem) {
  if (!isArray(elem)) throw new Error("Referenced element not a list");
}; // 检查是否是对象


json.checkObj = function (elem) {
  if (!isObject(elem)) {
    throw new Error("Referenced element not an object (it was " + JSON.stringify(elem) + ")");
  }
}; // helper functions to convert old string ops to and from subtype ops
// 用于将旧字符串操作与子类型操作进行转换的辅助函数


function convertFromText(c) {
  c.t = "text0";
  var o = {
    p: c.p.pop()
  };

  if (c.si != null) {
    o.i = c.si;
  }

  if (c.sd != null) {
    o.d = c.sd;
  }

  c.o = [o];
} //转换为文本


function convertToText(c) {
  c.p.push(c.o[0].p);

  if (c.o[0].i != null) {
    c.si = c.o[0].i;
  }

  if (c.o[0].d != null) {
    c.sd = c.o[0].d;
  }

  delete c.t;
  delete c.o;
} //合并


json.apply = function (snapshot, op) {
  // console.log('snapshot=======',snapshot)
  // console.log('op=======',op)
  //校验 op
  json.checkValidOp(op); // 克隆op

  op = clone(op);
  var container = {
    data: snapshot
  };

  for (var i = 0; i < op.length; i++) {
    var c = op[i]; // convert old string ops to use subtype for backwards compatibility 为了向后兼容，将旧的字符串操作转换为使用子类型

    if (c.si != null || c.sd != null) convertFromText(c);
    var parent = null;
    var parentKey = null;
    var elem = container;
    var key = "data";

    for (var j = 0; j < c.p.length; j++) {
      var p = c.p[j];
      parent = elem;
      parentKey = key;
      elem = elem[key];
      key = p;

      if (parent == null) {
        throw new Error("Path invalid");
      }
    } // handle subtype ops


    if (c.t && c.o !== void 0 && subtypes[c.t]) {
      elem[key] = subtypes[c.t].apply(elem[key], c.o); // Number add
    } else if (c.na !== void 0) {
      if (typeof elem[key] != "number") {
        throw new Error("Referenced element not a number");
      }

      elem[key] += c.na;
    } // List replace
    else if (c.li !== void 0 && c.ld !== void 0) {
      json.checkList(elem); // Should check the list element matches c.ld

      elem[key] = c.li;
    } // List insert
    else if (c.li !== void 0) {
      json.checkList(elem);
      elem.splice(key, 0, c.li);
    } // List delete
    else if (c.ld !== void 0) {
      json.checkList(elem); // Should check the list element matches c.ld here too.

      elem.splice(key, 1);
    } // List move
    else if (c.lm !== void 0) {
      json.checkList(elem);

      if (c.lm != key) {
        var e = elem[key]; // Remove it...

        elem.splice(key, 1); // And insert it back.

        elem.splice(c.lm, 0, e);
      }
    } // Object insert / replace
    else if (c.oi !== void 0) {
      json.checkObj(elem); // Should check that elem[key] == c.od

      elem[key] = c.oi;
    } // Object delete
    else if (c.od !== void 0) {
      json.checkObj(elem); // Should check that elem[key] == c.od

      delete elem[key];
    } else {
      throw new Error("invalid / missing instruction in op");
    }
  }

  return container.data;
}; // Helper to break an operation up into a bunch of small ops.


json.shatter = function (op) {
  var results = [];

  for (var i = 0; i < op.length; i++) {
    results.push([op[i]]);
  }

  return results;
}; // Helper for incrementally applying an operation to a snapshot. Calls yield
// after each op component has been applied.


json.incrementalApply = function (snapshot, op, _yield) {
  for (var i = 0; i < op.length; i++) {
    var smallOp = [op[i]];
    snapshot = json.apply(snapshot, smallOp); // I'd just call this yield, but thats a reserved keyword. Bah!

    _yield(smallOp, snapshot);
  }

  return snapshot;
}; // Checks if two paths, p1 and p2 match. //检查路径p1和p2是否匹配。


var pathMatches = json.pathMatches = function (p1, p2, ignoreLast) {
  if (p1.length != p2.length) return false;

  for (var i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i] && (!ignoreLast || i !== p1.length - 1)) return false;
  }

  return true;
};

json.append = function (dest, // 新的op
c // 来源op {}
) {
  // console.log("c=", c);
  // 深度拷贝
  c = clone(c);

  if (dest.length === 0) {
    dest.push(c);
    return;
  } //如果  dest 有数据 获取最后一个


  var last = dest[dest.length - 1]; // convert old string ops to use subtype for backwards compatibility
  // 为了向后兼容，将旧的字符串操作转换为使用子类型

  if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
    // 用于将旧字符串操作与子类型操作进行转换的辅助函数
    convertFromText(c); // 用于将旧字符串操作与子类型操作进行转换的辅助函数

    convertFromText(last);
  }

  if (pathMatches(c.p, last.p)) {
    // handle subtype ops
    if (c.t && last.t && c.t === last.t && subtypes[c.t]) {
      last.o = subtypes[c.t].compose(last.o, c.o); // convert back to old string ops

      if (c.si != null || c.sd != null) {
        var p = c.p;

        for (var i = 0; i < last.o.length - 1; i++) {
          c.o = [last.o.pop()];
          c.p = p.slice();
          convertToText(c);
          dest.push(c);
        }

        convertToText(last);
      }
    } else if (last.na != null && c.na != null) {
      dest[dest.length - 1] = {
        p: last.p,
        na: last.na + c.na
      };
    } else if (last.li !== undefined && c.li === undefined && c.ld === last.li) {
      // insert immediately followed by delete becomes a noop.
      if (last.ld !== undefined) {
        // leave the delete part of the replace
        delete last.li;
      } else {
        dest.pop();
      }
    } else if (last.od !== undefined && last.oi === undefined && c.oi !== undefined && c.od === undefined) {
      last.oi = c.oi;
    } else if (last.oi !== undefined && c.od !== undefined) {
      // The last path component inserted something that the new component deletes (or replaces).
      // Just merge them.
      if (c.oi !== undefined) {
        last.oi = c.oi;
      } else if (last.od !== undefined) {
        delete last.oi;
      } else {
        // An insert directly followed by a delete turns into a no-op and can be removed.
        dest.pop();
      }
    } else if (c.lm !== undefined && c.p[c.p.length - 1] === c.lm) {// don't do anything
    } else {
      dest.push(c);
    }
  } else {
    // convert string ops back
    if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
      convertToText(c);
      convertToText(last);
    }

    dest.push(c);
  }
};

json.compose = function (op1, op2) {
  json.checkValidOp(op1);
  json.checkValidOp(op2);
  var newOp = clone(op1);

  for (var i = 0; i < op2.length; i++) {
    json.append(newOp, op2[i]);
  }

  return newOp;
}; // 序列化op


json.normalize = function (op) {
  // console.log("normalize=", op);
  var newOp = [];
  op = isArray(op) ? op : [op];

  for (var i = 0; i < op.length; i++) {
    var c = op[i];

    if (c.p == null) {
      c.p = [];
    }

    json.append(newOp, c);
  }

  return newOp;
}; // Returns the common length of the paths of ops a and b


json.commonLengthForOps = function (a, b) {
  var alen = a.p.length;
  var blen = b.p.length;
  if (a.na != null || a.t) alen++;
  if (b.na != null || b.t) blen++;

  if (alen === 0) {
    return -1;
  }

  if (blen === 0) {
    return null;
  }

  alen--;
  blen--;

  for (var i = 0; i < alen; i++) {
    var p = a.p[i];

    if (i >= blen || p !== b.p[i]) {
      return null;
    }
  }

  return alen;
}; // Returns true if an op can affect the given path


json.canOpAffectPath = function (op, path) {
  return json.commonLengthForOps({
    p: path
  }, op) != null;
}; // transform c so it applies to a document with otherC applied.


json.transformComponent = function (dest, c, otherC, type) {
  c = clone(c);
  var common = json.commonLengthForOps(otherC, c);
  var common2 = json.commonLengthForOps(c, otherC);
  var cplength = c.p.length;
  var otherCplength = otherC.p.length;

  if (c.na != null || c.t) {
    cplength++;
  }

  if (otherC.na != null || otherC.t) {
    otherCplength++;
  } // if c is deleting something, and that thing is changed by otherC, we need to
  // update c to reflect that change for invertibility.


  if (common2 != null && otherCplength > cplength && c.p[common2] == otherC.p[common2]) {
    if (c.ld !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.ld = json.apply(clone(c.ld), [oc]);
    } else if (c.od !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.od = json.apply(clone(c.od), [oc]);
    }
  }

  if (common != null) {
    var commonOperand = cplength == otherCplength; // backward compatibility for old string ops

    var oc = otherC;

    if ((c.si != null || c.sd != null) && (otherC.si != null || otherC.sd != null)) {
      convertFromText(c);
      oc = clone(otherC);
      convertFromText(oc);
    } // handle subtype ops


    if (oc.t && subtypes[oc.t]) {
      if (c.t && c.t === oc.t) {
        var res = subtypes[c.t].transform(c.o, oc.o, type); // convert back to old string ops

        if (c.si != null || c.sd != null) {
          var p = c.p;

          for (var i = 0; i < res.length; i++) {
            c.o = [res[i]];
            c.p = p.slice();
            convertToText(c);
            json.append(dest, c);
          }
        } else if (!isArray(res) || res.length > 0) {
          c.o = res;
          json.append(dest, c);
        }

        return dest;
      }
    } // transform based on otherC
    else if (otherC.na !== void 0) {// this case is handled below
    } else if (otherC.li !== void 0 && otherC.ld !== void 0) {
      if (otherC.p[common] === c.p[common]) {
        // noop
        if (!commonOperand) {
          return dest;
        } else if (c.ld !== void 0) {
          // we're trying to delete the same element, -> noop
          if (c.li !== void 0 && type === "left") {
            // we're both replacing one element with another. only one can survive
            c.ld = clone(otherC.li);
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.li !== void 0) {
      if (c.li !== void 0 && c.ld === undefined && commonOperand && c.p[common] === otherC.p[common]) {
        // in li vs. li, left wins.
        if (type === "right") c.p[common]++;
      } else if (otherC.p[common] <= c.p[common]) {
        c.p[common]++;
      }

      if (c.lm !== void 0) {
        if (commonOperand) {
          // otherC edits the same list we edit
          if (otherC.p[common] <= c.lm) c.lm++; // changing c.from is handled above.
        }
      }
    } else if (otherC.ld !== void 0) {
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] === c.p[common]) {
            // they deleted the thing we're trying to move
            return dest;
          } // otherC edits the same list we edit


          var p = otherC.p[common];
          var from = c.p[common];
          var to = c.lm;

          if (p < to || p === to && from < to) {
            c.lm--;
          }
        }
      }

      if (otherC.p[common] < c.p[common]) {
        c.p[common]--;
      } else if (otherC.p[common] === c.p[common]) {
        if (otherCplength < cplength) {
          // we're below the deleted element, so -> noop
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0) {
            // we're replacing, they're deleting. we become an insert.
            delete c.ld;
          } else {
            // we're trying to delete the same element, -> noop
            return dest;
          }
        }
      }
    } else if (otherC.lm !== void 0) {
      if (c.lm !== void 0 && cplength === otherCplength) {
        // lm vs lm, here we go!
        var from = c.p[common];
        var to = c.lm;
        var otherFrom = otherC.p[common];
        var otherTo = otherC.lm;

        if (otherFrom !== otherTo) {
          // if otherFrom == otherTo, we don't need to change our op.
          // where did my thing go?
          if (from === otherFrom) {
            // they moved it! tie break.
            if (type === "left") {
              c.p[common] = otherTo;
              if (from === to) // ugh
                c.lm = otherTo;
            } else {
              return dest;
            }
          } else {
            // they moved around it
            if (from > otherFrom) c.p[common]--;
            if (from > otherTo) c.p[common]++;else if (from === otherTo) {
              if (otherFrom > otherTo) {
                c.p[common]++;
                if (from === to) // ugh, again
                  c.lm++;
              }
            } // step 2: where am i going to put it?

            if (to > otherFrom) {
              c.lm--;
            } else if (to === otherFrom) {
              if (to > from) c.lm--;
            }

            if (to > otherTo) {
              c.lm++;
            } else if (to === otherTo) {
              // if we're both moving in the same direction, tie break
              if (otherTo > otherFrom && to > from || otherTo < otherFrom && to < from) {
                if (type === "right") c.lm++;
              } else {
                if (to > from) c.lm++;else if (to === otherFrom) c.lm--;
              }
            }
          }
        }
      } else if (c.li !== void 0 && c.ld === undefined && commonOperand) {
        // li
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p > from) c.p[common]--;
        if (p > to) c.p[common]++;
      } else {
        // ld, ld+li, si, sd, na, oi, od, oi+od, any li on an element beneath
        // the lm
        //
        // i.e. things care about where their item is after the move.
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];

        if (p === from) {
          c.p[common] = to;
        } else {
          if (p > from) c.p[common]--;
          if (p > to) c.p[common]++;else if (p === to && from > to) c.p[common]++;
        }
      }
    } else if (otherC.oi !== void 0 && otherC.od !== void 0) {
      if (c.p[common] === otherC.p[common]) {
        if (c.oi !== void 0 && commonOperand) {
          // we inserted where someone else replaced
          if (type === "right") {
            // left wins
            return dest;
          } else {
            // we win, make our op replace what they inserted
            c.od = otherC.oi;
          }
        } else {
          // -> noop if the other component is deleting the same object (or any parent)
          return dest;
        }
      }
    } else if (otherC.oi !== void 0) {
      if (c.oi !== void 0 && c.p[common] === otherC.p[common]) {
        // left wins if we try to insert at the same place
        if (type === "left") {
          json.append(dest, {
            p: c.p,
            od: otherC.oi
          });
        } else {
          return dest;
        }
      }
    } else if (otherC.od !== void 0) {
      if (c.p[common] == otherC.p[common]) {
        if (!commonOperand) return dest;

        if (c.oi !== void 0) {
          delete c.od;
        } else {
          return dest;
        }
      }
    }
  }

  json.append(dest, c);
  return dest;
};

__webpack_require__(/*! ./bootstrapTransform */ "../modules/ot-json0/lib/bootstrapTransform.js")(json, json.transformComponent, json.checkValidOp, json.append);
/**
 * Register a subtype for string operations, using the text0 type.
 */


var text = __webpack_require__(/*! ./text0 */ "../modules/ot-json0/lib/text0.js");

json.registerSubtype(text);
module.exports = json;

/***/ }),

/***/ "../modules/ot-json0/lib/text0.js":
/*!****************************************!*\
  !*** ../modules/ot-json0/lib/text0.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// DEPRECATED!
//
// This type works, but is not exported. Its included here because the JSON0
// embedded string operations use this library.
// A simple text implementation
//
// Operations are lists of components. Each component either inserts or deletes
// at a specified position in the document.
//
// Components are either:
//  {i:'str', p:100}: Insert 'str' at position 100 in the document
//  {d:'str', p:100}: Delete 'str' at position 100 in the document
//
// Components in an operation are executed sequentially, so the position of components
// assumes previous components have already executed.
//
// Eg: This op:
//   [{i:'abc', p:0}]
// is equivalent to this op:
//   [{i:'a', p:0}, {i:'b', p:1}, {i:'c', p:2}]
var text = module.exports = {
  name: "text0",
  uri: "http://sharejs.org/types/textv0",
  create: function (initial) {
    if (initial != null && typeof initial !== "string") {
      throw new Error("Initial data must be a string");
    }

    return initial || "";
  }
};
/** Insert s2 into s1 at pos. */

var strInject = function (s1, pos, s2) {
  return s1.slice(0, pos) + s2 + s1.slice(pos);
};
/** Check that an operation component is valid. Throws if its invalid. */


var checkValidComponent = function (c) {
  if (typeof c.p !== "number") throw new Error("component missing position field");
  if (typeof c.i === "string" === (typeof c.d === "string")) throw new Error("component needs an i or d field");
  if (c.p < 0) throw new Error("position cannot be negative");
};
/** Check that an operation is valid */


var checkValidOp = function (op) {
  for (var i = 0; i < op.length; i++) {
    checkValidComponent(op[i]);
  }
};
/** Apply op to snapshot */


text.apply = function (snapshot, op) {
  var deleted;
  checkValidOp(op);

  for (var i = 0; i < op.length; i++) {
    var component = op[i];

    if (component.i != null) {
      snapshot = strInject(snapshot, component.p, component.i);
    } else {
      deleted = snapshot.slice(component.p, component.p + component.d.length);
      if (component.d !== deleted) throw new Error("Delete component '" + component.d + "' does not match deleted text '" + deleted + "'");
      snapshot = snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
    }
  }

  return snapshot;
};
/**
 * Append a component to the end of newOp. Exported for use by the random op
 * generator and the JSON0 type.
 */


var append = text._append = function (newOp, c) {
  if (c.i === "" || c.d === "") return;

  if (newOp.length === 0) {
    newOp.push(c);
  } else {
    var last = newOp[newOp.length - 1];

    if (last.i != null && c.i != null && last.p <= c.p && c.p <= last.p + last.i.length) {
      // Compose the insert into the previous insert
      newOp[newOp.length - 1] = {
        i: strInject(last.i, c.p - last.p, c.i),
        p: last.p
      };
    } else if (last.d != null && c.d != null && c.p <= last.p && last.p <= c.p + c.d.length) {
      // Compose the deletes together
      newOp[newOp.length - 1] = {
        d: strInject(c.d, last.p - c.p, last.d),
        p: c.p
      };
    } else {
      newOp.push(c);
    }
  }
};
/** Compose op1 and op2 together */


text.compose = function (op1, op2) {
  checkValidOp(op1);
  checkValidOp(op2);
  var newOp = op1.slice();

  for (var i = 0; i < op2.length; i++) {
    append(newOp, op2[i]);
  }

  return newOp;
};
/** Clean up an op */


text.normalize = function (op) {
  var newOp = []; // Normalize should allow ops which are a single (unwrapped) component:
  // {i:'asdf', p:23}.
  // There's no good way to test if something is an array:
  // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
  // so this is probably the least bad solution.

  if (op.i != null || op.p != null) op = [op];

  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.p == null) c.p = 0;
    append(newOp, c);
  }

  return newOp;
}; // This helper method transforms a position by an op component.
//
// If c is an insert, insertAfter specifies whether the transform
// is pushed after the insert (true) or before it (false).
//
// insertAfter is optional for deletes.


var transformPosition = function (pos, c, insertAfter) {
  // This will get collapsed into a giant ternary by uglify.
  if (c.i != null) {
    if (c.p < pos || c.p === pos && insertAfter) {
      return pos + c.i.length;
    } else {
      return pos;
    }
  } else {
    // I think this could also be written as: Math.min(c.p, Math.min(c.p -
    // otherC.p, otherC.d.length)) but I think its harder to read that way, and
    // it compiles using ternary operators anyway so its no slower written like
    // this.
    if (pos <= c.p) {
      return pos;
    } else if (pos <= c.p + c.d.length) {
      return c.p;
    } else {
      return pos - c.d.length;
    }
  }
}; // Helper method to transform a cursor position as a result of an op.
//
// Like transformPosition above, if c is an insert, insertAfter specifies
// whether the cursor position is pushed after an insert (true) or before it
// (false).


text.transformCursor = function (position, op, side) {
  var insertAfter = side === "right";

  for (var i = 0; i < op.length; i++) {
    position = transformPosition(position, op[i], insertAfter);
  }

  return position;
}; // Transform an op component by another op component. Asymmetric.
// The result will be appended to destination.
//
// exported for use in JSON type


var transformComponent = text._tc = function (dest, c, otherC, side) {
  //var cIntersect, intersectEnd, intersectStart, newC, otherIntersect, s;
  checkValidComponent(c);
  checkValidComponent(otherC);

  if (c.i != null) {
    // Insert.
    append(dest, {
      i: c.i,
      p: transformPosition(c.p, otherC, side === "right")
    });
  } else {
    // Delete
    if (otherC.i != null) {
      // Delete vs insert
      var s = c.d;

      if (c.p < otherC.p) {
        append(dest, {
          d: s.slice(0, otherC.p - c.p),
          p: c.p
        });
        s = s.slice(otherC.p - c.p);
      }

      if (s !== "") append(dest, {
        d: s,
        p: c.p + otherC.i.length
      });
    } else {
      // Delete vs delete
      if (c.p >= otherC.p + otherC.d.length) append(dest, {
        d: c.d,
        p: c.p - otherC.d.length
      });else if (c.p + c.d.length <= otherC.p) append(dest, c);else {
        // They overlap somewhere.
        var newC = {
          d: "",
          p: c.p
        };
        if (c.p < otherC.p) newC.d = c.d.slice(0, otherC.p - c.p);
        if (c.p + c.d.length > otherC.p + otherC.d.length) newC.d += c.d.slice(otherC.p + otherC.d.length - c.p); // This is entirely optional - I'm just checking the deleted text in
        // the two ops matches

        var intersectStart = Math.max(c.p, otherC.p);
        var intersectEnd = Math.min(c.p + c.d.length, otherC.p + otherC.d.length);
        var cIntersect = c.d.slice(intersectStart - c.p, intersectEnd - c.p);
        var otherIntersect = otherC.d.slice(intersectStart - otherC.p, intersectEnd - otherC.p);
        if (cIntersect !== otherIntersect) throw new Error("Delete ops delete different text in the same region of the document");

        if (newC.d !== "") {
          newC.p = transformPosition(newC.p, otherC);
          append(dest, newC);
        }
      }
    }
  }

  return dest;
};

var invertComponent = function (c) {
  return c.i != null ? {
    d: c.i,
    p: c.p
  } : {
    i: c.d,
    p: c.p
  };
}; // No need to use append for invert, because the components won't be able to
// cancel one another.


text.invert = function (op) {
  // Shallow copy & reverse that sucka.
  op = op.slice().reverse();

  for (var i = 0; i < op.length; i++) {
    op[i] = invertComponent(op[i]);
  }

  return op;
};

__webpack_require__(/*! ./bootstrapTransform */ "../modules/ot-json0/lib/bootstrapTransform.js")(text, transformComponent, checkValidOp, append);

/***/ }),

/***/ "../modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js":
/*!****************************************************************************!*\
  !*** ../modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator],
      i = 0;
  if (m) return m.call(o);
  return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

var Event =
/** @class */
function () {
  function Event(type, target) {
    this.target = target;
    this.type = type;
  }

  return Event;
}();

var ErrorEvent =
/** @class */
function (_super) {
  __extends(ErrorEvent, _super);

  function ErrorEvent(error, target) {
    var _this = _super.call(this, 'error', target) || this;

    _this.message = error.message;
    _this.error = error;
    return _this;
  }

  return ErrorEvent;
}(Event);

var CloseEvent =
/** @class */
function (_super) {
  __extends(CloseEvent, _super);

  function CloseEvent(code, reason, target) {
    if (code === void 0) {
      code = 1000;
    }

    if (reason === void 0) {
      reason = '';
    }

    var _this = _super.call(this, 'close', target) || this;

    _this.wasClean = true;
    _this.code = code;
    _this.reason = reason;
    return _this;
  }

  return CloseEvent;
}(Event);
/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */


var getGlobalWebSocket = function () {
  if (typeof WebSocket !== 'undefined') {
    // @ts-ignore
    return WebSocket;
  }
};
/**
 * Returns true if given argument looks like a WebSocket class
 */


var isWebSocket = function (w) {
  return typeof w !== 'undefined' && !!w && w.CLOSING === 2;
};

var DEFAULT = {
  maxReconnectionDelay: 10000,
  minReconnectionDelay: 1000 + Math.random() * 4000,
  minUptime: 5000,
  reconnectionDelayGrowFactor: 1.3,
  connectionTimeout: 4000,
  maxRetries: Infinity,
  maxEnqueuedMessages: Infinity,
  startClosed: false,
  debug: false
};

var ReconnectingWebSocket =
/** @class */
function () {
  function ReconnectingWebSocket(url, protocols, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    this._listeners = {
      error: [],
      message: [],
      open: [],
      close: []
    };
    this._retryCount = -1;
    this._shouldReconnect = true;
    this._connectLock = false;
    this._binaryType = 'blob';
    this._closeCalled = false;
    this._messageQueue = [];
    /**
     * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
     */

    this.onclose = null;
    /**
     * An event listener to be called when an error occurs
     */

    this.onerror = null;
    /**
     * An event listener to be called when a message is received from the server
     */

    this.onmessage = null;
    /**
     * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
     * this indicates that the connection is ready to send and receive data
     */

    this.onopen = null;

    this._handleOpen = function (event) {
      _this._debug('open event');

      var _a = _this._options.minUptime,
          minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
      clearTimeout(_this._connectTimeout);
      _this._uptimeTimeout = setTimeout(function () {
        return _this._acceptOpen();
      }, minUptime);
      _this._ws.binaryType = _this._binaryType; // send enqueued messages (messages sent before websocket open event)

      _this._messageQueue.forEach(function (message) {
        return _this._ws.send(message);
      });

      _this._messageQueue = [];

      if (_this.onopen) {
        _this.onopen(event);
      }

      _this._listeners.open.forEach(function (listener) {
        return _this._callEventListener(event, listener);
      });
    };

    this._handleMessage = function (event) {
      _this._debug('message event');

      if (_this.onmessage) {
        _this.onmessage(event);
      }

      _this._listeners.message.forEach(function (listener) {
        return _this._callEventListener(event, listener);
      });
    };

    this._handleError = function (event) {
      _this._debug('error event', event.message);

      _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);

      if (_this.onerror) {
        _this.onerror(event);
      }

      _this._debug('exec error listeners');

      _this._listeners.error.forEach(function (listener) {
        return _this._callEventListener(event, listener);
      });

      _this._connect();
    };

    this._handleClose = function (event) {
      _this._debug('close event');

      _this._clearTimeouts();

      if (_this._shouldReconnect) {
        _this._connect();
      }

      if (_this.onclose) {
        _this.onclose(event);
      }

      _this._listeners.close.forEach(function (listener) {
        return _this._callEventListener(event, listener);
      });
    };

    this._url = url;
    this._protocols = protocols;
    this._options = options;

    if (this._options.startClosed) {
      this._shouldReconnect = false;
    }

    this._connect();
  }

  Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
    get: function () {
      return 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket, "OPEN", {
    get: function () {
      return 1;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
    get: function () {
      return 2;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
    get: function () {
      return 3;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
    get: function () {
      return ReconnectingWebSocket.CONNECTING;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
    get: function () {
      return ReconnectingWebSocket.OPEN;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
    get: function () {
      return ReconnectingWebSocket.CLOSING;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
    get: function () {
      return ReconnectingWebSocket.CLOSED;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
    get: function () {
      return this._ws ? this._ws.binaryType : this._binaryType;
    },
    set: function (value) {
      this._binaryType = value;

      if (this._ws) {
        this._ws.binaryType = value;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
    /**
     * Returns the number or connection retries
     */
    get: function () {
      return Math.max(this._retryCount, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
    /**
     * The number of bytes of data that have been queued using calls to send() but not yet
     * transmitted to the network. This value resets to zero once all queued data has been sent.
     * This value does not reset to zero when the connection is closed; if you keep calling send(),
     * this will continue to climb. Read only
     */
    get: function () {
      var bytes = this._messageQueue.reduce(function (acc, message) {
        if (typeof message === 'string') {
          acc += message.length; // not byte size
        } else if (message instanceof Blob) {
          acc += message.size;
        } else {
          acc += message.byteLength;
        }

        return acc;
      }, 0);

      return bytes + (this._ws ? this._ws.bufferedAmount : 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
    /**
     * The extensions selected by the server. This is currently only the empty string or a list of
     * extensions as negotiated by the connection
     */
    get: function () {
      return this._ws ? this._ws.extensions : '';
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
    /**
     * A string indicating the name of the sub-protocol the server selected;
     * this will be one of the strings specified in the protocols parameter when creating the
     * WebSocket object
     */
    get: function () {
      return this._ws ? this._ws.protocol : '';
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
    /**
     * The current state of the connection; this is one of the Ready state constants
     */
    get: function () {
      if (this._ws) {
        return this._ws.readyState;
      }

      return this._options.startClosed ? ReconnectingWebSocket.CLOSED : ReconnectingWebSocket.CONNECTING;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
    /**
     * The URL as resolved by the constructor
     */
    get: function () {
      return this._ws ? this._ws.url : '';
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Closes the WebSocket connection or connection attempt, if any. If the connection is already
   * CLOSED, this method does nothing
   */

  ReconnectingWebSocket.prototype.close = function (code, reason) {
    if (code === void 0) {
      code = 1000;
    }

    this._closeCalled = true;
    this._shouldReconnect = false;

    this._clearTimeouts();

    if (!this._ws) {
      this._debug('close enqueued: no ws instance');

      return;
    }

    if (this._ws.readyState === this.CLOSED) {
      this._debug('close: already closed');

      return;
    }

    this._ws.close(code, reason);
  };
  /**
   * Closes the WebSocket connection or connection attempt and connects again.
   * Resets retry counter;
   */


  ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
    this._shouldReconnect = true;
    this._closeCalled = false;
    this._retryCount = -1;

    if (!this._ws || this._ws.readyState === this.CLOSED) {
      this._connect();
    } else {
      this._disconnect(code, reason);

      this._connect();
    }
  };
  /**
   * Enqueue specified data to be transmitted to the server over the WebSocket connection
   */


  ReconnectingWebSocket.prototype.send = function (data) {
    if (this._ws && this._ws.readyState === this.OPEN) {
      this._debug('send', data);

      this._ws.send(data);
    } else {
      var _a = this._options.maxEnqueuedMessages,
          maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;

      if (this._messageQueue.length < maxEnqueuedMessages) {
        this._debug('enqueue', data);

        this._messageQueue.push(data);
      }
    }
  };
  /**
   * Register an event handler of a specific event type
   */


  ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
    if (this._listeners[type]) {
      // @ts-ignore
      this._listeners[type].push(listener);
    }
  };

  ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
    var e_1, _a;

    var listeners = this._listeners[event.type];

    if (listeners) {
      try {
        for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
          var listener = listeners_1_1.value;

          this._callEventListener(event, listener);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    return true;
  };
  /**
   * Removes an event listener
   */


  ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
    if (this._listeners[type]) {
      // @ts-ignore
      this._listeners[type] = this._listeners[type].filter(function (l) {
        return l !== listener;
      });
    }
  };

  ReconnectingWebSocket.prototype._debug = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (this._options.debug) {
      // not using spread because compiled version uses Symbols
      // tslint:disable-next-line
      console.log.apply(console, __spread(['RWS>'], args));
    }
  };

  ReconnectingWebSocket.prototype._getNextDelay = function () {
    var _a = this._options,
        _b = _a.reconnectionDelayGrowFactor,
        reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b,
        _c = _a.minReconnectionDelay,
        minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c,
        _d = _a.maxReconnectionDelay,
        maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
    var delay = 0;

    if (this._retryCount > 0) {
      delay = minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);

      if (delay > maxReconnectionDelay) {
        delay = maxReconnectionDelay;
      }
    }

    this._debug('next delay', delay);

    return delay;
  };

  ReconnectingWebSocket.prototype._wait = function () {
    var _this = this;

    return new Promise(function (resolve) {
      setTimeout(resolve, _this._getNextDelay());
    });
  };

  ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
    if (typeof urlProvider === 'string') {
      return Promise.resolve(urlProvider);
    }

    if (typeof urlProvider === 'function') {
      var url = urlProvider();

      if (typeof url === 'string') {
        return Promise.resolve(url);
      }

      if (!!url.then) {
        return url;
      }
    }

    throw Error('Invalid URL');
  };

  ReconnectingWebSocket.prototype._connect = function () {
    var _this = this;

    if (this._connectLock || !this._shouldReconnect) {
      return;
    }

    this._connectLock = true;
    var _a = this._options,
        _b = _a.maxRetries,
        maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b,
        _c = _a.connectionTimeout,
        connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c,
        _d = _a.WebSocket,
        WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;

    if (this._retryCount >= maxRetries) {
      this._debug('max retries reached', this._retryCount, '>=', maxRetries);

      return;
    }

    this._retryCount++;

    this._debug('connect', this._retryCount);

    this._removeListeners();

    if (!isWebSocket(WebSocket)) {
      throw Error('No valid WebSocket class provided');
    }

    this._wait().then(function () {
      return _this._getNextUrl(_this._url);
    }).then(function (url) {
      // close could be called before creating the ws
      if (_this._closeCalled) {
        return;
      }

      _this._debug('connect', {
        url: url,
        protocols: _this._protocols
      });

      _this._ws = _this._protocols ? new WebSocket(url, _this._protocols) : new WebSocket(url);
      _this._ws.binaryType = _this._binaryType;
      _this._connectLock = false;

      _this._addListeners();

      _this._connectTimeout = setTimeout(function () {
        return _this._handleTimeout();
      }, connectionTimeout);
    });
  };

  ReconnectingWebSocket.prototype._handleTimeout = function () {
    this._debug('timeout event');

    this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
  };

  ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
    if (code === void 0) {
      code = 1000;
    }

    this._clearTimeouts();

    if (!this._ws) {
      return;
    }

    this._removeListeners();

    try {
      this._ws.close(code, reason);

      this._handleClose(new CloseEvent(code, reason, this));
    } catch (error) {// ignore
    }
  };

  ReconnectingWebSocket.prototype._acceptOpen = function () {
    this._debug('accept open');

    this._retryCount = 0;
  };

  ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
    if ('handleEvent' in listener) {
      // @ts-ignore
      listener.handleEvent(event);
    } else {
      // @ts-ignore
      listener(event);
    }
  };

  ReconnectingWebSocket.prototype._removeListeners = function () {
    if (!this._ws) {
      return;
    }

    this._debug('removeListeners');

    this._ws.removeEventListener('open', this._handleOpen);

    this._ws.removeEventListener('close', this._handleClose);

    this._ws.removeEventListener('message', this._handleMessage); // @ts-ignore


    this._ws.removeEventListener('error', this._handleError);
  };

  ReconnectingWebSocket.prototype._addListeners = function () {
    if (!this._ws) {
      return;
    }

    this._debug('addListeners');

    this._ws.addEventListener('open', this._handleOpen);

    this._ws.addEventListener('close', this._handleClose);

    this._ws.addEventListener('message', this._handleMessage); // @ts-ignore


    this._ws.addEventListener('error', this._handleError);
  };

  ReconnectingWebSocket.prototype._clearTimeouts = function () {
    clearTimeout(this._connectTimeout);
    clearTimeout(this._uptimeTimeout);
  };

  return ReconnectingWebSocket;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReconnectingWebSocket);

/***/ }),

/***/ "../modules/sharedb-string-binding/index.js":
/*!**************************************************!*\
  !*** ../modules/sharedb-string-binding/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TextDiffBinding = __webpack_require__(/*! ../text-diff-binding */ "../modules/text-diff-binding/index.js");

module.exports = StringBinding; //构造函数

function StringBinding(element, doc, path) {
  console.log("element=", element);
  console.log("doc=", doc);
  console.log("path=", path); // 构造继承

  TextDiffBinding.call(this, element); //获取文档对象 用户socket 发送

  this.doc = doc; //

  this.path = path || [];
  this._opListener = null;
  this._inputListener = null;
} // 原型继承 寄生耦合继承


StringBinding.prototype = Object.create(TextDiffBinding.prototype);
StringBinding.prototype.constructor = StringBinding; // 开始执行

StringBinding.prototype.setup = function () {
  // 更新文档到真实dom中
  this.update(); //

  this.attachDoc(); // 添加input事件

  this.attachElement();
}; // 销毁 op 订阅 删除input事件


StringBinding.prototype.destroy = function () {
  // 删除input事件
  this.detachElement(); // 销毁 op 订阅

  this.detachDoc();
}; // 添加input事件


StringBinding.prototype.attachElement = function () {
  var binding = this; //为input添加onChange事件 根据用户onChange事件判断是删除还是新增字符串

  this._inputListener = function () {
    //为input添加onChange事件 根据用户onChange事件判断是删除还是新增字符串
    binding.onInput();
  }; // 添加input事件


  this.element.addEventListener("input", this._inputListener, false);
}; // 删除input事件


StringBinding.prototype.detachElement = function () {
  // 删除input事件
  this.element.removeEventListener("input", this._inputListener, false);
}; //订阅sharedb响应op事件


StringBinding.prototype.attachDoc = function () {
  var binding = this;

  this._opListener = function (op, source) {
    console.log('获取服务器socket _opListener==');
    console.log('op==', op);
    console.log('source==', source);
    console.log('arguments==', arguments); //订阅sharedb响应op事件

    binding._onOp(op, source);
  }; // 获取服务器socket


  this.doc.on("op", this._opListener);
}; // 销毁 op 订阅


StringBinding.prototype.detachDoc = function () {
  this.doc.removeListener("op", this._opListener);
}; //订阅sharedb响应op事件

/*
这里的op等于 _insert和_remove输入的op
[
  op
]
*/


StringBinding.prototype._onOp = function (op, source) {
  console.log("op=", op); // 如果当前是自己则不执行下面代码

  if (source === this) {
    return;
  }

  if (op.length === 0) {
    return;
  }

  if (op.length > 1) {
    throw new Error("Op with multiple components emitted");
  }

  var component = op[0]; // 判断是否是同一个文档连接的

  if (isSubpath(this.path, component.p)) {
    // 判断是否是插入op
    this._parseInsertOp(component); // 判断是否是删除op


    this._parseRemoveOp(component);
  } else if (isSubpath(component.p, this.path)) {
    //直接更新文档
    this._parseParentOp();
  }
};

StringBinding.prototype._parseInsertOp = function (component) {
  if (!component.si) {
    return;
  } // 获取插入位置


  var index = component.p[component.p.length - 1]; //获取插入字符串长度

  var length = component.si.length;
  this.onInsert(index, // 获取插入位置
  length //获取插入字符串长度
  );
}; //


StringBinding.prototype._parseRemoveOp = function (component) {
  // 判断是否是删除op
  if (!component.sd) {
    return;
  } // 删除字符串开始位置


  var index = component.p[component.p.length - 1]; // 删除字符串长度

  var length = component.sd.length; // 删除字符串并且设置光标偏移

  this.onRemove(index, // 删除字符串开始位置
  length // 删除字符串长度
  );
}; // 不设置光标直接更新文档


StringBinding.prototype._parseParentOp = function () {
  // 更新文档到真实dom中
  this.update();
}; //获取文档内容


StringBinding.prototype._get = function () {
  // 获取文档
  var value = this.doc.data;

  for (var i = 0; i < this.path.length; i++) {
    var segment = this.path[i];
    value = value[segment];
  }

  return value;
};
/* 
  op={
    p:[
      "content",
      1  // 插入位置
  ],
    si:'3'  // 插入内容
  }
 */


StringBinding.prototype._insert = function (index, // 插入开始位置
text // 获取插入文本
) {
  console.log("this.path.concat=", this.path.concat);
  console.log("this.path=", this.path);
  console.log("index=", index);
  var path = this.path.concat(index);
  console.log("path=", path);
  var op = {
    p: path,
    si: text
  };
  console.log("op=", op);
  console.log('广播 给服务器 发送websocket _insert ='); // 广播 给服务器 发送websocket

  this.doc.submitOp(op, {
    source: this,
    id: 123
  });
};
/*
  删除字符串
  op={
    p:[
      "content",
      1    1  // 删除位置
    ],
    sd:'3'  // 删除内容
  }
*/


StringBinding.prototype._remove = function (index, // 插入开始位置
text // 获取插入文本
) {
  var path = this.path.concat(index);
  var op = {
    p: path,
    sd: text
  };
  console.log("op=", op); // 广播 给服务器 发送websocket

  this.doc.submitOp(op, {
    source: this,
    id: 999
  });
}; // 判断是否是同一个文档连接的

/*
 这里
 path= ['content']
 testPath= (2) ['content', 5]
 所以返回的是true
*/


function isSubpath(path, testPath) {
  console.log("path=", path);
  console.log("testPath=", testPath);

  for (var i = 0; i < path.length; i++) {
    if (testPath[i] !== path[i]) return false;
  }

  return true;
}

/***/ }),

/***/ "../modules/sharedb/lib/client/connection.js":
/*!***************************************************!*\
  !*** ../modules/sharedb/lib/client/connection.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Doc = __webpack_require__(/*! ./doc */ "../modules/sharedb/lib/client/doc.js");

var Query = __webpack_require__(/*! ./query */ "../modules/sharedb/lib/client/query.js");

var Presence = __webpack_require__(/*! ./presence/presence */ "../modules/sharedb/lib/client/presence/presence.js");

var DocPresence = __webpack_require__(/*! ./presence/doc-presence */ "../modules/sharedb/lib/client/presence/doc-presence.js");

var SnapshotVersionRequest = __webpack_require__(/*! ./snapshot-request/snapshot-version-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-version-request.js");

var SnapshotTimestampRequest = __webpack_require__(/*! ./snapshot-request/snapshot-timestamp-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-timestamp-request.js");

var emitter = __webpack_require__(/*! ../emitter */ "../modules/sharedb/lib/emitter.js");

var ShareDBError = __webpack_require__(/*! ../error */ "../modules/sharedb/lib/error.js");

var types = __webpack_require__(/*! ../types */ "../modules/sharedb/lib/types.js");

var util = __webpack_require__(/*! ../util */ "../modules/sharedb/lib/util.js");

var logger = __webpack_require__(/*! ../logger */ "../modules/sharedb/lib/logger/index.js");

var ERROR_CODE = ShareDBError.CODES; // 如果状态等于 0 或者 1 那么 就是在连接中

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


module.exports = Connection; // 构造函数

function Connection(socket //socket对象
) {
  // 引入 events 模块 发布订阅事件
  emitter.EventEmitter.call(this); // Map of collection -> id -> doc object for created documents.
  // (created documents MUST BE UNIQUE)
  //集合的映射-> id ->文档对象创建的文档。
  //创建的文档必须是唯一的

  this.collections = {}; // Each query and snapshot request is created with an id that the server uses when it sends us
  // info about the request (updates, etc)
  //每个查询和快照请求都创建了一个id，当服务器发送给我们时使用这个id
  //请求的信息(更新等)

  this.nextQueryId = 1;
  this.nextSnapshotRequestId = 1; // Map from query ID -> query object.
  //从查询ID ->查询对象映射。

  this.queries = {}; // Maps from channel -> presence objects
  //从channel ->存在对象映射

  this._presences = {}; // Map from snapshot request ID -> snapshot request
  //映射快照请求ID ->快照请求

  this._snapshotRequests = {}; // A unique message number for the given id
  //给定id的唯一消息号

  this.seq = 1; // A unique message number for presence

  this._presenceSeq = 1; // Equals agent.src on the server

  this.id = null; // This direct reference from connection to agent is not used internal to
  // ShareDB, but it is handy for server-side only user code that may cache
  // state on the agent and read it in middleware

  this.agent = null;
  this.debug = false; //获取连接状态 如果状态等于 0 或者 1 那么 就是在连接中

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

  this.socket = socket; // State of the connection. The corresponding events are emitted when this changes
  //
  // - 'connecting'   The connection is still being established, or we are still
  //                    waiting on the server to send us the initialization message
  // - 'connected'    The connection is open and we have connected to a server
  //                    and recieved the initialization message
  // - 'disconnected' Connection is closed, but it will reconnect automatically
  // - 'closed'       The connection was closed by the client, and will not reconnect
  // - 'stopped'      The connection was closed by the server, and will not reconnect
  // 获取最新的状态

  var newState = connectionState(socket); // 设置socket状态

  this._setState(newState); // This is a helper variable the document uses to see whether we're
  // currently in a 'live' state. It is true if and only if we're connected


  this.canSend = false;
  var connection = this; // 获取socket消息

  socket.onmessage = function (event) {
    // console.log("event=", event);
    try {
      var data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch (err) {
      logger.warn("Failed to parse message", event);
      return;
    }

    if (connection.debug) {
      logger.info("RECV", JSON.stringify(data));
    }

    var request = {
      data: data
    };
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
  }; // If socket is already open, do handshake immediately. //如果socket已经打开，立即握手。
  // 如果socket已经打开，则先发一个 hs 给服务器


  if (socket.readyState === 1) {
    connection._initializeHandshake();
  } // socket 已经连接上


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
  } // Switch on the message action. Most messages are for documents and are
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
}; //


Connection.prototype._reset = function () {
  this.agent = null;
}; // Set the connection's state. The connection is basically a state machine. 设置连接的状态。连接基本上是一个状态机。


Connection.prototype._setState = function (newState, reason) {
  // console.log('this.state======',this.state)
  // console.log('newState======',newState)
  if (this.state === newState) return; // I made a state diagram. The only invalid transitions are getting to
  // 'connecting' from anywhere other than 'disconnected' and getting to
  // 'connected' from anywhere other than 'connecting'.

  if (newState === "connecting" && this.state !== "disconnected" && this.state !== "stopped" && this.state !== "closed" || newState === "connected" && this.state !== "connecting") {
    var err = new ShareDBError(ERROR_CODE.ERR_CONNECTION_STATE_TRANSITION_INVALID, "Cannot transition directly from " + this.state + " to " + newState);
    return this.emit("error", err);
  }

  this.state = newState;
  this.canSend = newState === "connected";

  if (newState === "disconnected" || newState === "stopped" || newState === "closed") {
    this._reset();
  } // Group subscribes together to help server make more efficient calls 分组订阅可以帮助服务器进行更高效的呼叫


  this.startBulk(); // Emit the event to all queries 向所有查询发出事件

  for (var id in this.queries) {
    var query = this.queries[id];

    query._onConnectionStateChanged();
  } // console.log(" this.bulk =", this.bulk);
  // Emit the event to all documents 向所有文档发出事件


  for (var collection in this.collections) {
    var docs = this.collections[collection]; // console.log("docs=", docs);

    for (var id in docs) {
      docs[id]._onConnectionStateChanged();
    }
  } // console.log(" this.bulk =", this.bulk);
  // Emit the event to all Presences //向所有存在发出事件


  for (var channel in this._presences) {
    this._presences[channel]._onConnectionStateChanged();
  } // console.log(" this.bulk =", this.bulk);
  // Emit the event to all snapshots //将事件发送到所有快照


  for (var id in this._snapshotRequests) {
    var snapshotRequest = this._snapshotRequests[id];

    snapshotRequest._onConnectionStateChanged();
  } // console.log(" this.bulk =", this.bulk);


  this.endBulk();
  this.emit(newState, reason);
  this.emit("state", newState, reason);
}; // 设置批量订阅标志


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
    this.send({
      a: action,
      c: collection,
      d: id
    });
  } else if (ids.length) {
    this.send({
      a: "b" + action,
      c: collection,
      b: ids
    });
  }

  if (versionsCount === 1) {
    var version = versions[versionId];
    this.send({
      a: action,
      c: collection,
      d: versionId,
      v: version
    });
  } else if (versionsCount) {
    this.send({
      a: "b" + action,
      c: collection,
      b: versions
    });
  }
}; // 发送动作  // 把文档注入到this.collections对象中 ，为this.bulk注入action和版本号


Connection.prototype._sendAction = function (action, // 动作
doc, // 文档对象
version // 版本号
) {
  // Ensure the doc is registered so that it receives the reply message
  // 把文档注入到this.collections对象中
  this._addDoc(doc); // console.log("this.bulk===========", this.bulk);
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
    var message = {
      a: action,
      c: doc.collection,
      d: doc.id,
      v: version
    };
    console.log("message======", message); // ;

    this.send(message);
  }
};

Connection.prototype.sendFetch = function (doc) {
  return this._sendAction("f", doc, doc.version);
}; //发送订阅 告诉服务器文档信息 发送s


Connection.prototype.sendSubscribe = function (doc) {
  // 发送客户端文档信息给服务器
  return this._sendAction("s", doc, // 文档对象
  doc.version //文档版本号
  );
};

Connection.prototype.sendUnsubscribe = function (doc) {
  return this._sendAction("u", doc);
}; // 发送op给服务器


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
    x: {}
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
  } // console.log('message2=', message)
  //
  // 发消息给服务器
  // ;


  this.send(message);
};
/**
 * Sends a message down the socket 发送消息给后台服务器
 */


Connection.prototype.send = function (message) {
  console.log("发送消息给后台服务器=", message); // ;

  if (this.debug) {
    logger.info("SEND", JSON.stringify(message));
  }

  this.emit("send", message); // 发送消息

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


Connection.prototype.get = function (collection, //collections 集合key
id //文档id 集合key
) {
  var docs = this.collections[collection] || (this.collections[collection] = {});
  var doc = docs[id]; // 如果文档不存在则创建一个文档

  if (!doc) {
    doc = docs[id] = new Doc(this, collection, id);
    this.emit("doc", doc);
  } // console.log("doc========", doc);
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
}; // 把文档注入到this.collections对象中


Connection.prototype._addDoc = function (doc) {
  // 把文档注入到this.collections对象中
  var docs = this.collections[doc.collection];

  if (!docs) {
    docs = this.collections[doc.collection] = {};
  }

  if (docs[doc.id] !== doc) {
    docs[doc.id] = doc;
  }
}; // Helper for createFetchQuery and createSubscribeQuery, below.


Connection.prototype._createQuery = function (action, collection, q, options, callback) {
  var id = this.nextQueryId++;
  var query = new Query(action, this, id, collection, q, options, callback);
  this.queries[id] = query;
  query.send();
  return query;
}; // Internal function. Use query.destroy() to remove queries.


Connection.prototype._destroyQuery = function (query) {
  delete this.queries[query.id];
}; // The query options object can contain the following fields:
//
// db: Name of the db for the query. You can attach extraDbs to ShareDB and
//   pick which one the query should hit using this parameter.
// Create a fetch query. Fetch queries are only issued once, returning the
// results directly into the callback.
//
// The callback should have the signature function(error, results, extra)
// where results is a list of Doc objects.


Connection.prototype.createFetchQuery = function (collection, q, options, callback) {
  return this._createQuery("qf", collection, q, options, callback);
}; // Create a subscribe query. Subscribe queries return with the initial data
// through the callback, then update themselves whenever the query result set
// changes via their own event emitter.
//
// If present, the callback should have the signature function(error, results, extra)
// where results is a list of Doc objects.


Connection.prototype.createSubscribeQuery = function (collection, q, options, callback) {
  return this._createQuery("qs", collection, q, options, callback);
};

Connection.prototype.hasPending = function () {
  return !!(this._firstDoc(hasPending) || this._firstQuery(hasPending) || this._firstSnapshotRequest());
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
  } // Call back when no pending operations


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


Connection.prototype.fetchSnapshot = function (collection, id, version, callback) {
  if (typeof version === "function") {
    callback = version;
    version = null;
  }

  var requestId = this.nextSnapshotRequestId++;
  var snapshotRequest = new SnapshotVersionRequest(this, requestId, collection, id, version, callback);
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


Connection.prototype.fetchSnapshotByTimestamp = function (collection, id, timestamp, callback) {
  if (typeof timestamp === "function") {
    callback = timestamp;
    timestamp = null;
  }

  var requestId = this.nextSnapshotRequestId++;
  var snapshotRequest = new SnapshotTimestampRequest(this, requestId, collection, id, timestamp, callback);
  this._snapshotRequests[snapshotRequest.requestId] = snapshotRequest;
  snapshotRequest.send();
};

Connection.prototype._handleSnapshotFetch = function (error, message) {
  var snapshotRequest = this._snapshotRequests[message.id];
  if (!snapshotRequest) return;
  delete this._snapshotRequests[message.id];

  snapshotRequest._handleResponse(error, message);
}; // 初始化告诉服务器 客户端已经连上   设置已经连上状态


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
  } // 设置已经连上状态


  this._initialize(message);
}; // 发送{ a: "hs", id: this.id }给服务器


Connection.prototype._initializeHandshake = function () {
  // 发送 消息
  this.send({
    a: "hs",
    id: this.id
  });
}; // 设置已经连上状态 告诉服务器 客户端socket已经连上


Connection.prototype._handleHandshake = function (error, message) {
  if (error) return this.emit("error", error); // 设置已经连上状态

  this._initialize(message);
}; // 设置已经连上状态


Connection.prototype._initialize = function (message) {
  if (this.state !== "connecting") return;

  if (message.protocol !== 1) {
    return this.emit("error", new ShareDBError(ERROR_CODE.ERR_PROTOCOL_VERSION_NOT_SUPPORTED, "Unsupported protocol version: " + message.protocol));
  }

  if (types.map[message.type] !== types.defaultType) {
    return this.emit("error", new ShareDBError(ERROR_CODE.ERR_DEFAULT_TYPE_MISMATCH, message.type + " does not match the server default type"));
  }

  if (typeof message.id !== "string") {
    return this.emit("error", new ShareDBError(ERROR_CODE.ERR_CLIENT_ID_BADLY_FORMED, "Client id must be a string"));
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

  var message = {
    a: action,
    ch: presence.channel,
    seq: seq
  };
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

/***/ }),

/***/ "../modules/sharedb/lib/client/doc.js":
/*!********************************************!*\
  !*** ../modules/sharedb/lib/client/doc.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 发布订阅事件
var emitter = __webpack_require__(/*! ../emitter */ "../modules/sharedb/lib/emitter.js"); // console 中的 ["info", "warn", "error"] 日志方法


var logger = __webpack_require__(/*! ../logger */ "../modules/sharedb/lib/logger/index.js"); //类似 Error 对象的 错误对象


var ShareDBError = __webpack_require__(/*! ../error */ "../modules/sharedb/lib/error.js"); // ot算法插件


var types = __webpack_require__(/*! ../types */ "../modules/sharedb/lib/types.js");

var util = __webpack_require__(/*! ../util */ "../modules/sharedb/lib/util.js");

var clone = util.clone; // 深度比较两个数据是否相同

var deepEqual = __webpack_require__(/*! ../../../fast-deep-equal */ "../modules/fast-deep-equal/index.js");

var ERROR_CODE = ShareDBError.CODES; // console.log("types=", types);

/**
 * A Doc is a client's view on a sharejs document.
 *
 * It is is uniquely identified by its `id` and `collection`.  Documents
 * should not be created directly. Create them with connection.get()
 *
 *
 * Subscriptions
 * -------------
 *
 * We can subscribe a document to stay in sync with the server.
 *   doc.subscribe(function(error) {
 *     doc.subscribed // = true
 *   })
 * The server now sends us all changes concerning this document and these are
 * applied to our data. If the subscription was successful the initial
 * data and version sent by the server are loaded into the document.
 *
 * To stop listening to the changes we call `doc.unsubscribe()`.
 *
 * If we just want to load the data but not stay up-to-date, we call
 *   doc.fetch(function(error) {
 *     doc.data // sent by server
 *   })
 *
 *
 * Events
 * ------
 *
 * You can use doc.on(eventName, callback) to subscribe to the following events:
 * - `before op (op, source)` Fired before a partial operation is applied to the data.
 *   It may be used to read the old data just before applying an operation
 * - `op (op, source)` Fired after every partial operation with this operation as the
 *   first argument
 * - `create (source)` The document was created. That means its type was
 *   set and it has some initial data.
 * - `del (data, source)` Fired after the document is deleted, that is
 *   the data is null. It is passed the data before deletion as an
 *   argument
 * - `load ()` Fired when a new snapshot is ingested from a fetch, subscribe, or query
 */

module.exports = Doc; // 文档构造函数

function Doc( // this, collection, id
connection, // 连接实例
collection, // 文档集合key
id // 文档id
) {
  emitter.EventEmitter.call(this);
  this.connection = connection;
  this.collection = collection;
  this.id = id;
  this.version = null;
  this.type = null;
  this.data = undefined; // Array of callbacks or nulls as placeholders
  //作为占位符的回调数组或空数组

  this.inflightFetch = [];
  this.inflightSubscribe = null;
  this.pendingFetch = [];
  this.pendingSubscribe = []; // Whether we think we are subscribed on the server. Synchronously set to
  // false on calls to unsubscribe and disconnect. Should never be true when
  // this.wantSubscribe is false
  //是否认为我们已经在服务器上订阅了。 同步设置为
  // false用于取消订阅和断开连接。 什么时候不应该是真的
  //这个。 wantSubscribe是假的

  this.subscribed = false; // Whether to re-establish the subscription on reconnect
  //重新连接时是否重新建立订阅

  this.wantSubscribe = false; // The op that is currently roundtripping to the server, or null.
  // When the connection reconnects, the inflight op is resubmitted.
  // This has the same format as an entry in pendingOps
  //当前往返于服务器的op，或null。
  //当连接重新连接时，flight op被重新提交。
  //它的格式与pendingOps中的条目相同

  this.inflightOp = null; // All ops that are waiting for the server to acknowledge this.inflightOp
  // This used to just be a single operation, but creates & deletes can't be
  // composed with regular operations.
  //所有等待服务器确认的操作
  //这曾经只是一个单一的操作，但创建和删除不能
  //由常规操作组成。
  // This is a list of {[create:{...}], [del:true], [op:...], callbacks:[...]}
  // 这是一个列表 {[create:{...}], [del:true], [op:...], callbacks:[...]}

  this.pendingOps = []; // The OT type of this document. An uncreated document has type `null`
  //本文档的OT类型。 未创建的文档类型为' null '

  this.type = null; // The applyStack enables us to track any ops submitted while we are
  // applying an op incrementally. This value is an array when we are
  // performing an incremental apply and null otherwise. When it is an array,
  // all submitted ops should be pushed onto it. The `_otApply` method will
  // reset it back to null when all incremental apply loops are complete.
  // applyStack允许我们跟踪任何提交的操作
  //增量地应用op。 这个值是一个数组
  //执行增量应用，否则为空。 当它是一个数组时，
  //所有提交的操作应该被推到它。 ' _otApply '方法将
  //当所有增量应用循环完成时，将其重置为null。

  this.applyStack = null; // Disable the default behavior of composing submitted ops. This is read at
  // the time of op submit, so it may be toggled on before submitting a
  // specifc op and toggled off afterward
  //关闭提交操作的缺省组合行为。 请参阅
  // op的提交时间，因此它可以在提交a之前被打开
  //指定的操作，并在之后关闭

  this.preventCompose = false; // If set to true, the source will be submitted over the connection. This
  // will also have the side-effect of only composing ops whose sources are
  // equal
  //如果设置为true，源将通过连接提交。 这
  //也会有副作用，只组合的源是
  //平等

  this.submitSource = false; // Prevent own ops being submitted to the server. If subscribed, remote
  // ops are still received. Should be toggled through the pause() and
  // resume() methods to correctly flush on resume.
  //防止自己的操作被提交到服务器。 如果超额认购,远程
  // ops仍然被接收。 应该通过pause()和
  // resume()方法正确刷新简历。

  this.paused = false; // Internal counter that gets incremented every time doc.data is updated.
  // Used as a cheap way to check if doc.data has changed.
  //内部计数器，每次增加doc。 数据更新。
  //作为一种廉价的方法来检查doc。 数据已经改变了。

  this._dataStateVersion = 0;
}

emitter.mixin(Doc); // 销毁文档

Doc.prototype.destroy = function (callback) {
  var doc = this;
  doc.whenNothingPending(function () {
    if (doc.wantSubscribe) {
      doc.unsubscribe(function (err) {
        if (err) {
          if (callback) {
            return callback(err);
          }

          return doc.emit("error", err);
        }

        doc.connection._destroyDoc(doc);

        doc.emit("destroy");

        if (callback) {
          callback();
        }
      });
    } else {
      doc.connection._destroyDoc(doc);

      doc.emit("destroy");

      if (callback) {
        callback();
      }
    }
  });
}; // ****** Manipulating the document data, version and type.
// Set the document's type, and associated properties. Most of the logic in
// this function exists to update the document based on any added & removed API
// methods.
//
// @param newType OT type provided by the ottypes library or its name or uri


Doc.prototype._setType = function (newType) {
  if (typeof newType === "string") {
    newType = types.map[newType];
  }

  if (newType) {
    this.type = newType;
  } else if (newType === null) {
    this.type = newType; // If we removed the type from the object, also remove its data 如果我们从对象中删除了类型，也删除了它的数据

    this._setData(undefined);
  } else {
    var err = new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, "Missing type " + newType);
    return this.emit("error", err);
  }
};

Doc.prototype._setData = function (data) {
  // console.log('data==========',data)
  this.data = data;
  this._dataStateVersion++;
}; // Ingest snapshot data. This data must include a version, snapshot and type.
// This is used both to ingest data that was exported with a webpage and data
// that was received from the server during a fetch.
//
// @param snapshot.v    version
// @param snapshot.data
// @param snapshot.type
// @param callback


Doc.prototype.ingestSnapshot = function (snapshot, callback) {
  if (!snapshot) return callback && callback();

  if (typeof snapshot.v !== "number") {
    var err = new ShareDBError(ERROR_CODE.ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION, "Missing version in ingested snapshot. " + this.collection + "." + this.id);
    if (callback) return callback(err);
    return this.emit("error", err);
  } // If the doc is already created or there are ops pending, we cannot use the
  // ingested snapshot and need ops in order to update the document


  if (this.type || this.hasWritePending()) {
    // The version should only be null on a created document when it was
    // created locally without fetching
    if (this.version == null) {
      if (this.hasWritePending()) {
        // If we have pending ops and we get a snapshot for a locally created
        // document, we have to wait for the pending ops to complete, because
        // we don't know what version to fetch ops from. It is possible that
        // the snapshot came from our local op, but it is also possible that
        // the doc was created remotely (which would conflict and be an error)
        return callback && this.once("no write pending", callback);
      } // Otherwise, we've encounted an error state


      var err = new ShareDBError(ERROR_CODE.ERR_DOC_MISSING_VERSION, "Cannot ingest snapshot in doc with null version. " + this.collection + "." + this.id);
      if (callback) return callback(err);
      return this.emit("error", err);
    } // If we got a snapshot for a version further along than the document is
    // currently, issue a fetch to get the latest ops and catch us up


    if (snapshot.v > this.version) return this.fetch(callback);
    return callback && callback();
  } // Ignore the snapshot if we are already at a newer version. Under no
  // circumstance should we ever set the current version backward


  if (this.version > snapshot.v) return callback && callback();
  this.version = snapshot.v;
  var type = snapshot.type === undefined ? types.defaultType : snapshot.type;

  this._setType(type);

  this._setData(this.type && this.type.deserialize ? this.type.deserialize(snapshot.data) : snapshot.data);

  this.emit("load");
  callback && callback();
};

Doc.prototype.whenNothingPending = function (callback) {
  var doc = this;
  util.nextTick(function () {
    if (doc.hasPending()) {
      doc.once("nothing pending", callback);
      return;
    }

    callback();
  });
};

Doc.prototype.hasPending = function () {
  return !!(this.inflightOp || this.pendingOps.length || this.inflightFetch.length || this.inflightSubscribe || this.pendingFetch.length || this.pendingSubscribe.length);
};

Doc.prototype.hasWritePending = function () {
  return !!(this.inflightOp || this.pendingOps.length);
};

Doc.prototype._emitNothingPending = function () {
  if (this.hasWritePending()) return;
  this.emit("no write pending");
  if (this.hasPending()) return;
  this.emit("nothing pending");
}; // **** Helpers for network messages


Doc.prototype._emitResponseError = function (err, callback) {
  if (err && err.code === ERROR_CODE.ERR_SNAPSHOT_READ_SILENT_REJECTION) {
    this.wantSubscribe = false;

    if (callback) {
      callback();
    }

    this._emitNothingPending();

    return;
  }

  if (callback) {
    callback(err);

    this._emitNothingPending();

    return;
  }

  this._emitNothingPending();

  this.emit("error", err);
};

Doc.prototype._handleFetch = function (error, snapshot) {
  var callbacks = this.pendingFetch;
  this.pendingFetch = [];
  var callback = this.inflightFetch.shift();
  if (callback) callbacks.push(callback);

  if (callbacks.length) {
    callback = function (error) {
      util.callEach(callbacks, error);
    };
  }

  if (error) return this._emitResponseError(error, callback);
  this.ingestSnapshot(snapshot, callback);

  this._emitNothingPending();
};

Doc.prototype._handleSubscribe = function (error, snapshot) {
  var request = this.inflightSubscribe;
  this.inflightSubscribe = null;
  var callbacks = this.pendingFetch;
  this.pendingFetch = [];

  if (request.callback) {
    callbacks.push(request.callback);
  }

  var callback;

  if (callbacks.length) {
    callback = function (error) {
      util.callEach(callbacks, error);
    };
  }

  if (error) {
    return this._emitResponseError(error, callback);
  }

  this.subscribed = request.wantSubscribe;

  if (this.subscribed) {
    this.ingestSnapshot(snapshot, callback);
  } else if (callback) {
    callback();
  }

  this._emitNothingPending();

  this._flushSubscribe();
}; //op 操作 接受服务端 op


Doc.prototype._handleOp = function (err, message) {
  console.log('_handleOp message====', message);

  if (err) {
    if (this.inflightOp) {
      // The server has rejected submission of the current operation. If we get
      // an "Op submit rejected" error, this was done intentionally
      // and we should roll back but not return an error to the user.
      if (err.code === ERROR_CODE.ERR_OP_SUBMIT_REJECTED) err = null;
      return this._rollback(err);
    }

    return this.emit("error", err);
  }

  if (this.inflightOp && message.src === this.inflightOp.src && message.seq === this.inflightOp.seq) {
    // The op has already been applied locally. Just update the version
    // and pending state appropriately
    this._opAcknowledged(message);

    return;
  } // 如果消息版本大于当前版本


  if (this.version == null || message.v > this.version) {
    // This will happen in normal operation if we become subscribed to a
    // new document via a query. It can also happen if we get an op for
    // a future version beyond the version we are expecting next. This
    // could happen if the server doesn't publish an op for whatever reason
    // or because of a race condition. In any case, we can send a fetch
    // command to catch back up.
    //
    // Fetch only sends a new fetch command if no fetches are inflight, which
    // will act as a natural debouncing so we don't send multiple fetch
    // requests for many ops received at once.
    this.fetch();
    return;
  }

  if (message.v < this.version) {
    // We can safely ignore the old (duplicate) operation.
    return;
  }

  if (this.inflightOp) {
    var transformErr = transformX(this.inflightOp, message);
    if (transformErr) return this._hardRollback(transformErr);
  }

  for (var i = 0; i < this.pendingOps.length; i++) {
    var transformErr = transformX(this.pendingOps[i], message);
    if (transformErr) return this._hardRollback(transformErr);
  }

  this.version++;

  try {
    console.log("有op操作 _handleOp");

    this._otApply(message, false);
  } catch (error) {
    return this._hardRollback(error);
  }
}; // Called whenever (you guessed it!) the connection state changes. This will
// happen when we get disconnected & reconnect.
//当(你猜对了!)连接状态改变时调用。这将
//发生在我们断开和重新连接时。


Doc.prototype._onConnectionStateChanged = function () {
  // console.log("this.connection.canSend====", this.connection.canSend);
  // ;
  // 如果已经连上了
  if (this.connection.canSend) {
    this.flush(); // 添加依赖

    this._resubscribe();
  } else {
    if (this.inflightOp) {
      this.pendingOps.unshift(this.inflightOp);
      this.inflightOp = null;
    }

    this.subscribed = false;

    if (this.inflightSubscribe) {
      if (this.inflightSubscribe.wantSubscribe) {
        this.pendingSubscribe.unshift(this.inflightSubscribe);
        this.inflightSubscribe = null;
      } else {
        this._handleSubscribe();
      }
    }

    if (this.inflightFetch.length) {
      this.pendingFetch = this.pendingFetch.concat(this.inflightFetch);
      this.inflightFetch.length = 0;
    }
  }
}; // 监听依赖


Doc.prototype._resubscribe = function () {
  if (!this.pendingSubscribe.length && this.wantSubscribe) {
    return this.subscribe();
  }

  var willFetch = this.pendingSubscribe.some(function (request) {
    return request.wantSubscribe;
  });

  if (!willFetch && this.pendingFetch.length) {
    this.fetch();
  }

  this._flushSubscribe();
}; // Request the current document snapshot or ops that bring us up to date
//请求当前文档快照或最新的操作


Doc.prototype.fetch = function (callback) {
  if (this.connection.canSend) {
    // console.log('sendFetch====')
    var isDuplicate = this.connection.sendFetch(this);
    pushActionCallback(this.inflightFetch, isDuplicate, callback);
    return;
  } // 插入到一个队列中


  this.pendingFetch.push(callback);
}; // Fetch the initial document and keep receiving updates
//获取初始文档并保持接收更新 发送s


Doc.prototype.subscribe = function (callback) {
  var wantSubscribe = true; //查找订阅

  this._queueSubscribe(wantSubscribe, callback);
}; // Unsubscribe. The data will stay around in local memory, but we'll stop
// receiving updates


Doc.prototype.unsubscribe = function (callback) {
  var wantSubscribe = false;

  this._queueSubscribe(wantSubscribe, callback);
}; // 查找订阅


Doc.prototype._queueSubscribe = function (wantSubscribe, callback) {
  var lastRequest = this.pendingSubscribe[this.pendingSubscribe.length - 1] || this.inflightSubscribe;
  var isDuplicateRequest = lastRequest && lastRequest.wantSubscribe === wantSubscribe; // console.log("lastRequest=", lastRequest);
  // console.log("isDuplicateRequest=", isDuplicateRequest);

  if (isDuplicateRequest) {
    lastRequest.callback = combineCallbacks([lastRequest.callback, callback]);
    return;
  }

  this.pendingSubscribe.push({
    wantSubscribe: !!wantSubscribe,
    callback: callback
  }); // 刷新订阅

  this._flushSubscribe();
}; //


Doc.prototype._flushSubscribe = function () {
  if (this.inflightSubscribe || !this.pendingSubscribe.length) return;

  if (this.connection.canSend) {
    this.inflightSubscribe = this.pendingSubscribe.shift();
    this.wantSubscribe = this.inflightSubscribe.wantSubscribe; // console.log("this.inflightSubscribe=", this.inflightSubscribe);
    // console.log("this.wantSubscribe=", this.wantSubscribe);

    if (this.wantSubscribe) {
      // 发送动作  // 把文档注入到this.collections对象中
      // 告诉服务器文档信息
      this.connection.sendSubscribe(this);
    } else {
      // Be conservative about our subscription state. We'll be unsubscribed
      // some time between sending this request, and receiving the callback,
      // so let's just set ourselves to unsubscribed now.
      //对我们的订阅状态保持保守。我们将没订阅
      //在发送请求和接收回调之间的一段时间，
      // 我们设自己为unsubscribed。
      this.subscribed = false;
      this.connection.sendUnsubscribe(this);
    }

    return;
  } // If we're offline, then we're already unsubscribed. Therefore, call back
  // the next request immediately if it's an unsubscribe request.


  if (!this.pendingSubscribe[0].wantSubscribe) {
    this.inflightSubscribe = this.pendingSubscribe.shift();
    var doc = this;
    util.nextTick(function () {
      doc._handleSubscribe();
    });
  }
};

function pushActionCallback(inflight, isDuplicate, callback) {
  if (isDuplicate) {
    var lastCallback = inflight.pop();
    inflight.push(function (err) {
      lastCallback && lastCallback(err);
      callback && callback(err);
    });
  } else {
    inflight.push(callback);
  }
}

function combineCallbacks(callbacks) {
  callbacks = callbacks.filter(util.truthy);
  if (!callbacks.length) return null;
  return function (error) {
    util.callEach(callbacks, error);
  };
} // Operations //
// Send the next pending op to the server, if we can.
//
// Only one operation can be in-flight at a time. If an operation is already on
// its way, or we're not currently connected, this method does nothing.
//操作
//如果可以，发送下一个挂起的操作到服务器。
//每次只能执行一个操作。如果一个操作已经开始
//它的方式，或者我们当前没有连接，这个方法什么都不做。


Doc.prototype.flush = function () {
  // Ignore if we can't send or we are already sending an op //如果我们不能发送或者我们已经在发送一个操作，请忽略
  if (!this.connection.canSend || this.inflightOp) return; // Send first pending op unless paused //发送第一个挂起的操作，除非暂停

  if (!this.paused && this.pendingOps.length) {
    this._sendOp();
  }
}; // Helper function to set op to contain a no-op.


function setNoOp(op) {
  delete op.op;
  delete op.create;
  delete op.del;
} // Transform server op data by a client op, and vice versa. Ops are edited in place.


function transformX(client, server) {
  // Order of statements in this function matters. Be especially careful if
  // refactoring this function
  // A client delete op should dominate if both the server and the client
  // delete the document. Thus, any ops following the client delete (such as a
  // subsequent create) will be maintained, since the server op is transformed
  // to a no-op
  if (client.del) return setNoOp(server);

  if (server.del) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_WAS_DELETED, "Document was deleted");
  }

  if (server.create) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already created");
  } // Ignore no-op coming from server


  if (!("op" in server)) return; // I believe that this should not occur, but check just in case

  if (client.create) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already created");
  } // They both edited the document. This is the normal case for this function -
  // as in, most of the time we'll end up down here.
  //
  // You should be wondering why I'm using client.type instead of this.type.
  // The reason is, if we get ops at an old version of the document, this.type
  // might be undefined or a totally different type. By pinning the type to the
  // op data, we make sure the right type has its transform function called.


  if (client.type.transformX) {
    var result = client.type.transformX(client.op, server.op);
    client.op = result[0];
    server.op = result[1];
  } else {
    var clientOp = client.type.transform(client.op, server.op, "left");
    var serverOp = client.type.transform(server.op, client.op, "right");
    client.op = clientOp;
    server.op = serverOp;
  }
}
/**
 * Applies the operation to the snapshot
 *
 * If the operation is create or delete it emits `create` or `del`. Then the
 * operation is applied to the snapshot and `op` and `after op` are emitted.
 * If the type supports incremental updates and `this.incremental` is true we
 * fire `op` after every small operation.
 *
 * This is the only function to fire the above mentioned events.
 *
 * @private
 */
// 合并op


Doc.prototype._otApply = function (op, source) {
  if ("op" in op) {
    if (!this.type) {
      // Throw here, because all usage of _otApply should be wrapped with a try/catch
      throw new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Cannot apply op to uncreated document. " + this.collection + "." + this.id);
    } // NB: If we need to add another argument to this event, we should consider
    // the fact that the 'op' event has op.src as its 3rd argument
    //注:如果我们需要添加另一个参数到这个事件，我们应该考虑
    // 'op'事件的第3个参数是op.src


    this.emit("before op batch", op.op, source); // Iteratively apply multi-component remote operations and rollback ops
    // (source === false) for the default JSON0 OT type. It could use
    // type.shatter(), but since this code is so specific to use cases for the
    // JSON0 type and ShareDB explicitly bundles the default type, we might as
    // well write it this way and save needing to iterate through the op
    // components twice.
    //
    // Ideally, we would not need this extra complexity. However, it is
    // helpful for implementing bindings that update DOM nodes and other
    // stateful objects by translating op events directly into corresponding
    // mutations. Such bindings are most easily written as responding to
    // individual op components one at a time in order, and it is important
    // that the snapshot only include updates from the particular op component
    // at the time of emission. Eliminating this would require rethinking how
    // such external bindings are implemented.
    //迭代应用多组件远程操作和回滚操作
    // (source === = false)用于默认JSON0 OT类型。它可以使用
    // type.shatter()，但由于这段代码是如此特定于
    // JSON0类型和ShareDB显式绑定默认类型，我们可以
    //我们将这样写，并保存需要遍历操作
    //组件的两倍。
    //理想情况下，我们不需要这种额外的复杂性。然而,它是
    //帮助实现更新DOM节点和其他的绑定
    //通过将op事件直接转换为相应的有状态对象
    //突变。这样的绑定最容易编写为响应
    //每次一个单独的op组件，它是重要的
    //快照只包含来自特定op组件的更新
    //在发射时。要消除这种情况，就需要重新思考如何去做
    //这样的外部绑定被实现。

    if (!source && this.type === types.defaultType && op.op.length > 1) {
      if (!this.applyStack) {
        this.applyStack = [];
      }

      var stackLength = this.applyStack.length;

      for (var i = 0; i < op.op.length; i++) {
        var component = op.op[i];
        var componentOp = {
          op: [component]
        }; // Apply the individual op component

        this.emit("before op", componentOp.op, source, op.src); // Transform componentOp against any ops that have been submitted
        // sychronously inside of an op event handler since we began apply of
        // our operation

        for (var j = stackLength; j < this.applyStack.length; j++) {
          var transformErr = transformX(this.applyStack[j], componentOp);
          if (transformErr) return this._hardRollback(transformErr);
        } // console.log('this.data=========',this.data)
        // console.log('componentOp.op=========',componentOp.op)
        // console.log('this.type.apply(this.data, componentOp.op)=========',this.type.apply(this.data, componentOp.op))
        // ot 算法合并


        console.log('this.data==', this.data);
        console.log('componentOp.op==', componentOp.op);

        this._setData(this.type.apply(this.data, componentOp.op)); //发布


        this.emit("op", componentOp.op, source, op.src);
      }

      this.emit("op batch", op.op, source); // Pop whatever was submitted since we started applying this op

      this._popApplyStack(stackLength);

      return;
    } // The 'before op' event enables clients to pull any necessary data out of
    // the snapshot before it gets changed


    this.emit("before op", op.op, source, op.src); // Apply the operation to the local data, mutating it in place

    console.log("this.type.apply"); // ot 算法合并 

    console.log('this.data==', this.data);
    console.log('op.op==', op.op);

    this._setData(this.type.apply(this.data, op.op)); // Emit an 'op' event once the local data includes the changes from the
    // op. For locally submitted ops, this will be synchronously with
    // submission and before the server or other clients have received the op.
    // For ops from other clients, this will be after the op has been
    // committed to the database and published


    this.emit("op", op.op, source, op.src);
    this.emit("op batch", op.op, source);
    return;
  }

  if (op.create) {
    this._setType(op.create.type);

    if (this.type.deserialize) {
      if (this.type.createDeserialized) {
        this._setData(this.type.createDeserialized(op.create.data));
      } else {
        this._setData(this.type.deserialize(this.type.create(op.create.data)));
      }
    } else {
      this._setData(this.type.create(op.create.data));
    }

    this.emit("create", source);
    return;
  }

  if (op.del) {
    var oldData = this.data;

    this._setType(null);

    this.emit("del", oldData, source);
    return;
  }
}; // ***** Sending operations
// Actually send op to the server.


Doc.prototype._sendOp = function () {
  if (!this.connection.canSend) return;
  var src = this.connection.id; // When there is no inflightOp, send the first item in pendingOps. If
  // there is inflightOp, try sending it again

  if (!this.inflightOp) {
    // Send first pending op
    this.inflightOp = this.pendingOps.shift();
  }

  var op = this.inflightOp;

  if (!op) {
    var err = new ShareDBError(ERROR_CODE.ERR_INFLIGHT_OP_MISSING, "No op to send on call to _sendOp");
    return this.emit("error", err);
  } // Track data for retrying ops


  op.sentAt = Date.now();
  op.retries = op.retries == null ? 0 : op.retries + 1; // The src + seq number is a unique ID representing this operation. This tuple
  // is used on the server to detect when ops have been sent multiple times and
  // on the client to match acknowledgement of an op back to the inflightOp.
  // Note that the src could be different from this.connection.id after a
  // reconnect, since an op may still be pending after the reconnection and
  // this.connection.id will change. In case an op is sent multiple times, we
  // also need to be careful not to override the original seq value.

  if (op.seq == null) {
    if (this.connection.seq >= util.MAX_SAFE_INTEGER) {
      return this.emit("error", new ShareDBError(ERROR_CODE.ERR_CONNECTION_SEQ_INTEGER_OVERFLOW, "Connection seq has exceeded the max safe integer, maybe from being open for too long"));
    }

    op.seq = this.connection.seq++;
  } // console.log("op========");
  // 发送op给服务器


  this.connection.sendOp(this, op); // src isn't needed on the first try, since the server session will have the
  // same id, but it must be set on the inflightOp in case it is sent again
  // after a reconnect and the connection's id has changed by then

  if (op.src == null) op.src = src;
}; // Queues the operation for submission to the server and applies it locally.
// Internal method called to do the actual work for submit(), create() and del().
//将提交到服务器的操作队列化，并在本地应用。
//为submit()， create()和del()调用的内部方法。
// @private
// @param op
// @param [op.op]
// @param [op.del]
// @param [op.create]
// @param [callback] called when operation is submitted
// 提交


Doc.prototype._submit = function (op, //op操作
source, //source: StringBinding 实例对象
callback // 回调函数
) {
  // Locally submitted ops must always have a truthy source
  if (!source) {
    source = true;
  } // The op contains either op, create, delete, or none of the above (a no-op).


  if ("op" in op) {
    if (!this.type) {
      var err = new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Cannot submit op. Document has not been created. " + this.collection + "." + this.id);

      if (callback) {
        return callback(err);
      }

      return this.emit("error", err);
    } // Try to normalize the op. This removes trailing skip:0's and things like that.
    // 调用type 方法


    console.log("this.type=================", this.type);

    if (this.type.normalize) {
      op.op = this.type.normalize(op.op);
    }
  }

  try {
    this._pushOp(op, //op操作
    source, //source: StringBinding 实例对象
    callback // 回调函数
    ); // console.log('提交 _submit')
    //


    this._otApply(op, //op操作
    source //source: StringBinding 实例对象
    );
  } catch (error) {
    return this._hardRollback(error);
  } // The call to flush is delayed so if submit() is called multiple times
  // synchronously, all the ops are combined before being sent to the server.


  var doc = this;
  util.nextTick(function () {
    // 发送op给服务器
    doc.flush();
  });
}; // 把op插入到 this.pendingOps 队列中


Doc.prototype._pushOp = function (op, // op
source, //source: StringBinding 实例对象
callback) {
  op.source = source; // console.log("this.applyStack=", this.applyStack);

  if (this.applyStack) {
    // If we are in the process of incrementally applying an operation, don't
    // compose the op and push it onto the applyStack so it can be transformed
    // against other components from the op or ops being applied
    //如果我们在增量应用一个操作的过程中，不要
    //组合op并将其推到applyStack中，这样它就可以被转换
    //对其他组件的操作或操作应用
    this.applyStack.push(op);
  } else {
    // If the type supports composes, try to compose the operation onto the
    // end of the last pending operation.
    //如果该类型支持组合操作，则尝试将操作组合到
    //最后一个挂起的操作结束。
    var composed = this._tryCompose(op);

    if (composed) {
      composed.callbacks.push(callback);
      return;
    }
  } // Push on to the pendingOps queue of ops to submit if we didn't compose


  op.type = this.type;
  op.callbacks = [callback]; // 插入到一个队列中

  this.pendingOps.push(op); // console.log("this.pendingOps=", this.pendingOps);
};

Doc.prototype._popApplyStack = function (to) {
  if (to > 0) {
    this.applyStack.length = to;
    return;
  } // Once we have completed the outermost apply loop, reset to null and no
  // longer add ops to the applyStack as they are submitted


  var op = this.applyStack[0];
  this.applyStack = null;
  if (!op) return; // Compose the ops added since the beginning of the apply stack, since we
  // had to skip compose when they were originally pushed

  var i = this.pendingOps.indexOf(op);
  if (i === -1) return;
  var ops = this.pendingOps.splice(i);

  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];

    var composed = this._tryCompose(op);

    if (composed) {
      composed.callbacks = composed.callbacks.concat(op.callbacks);
    } else {
      this.pendingOps.push(op);
    }
  }
}; // Try to compose a submitted op into the last pending op. Returns the
// composed op if it succeeds, undefined otherwise
//尝试将提交的操作组合到最后一个挂起的操作中
//如果成功则为composed op，否则为undefined


Doc.prototype._tryCompose = function (op) {
  // console.log("this.preventCompose=", this.preventCompose);
  if (this.preventCompose) {
    return;
  } // We can only compose into the last pending op. Inflight ops have already
  // been sent to the server, so we can't modify them
  //我们只能写入最后一个未完成的任务，而飞行任务已经完成
  //已经发送到服务器，所以我们不能修改它们


  var last = this.pendingOps[this.pendingOps.length - 1]; // console.log("last============", last);
  // console.log("this.pendingOps=======", this.pendingOps);

  if (!last || last.sentAt) {
    return;
  } // If we're submitting the op source, we can only combine ops that have
  // a matching source
  //如果提交的是op source，则只能组合具有
  //匹配源
  // console.log("this.submitSource=", this.submitSource);


  if (this.submitSource && !deepEqual(op.source, last.source)) {
    return;
  } // Compose an op into a create by applying it. This effectively makes the op
  // invisible, as if the document were created including the op originally


  if (last.create && "op" in op) {
    console.log("last.create");
    console.log('last.create.data==', last.create.data);
    console.log('op.op==', op.op);
    last.create.data = this.type.apply(last.create.data, op.op);
    return last;
  } // Compose two ops into a single op if supported by the type. Types that
  // support compose must be able to compose any two ops together


  if ("op" in last && "op" in op && this.type.compose) {
    last.op = this.type.compose(last.op, op.op);
    return last;
  }
}; // *** Client OT entrypoints.
// Submit an operation to the document.
//
// @param operation handled by the OT type
// @param options  {source: ...}
// @param [callback] called after operation submitted
//客户端OT入口点。
// @fires before op, op, after op


Doc.prototype.submitOp = function (component, // op
options, //    { source: StringBinding 实例对象 }
callback) {
  // console.log("component=", component);
  // console.log("options=", options);
  // console.log("callback=", callback);
  if (typeof options === "function") {
    callback = options;
    options = null;
  }

  var op = {
    op: component
  }; // 只要 source

  var source = options && options.source; // 提交op

  this._submit(op, // 操作op
  source, //source: StringBinding 实例对象
  callback // 回调函数 空
  );
}; // Create the document, which in ShareJS semantics means to set its type. Every
// object implicitly exists in the database but has no data and no type. Create
// sets the type of the object and can optionally set some initial data on the
// object, depending on the type.
//
// @param data  initial
// @param type  OT type
// @param options  {source: ...}
// @param callback  called when operation submitted


Doc.prototype.create = function (data, type, options, callback) {
  if (typeof type === "function") {
    callback = type;
    options = null;
    type = null;
  } else if (typeof options === "function") {
    callback = options;
    options = null;
  }

  if (!type) {
    type = types.defaultType.uri;
  }

  if (this.type) {
    var err = new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already exists");
    if (callback) return callback(err);
    return this.emit("error", err);
  }

  var op = {
    create: {
      type: type,
      data: data
    }
  };
  var source = options && options.source;

  this._submit(op, source, callback);
}; // Delete the document. This creates and submits a delete operation to the
// server. Deleting resets the object's type to null and deletes its data. The
// document still exists, and still has the version it used to have before you
// deleted it (well, old version +1).
//
// @param options  {source: ...}
// @param callback  called when operation submitted


Doc.prototype.del = function (options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }

  if (!this.type) {
    var err = new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Document does not exist");
    if (callback) return callback(err);
    return this.emit("error", err);
  }

  var op = {
    del: true
  };
  var source = options && options.source;

  this._submit(op, source, callback);
}; // Stops the document from sending any operations to the server.


Doc.prototype.pause = function () {
  this.paused = true;
}; // Continue sending operations to the server


Doc.prototype.resume = function () {
  this.paused = false;
  this.flush();
}; // Create a snapshot that can be serialized, deserialized, and passed into `Doc.ingestSnapshot`.


Doc.prototype.toSnapshot = function () {
  return {
    v: this.version,
    data: clone(this.data),
    type: this.type.uri
  };
}; // *** Receiving operations
// This is called when the server acknowledges an operation from the client.


Doc.prototype._opAcknowledged = function (message) {
  if (this.inflightOp.create) {
    this.version = message.v;
  } else if (message.v !== this.version) {
    // We should already be at the same version, because the server should
    // have sent all the ops that have happened before acknowledging our op
    logger.warn("Invalid version from server. Expected: " + this.version + " Received: " + message.v, message); // Fetching should get us back to a working document state

    return this.fetch();
  } // The op was committed successfully. Increment the version number


  this.version++;

  this._clearInflightOp();
};

Doc.prototype._rollback = function (err) {
  // The server has rejected submission of the current operation. Invert by
  // just the inflight op if possible. If not possible to invert, cancel all
  // pending ops and fetch the latest from the server to get us back into a
  // working state, then call back
  var op = this.inflightOp;

  if ("op" in op && op.type.invert) {
    try {
      op.op = op.type.invert(op.op);
    } catch (error) {
      // If the op doesn't support `.invert()`, we just reload the doc
      // instead of trying to locally revert it.
      return this._hardRollback(err);
    } // Transform the undo operation by any pending ops.


    for (var i = 0; i < this.pendingOps.length; i++) {
      var transformErr = transformX(this.pendingOps[i], op);
      if (transformErr) return this._hardRollback(transformErr);
    } // ... and apply it locally, reverting the changes.
    //
    // This operation is applied to look like it comes from a remote source.
    // I'm still not 100% sure about this functionality, because its really a
    // local op. Basically, the problem is that if the client's op is rejected
    // by the server, the editor window should update to reflect the undo.


    try {
      this._otApply(op, false);
    } catch (error) {
      return this._hardRollback(error);
    }

    this._clearInflightOp(err);

    return;
  }

  this._hardRollback(err);
};

Doc.prototype._hardRollback = function (err) {
  // Store pending ops so that we can notify their callbacks of the error.
  // We combine the inflight op and the pending ops, because it's possible
  // to hit a condition where we have no inflight op, but we do have pending
  // ops. This can happen when an invalid op is submitted, which causes us
  // to hard rollback before the pending op was flushed.
  var pendingOps = [];
  if (this.inflightOp) pendingOps.push(this.inflightOp);
  pendingOps = pendingOps.concat(this.pendingOps); // Cancel all pending ops and reset if we can't invert

  this._setType(null);

  this.version = null;
  this.inflightOp = null;
  this.pendingOps = []; // Fetch the latest version from the server to get us back into a working state

  var doc = this;
  this.fetch(function () {
    // We want to check that no errors are swallowed, so we check that:
    // - there are callbacks to call, and
    // - that every single pending op called a callback
    // If there are no ops queued, or one of them didn't handle the error,
    // then we emit the error.
    var allOpsHadCallbacks = !!pendingOps.length;

    for (var i = 0; i < pendingOps.length; i++) {
      allOpsHadCallbacks = util.callEach(pendingOps[i].callbacks, err) && allOpsHadCallbacks;
    }

    if (err && !allOpsHadCallbacks) return doc.emit("error", err);
  });
};

Doc.prototype._clearInflightOp = function (err) {
  var inflightOp = this.inflightOp;
  this.inflightOp = null;
  var called = util.callEach(inflightOp.callbacks, err);
  this.flush();

  this._emitNothingPending();

  if (err && !called) return this.emit("error", err);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/index.js":
/*!**********************************************!*\
  !*** ../modules/sharedb/lib/client/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:29:21
 * @FilePath: /sharedb/examples/modules/sharedb/lib/client/index.js
 * @Description: 
 */
// 连接
exports.Connection = __webpack_require__(/*! ./connection */ "../modules/sharedb/lib/client/connection.js"); // 文档

exports.Doc = __webpack_require__(/*! ./doc */ "../modules/sharedb/lib/client/doc.js"); // 错误

exports.Error = __webpack_require__(/*! ../error */ "../modules/sharedb/lib/error.js"); // 查询

exports.Query = __webpack_require__(/*! ./query */ "../modules/sharedb/lib/client/query.js"); // 类型

exports.types = __webpack_require__(/*! ../types */ "../modules/sharedb/lib/types.js"); // 日志

exports.logger = __webpack_require__(/*! ../logger */ "../modules/sharedb/lib/logger/index.js");

/***/ }),

/***/ "../modules/sharedb/lib/client/presence/doc-presence.js":
/*!**************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/doc-presence.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Presence = __webpack_require__(/*! ./presence */ "../modules/sharedb/lib/client/presence/presence.js");

var LocalDocPresence = __webpack_require__(/*! ./local-doc-presence */ "../modules/sharedb/lib/client/presence/local-doc-presence.js");

var RemoteDocPresence = __webpack_require__(/*! ./remote-doc-presence */ "../modules/sharedb/lib/client/presence/remote-doc-presence.js");

function DocPresence(connection, collection, id) {
  var channel = DocPresence.channel(collection, id);
  Presence.call(this, connection, channel);
  this.collection = collection;
  this.id = id;
}

module.exports = DocPresence;
DocPresence.prototype = Object.create(Presence.prototype);

DocPresence.channel = function (collection, id) {
  return collection + '.' + id;
};

DocPresence.prototype._createLocalPresence = function (id) {
  return new LocalDocPresence(this, id);
};

DocPresence.prototype._createRemotePresence = function (id) {
  return new RemoteDocPresence(this, id);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/presence/local-doc-presence.js":
/*!********************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/local-doc-presence.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var LocalPresence = __webpack_require__(/*! ./local-presence */ "../modules/sharedb/lib/client/presence/local-presence.js");

var ShareDBError = __webpack_require__(/*! ../../error */ "../modules/sharedb/lib/error.js");

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");

var ERROR_CODE = ShareDBError.CODES;
module.exports = LocalDocPresence;

function LocalDocPresence(presence, presenceId) {
  LocalPresence.call(this, presence, presenceId);
  this.collection = this.presence.collection;
  this.id = this.presence.id;
  this._doc = this.connection.get(this.collection, this.id);
  this._isSending = false;
  this._docDataVersionByPresenceVersion = {};
  this._opHandler = this._transformAgainstOp.bind(this);
  this._createOrDelHandler = this._handleCreateOrDel.bind(this);
  this._loadHandler = this._handleLoad.bind(this);
  this._destroyHandler = this.destroy.bind(this);

  this._registerWithDoc();
}

LocalDocPresence.prototype = Object.create(LocalPresence.prototype);

LocalDocPresence.prototype.submit = function (value, callback) {
  if (!this._doc.type) {
    // If the Doc hasn't been created, we already assume all presence to
    // be null. Let's early return, instead of error since this is a harmless
    // no-op
    if (value === null) return this._callbackOrEmit(null, callback);
    var error = {
      code: ERROR_CODE.ERR_DOC_DOES_NOT_EXIST,
      message: 'Cannot submit presence. Document has not been created'
    };
    return this._callbackOrEmit(error, callback);
  }

  ; // Record the current data state version to check if we need to transform
  // the presence later

  this._docDataVersionByPresenceVersion[this.presenceVersion] = this._doc._dataStateVersion;
  LocalPresence.prototype.submit.call(this, value, callback);
};

LocalDocPresence.prototype.destroy = function (callback) {
  this._doc.removeListener('op', this._opHandler);

  this._doc.removeListener('create', this._createOrDelHandler);

  this._doc.removeListener('del', this._createOrDelHandler);

  this._doc.removeListener('load', this._loadHandler);

  this._doc.removeListener('destroy', this._destroyHandler);

  LocalPresence.prototype.destroy.call(this, callback);
};

LocalDocPresence.prototype._sendPending = function () {
  if (this._isSending) return;
  this._isSending = true;
  var presence = this;

  this._doc.whenNothingPending(function () {
    presence._isSending = false;
    if (!presence.connection.canSend) return;

    presence._pendingMessages.forEach(function (message) {
      message.t = presence._doc.type.uri;
      message.v = presence._doc.version;
      presence.connection.send(message);
    });

    presence._pendingMessages = [];
    presence._docDataVersionByPresenceVersion = {};
  });
};

LocalDocPresence.prototype._registerWithDoc = function () {
  this._doc.on('op', this._opHandler);

  this._doc.on('create', this._createOrDelHandler);

  this._doc.on('del', this._createOrDelHandler);

  this._doc.on('load', this._loadHandler);

  this._doc.on('destroy', this._destroyHandler);
};

LocalDocPresence.prototype._transformAgainstOp = function (op, source) {
  var presence = this;
  var docDataVersion = this._doc._dataStateVersion;

  this._pendingMessages.forEach(function (message) {
    // Check if the presence needs transforming against the op - this is to check against
    // edge cases where presence is submitted from an 'op' event
    var messageDocDataVersion = presence._docDataVersionByPresenceVersion[message.pv];
    if (messageDocDataVersion >= docDataVersion) return;

    try {
      message.p = presence._transformPresence(message.p, op, source); // Ensure the presence's data version is kept consistent to deal with "deep" op
      // submissions

      presence._docDataVersionByPresenceVersion[message.pv] = docDataVersion;
    } catch (error) {
      var callback = presence._getCallback(message.pv);

      presence._callbackOrEmit(error, callback);
    }
  });

  try {
    this.value = this._transformPresence(this.value, op, source);
  } catch (error) {
    this.emit('error', error);
  }
};

LocalDocPresence.prototype._handleCreateOrDel = function () {
  this._pendingMessages.forEach(function (message) {
    message.p = null;
  });

  this.value = null;
};

LocalDocPresence.prototype._handleLoad = function () {
  this.value = null;
  this._pendingMessages = [];
  this._docDataVersionByPresenceVersion = {};
};

LocalDocPresence.prototype._message = function () {
  var message = LocalPresence.prototype._message.call(this);

  message.c = this.collection, message.d = this.id, message.v = null;
  message.t = null;
  return message;
};

LocalDocPresence.prototype._transformPresence = function (value, op, source) {
  var type = this._doc.type;

  if (!util.supportsPresence(type)) {
    throw new ShareDBError(ERROR_CODE.ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE, 'Type does not support presence: ' + type.name);
  }

  return type.transformPresence(value, op, source);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/presence/local-presence.js":
/*!****************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/local-presence.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../../emitter */ "../modules/sharedb/lib/emitter.js");

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");

module.exports = LocalPresence;

function LocalPresence(presence, presenceId) {
  emitter.EventEmitter.call(this);

  if (!presenceId || typeof presenceId !== 'string') {
    throw new Error('LocalPresence presenceId must be a string');
  }

  this.presence = presence;
  this.presenceId = presenceId;
  this.connection = presence.connection;
  this.presenceVersion = 0;
  this.value = null;
  this._pendingMessages = [];
  this._callbacksByPresenceVersion = {};
}

emitter.mixin(LocalPresence);

LocalPresence.prototype.submit = function (value, callback) {
  this.value = value;
  this.send(callback);
};

LocalPresence.prototype.send = function (callback) {
  var message = this._message();

  this._pendingMessages.push(message);

  this._callbacksByPresenceVersion[message.pv] = callback;

  this._sendPending();
};

LocalPresence.prototype.destroy = function (callback) {
  var presence = this;
  this.submit(null, function (error) {
    if (error) return presence._callbackOrEmit(error, callback);
    delete presence.presence.localPresences[presence.presenceId];
    if (callback) callback();
  });
};

LocalPresence.prototype._sendPending = function () {
  if (!this.connection.canSend) return;
  var presence = this;

  this._pendingMessages.forEach(function (message) {
    presence.connection.send(message);
  });

  this._pendingMessages = [];
};

LocalPresence.prototype._ack = function (error, presenceVersion) {
  var callback = this._getCallback(presenceVersion);

  this._callbackOrEmit(error, callback);
};

LocalPresence.prototype._message = function () {
  return {
    a: 'p',
    ch: this.presence.channel,
    id: this.presenceId,
    p: this.value,
    pv: this.presenceVersion++
  };
};

LocalPresence.prototype._getCallback = function (presenceVersion) {
  var callback = this._callbacksByPresenceVersion[presenceVersion];
  delete this._callbacksByPresenceVersion[presenceVersion];
  return callback;
};

LocalPresence.prototype._callbackOrEmit = function (error, callback) {
  if (callback) return util.nextTick(callback, error);
  if (error) this.emit('error', error);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/presence/presence.js":
/*!**********************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/presence.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../../emitter */ "../modules/sharedb/lib/emitter.js");

var LocalPresence = __webpack_require__(/*! ./local-presence */ "../modules/sharedb/lib/client/presence/local-presence.js");

var RemotePresence = __webpack_require__(/*! ./remote-presence */ "../modules/sharedb/lib/client/presence/remote-presence.js");

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");

var async = __webpack_require__(/*! ../../../../async */ "../modules/async/dist/async.mjs");

var hat = __webpack_require__(/*! ../../../../hat */ "../modules/hat/index.js");

module.exports = Presence;

function Presence(connection, channel) {
  emitter.EventEmitter.call(this);

  if (!channel || typeof channel !== "string") {
    throw new Error("Presence channel must be provided");
  }

  this.connection = connection;
  this.channel = channel;
  this.wantSubscribe = false;
  this.subscribed = false;
  this.remotePresences = {};
  this.localPresences = {};
  this._remotePresenceInstances = {};
  this._subscriptionCallbacksBySeq = {};
}

emitter.mixin(Presence);

Presence.prototype.subscribe = function (callback) {
  this._sendSubscriptionAction(true, callback);
};

Presence.prototype.unsubscribe = function (callback) {
  this._sendSubscriptionAction(false, callback);
};

Presence.prototype.create = function (id) {
  id = id || hat();

  var localPresence = this._createLocalPresence(id);

  this.localPresences[id] = localPresence;
  return localPresence;
};

Presence.prototype.destroy = function (callback) {
  var presence = this;
  this.unsubscribe(function (error) {
    if (error) return presence._callbackOrEmit(error, callback);
    var localIds = Object.keys(presence.localPresences);
    var remoteIds = Object.keys(presence._remotePresenceInstances);
    async.parallel([function (next) {
      async.each(localIds, function (presenceId, next) {
        presence.localPresences[presenceId].destroy(next);
      }, next);
    }, function (next) {
      async.each(remoteIds, function (presenceId, next) {
        presence._remotePresenceInstances[presenceId].destroy(next);
      }, next);
    }], function (error) {
      delete presence.connection._presences[presence.channel];

      presence._callbackOrEmit(error, callback);
    });
  });
};

Presence.prototype._sendSubscriptionAction = function (wantSubscribe, callback) {
  this.wantSubscribe = !!wantSubscribe;
  var action = this.wantSubscribe ? "ps" : "pu";
  var seq = this.connection._presenceSeq++;
  this._subscriptionCallbacksBySeq[seq] = callback;

  if (this.connection.canSend) {
    this.connection._sendPresenceAction(action, seq, this);
  }
};

Presence.prototype._handleSubscribe = function (error, seq) {
  if (this.wantSubscribe) this.subscribed = true;

  var callback = this._subscriptionCallback(seq);

  this._callbackOrEmit(error, callback);
};

Presence.prototype._handleUnsubscribe = function (error, seq) {
  this.subscribed = false;

  var callback = this._subscriptionCallback(seq);

  this._callbackOrEmit(error, callback);
};

Presence.prototype._receiveUpdate = function (error, message) {
  var localPresence = util.dig(this.localPresences, message.id);
  if (localPresence) return localPresence._ack(error, message.pv);
  if (error) return this.emit("error", error);
  var presence = this;
  var remotePresence = util.digOrCreate(this._remotePresenceInstances, message.id, function () {
    return presence._createRemotePresence(message.id);
  });
  remotePresence.receiveUpdate(message);
};

Presence.prototype._updateRemotePresence = function (remotePresence) {
  this.remotePresences[remotePresence.presenceId] = remotePresence.value;
  if (remotePresence.value === null) this._removeRemotePresence(remotePresence.presenceId);
  this.emit("receive", remotePresence.presenceId, remotePresence.value);
};

Presence.prototype._broadcastAllLocalPresence = function (error) {
  if (error) return this.emit("error", error);

  for (var id in this.localPresences) {
    var localPresence = this.localPresences[id];
    if (localPresence.value !== null) localPresence.send();
  }
};

Presence.prototype._removeRemotePresence = function (id) {
  this._remotePresenceInstances[id].destroy();

  delete this._remotePresenceInstances[id];
  delete this.remotePresences[id];
};

Presence.prototype._onConnectionStateChanged = function () {
  if (!this.connection.canSend) return;

  this._resubscribe();

  for (var id in this.localPresences) {
    this.localPresences[id]._sendPending();
  }
};

Presence.prototype._resubscribe = function () {
  var callbacks = [];

  for (var seq in this._subscriptionCallbacksBySeq) {
    var callback = this._subscriptionCallback(seq);

    callbacks.push(callback);
  }

  if (!this.wantSubscribe) return this._callEachOrEmit(callbacks);
  var presence = this;
  this.subscribe(function (error) {
    presence._callEachOrEmit(callbacks, error);
  });
};

Presence.prototype._subscriptionCallback = function (seq) {
  var callback = this._subscriptionCallbacksBySeq[seq];
  delete this._subscriptionCallbacksBySeq[seq];
  return callback;
};

Presence.prototype._callbackOrEmit = function (error, callback) {
  if (callback) return util.nextTick(callback, error);
  if (error) this.emit("error", error);
};

Presence.prototype._createLocalPresence = function (id) {
  return new LocalPresence(this, id);
};

Presence.prototype._createRemotePresence = function (id) {
  return new RemotePresence(this, id);
};

Presence.prototype._callEachOrEmit = function (callbacks, error) {
  var called = util.callEach(callbacks, error);
  if (!called && error) this.emit("error", error);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/presence/remote-doc-presence.js":
/*!*********************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/remote-doc-presence.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var RemotePresence = __webpack_require__(/*! ./remote-presence */ "../modules/sharedb/lib/client/presence/remote-presence.js");

var ot = __webpack_require__(/*! ../../ot */ "../modules/sharedb/lib/ot.js");

module.exports = RemoteDocPresence;

function RemoteDocPresence(presence, presenceId) {
  RemotePresence.call(this, presence, presenceId);
  this.collection = this.presence.collection;
  this.id = this.presence.id;
  this.src = null;
  this.presenceVersion = null;
  this._doc = this.connection.get(this.collection, this.id);
  this._pending = null;
  this._opCache = null;
  this._pendingSetPending = false;
  this._opHandler = this._handleOp.bind(this);
  this._createDelHandler = this._handleCreateDel.bind(this);
  this._loadHandler = this._handleLoad.bind(this);

  this._registerWithDoc();
}

RemoteDocPresence.prototype = Object.create(RemotePresence.prototype);

RemoteDocPresence.prototype.receiveUpdate = function (message) {
  if (this._pending && message.pv < this._pending.pv) return;
  this.src = message.src;
  this._pending = message;

  this._setPendingPresence();
};

RemoteDocPresence.prototype.destroy = function (callback) {
  this._doc.removeListener('op', this._opHandler);

  this._doc.removeListener('create', this._createDelHandler);

  this._doc.removeListener('del', this._createDelHandler);

  this._doc.removeListener('load', this._loadHandler);

  RemotePresence.prototype.destroy.call(this, callback);
};

RemoteDocPresence.prototype._registerWithDoc = function () {
  this._doc.on('op', this._opHandler);

  this._doc.on('create', this._createDelHandler);

  this._doc.on('del', this._createDelHandler);

  this._doc.on('load', this._loadHandler);
};

RemoteDocPresence.prototype._setPendingPresence = function () {
  if (this._pendingSetPending) return;
  this._pendingSetPending = true;
  var presence = this;

  this._doc.whenNothingPending(function () {
    presence._pendingSetPending = false;
    if (!presence._pending) return;
    if (presence._pending.pv < presence.presenceVersion) return presence._pending = null;

    if (presence._pending.v > presence._doc.version) {
      return presence._doc.fetch();
    }

    if (!presence._catchUpStalePresence()) return;
    presence.value = presence._pending.p;
    presence.presenceVersion = presence._pending.pv;
    presence._pending = null;

    presence.presence._updateRemotePresence(presence);
  });
};

RemoteDocPresence.prototype._handleOp = function (op, source, connectionId) {
  var isOwnOp = connectionId === this.src;

  this._transformAgainstOp(op, isOwnOp);

  this._cacheOp(op, isOwnOp);

  this._setPendingPresence();
};

RemotePresence.prototype._handleCreateDel = function () {
  this._cacheOp(null);

  this._setPendingPresence();
};

RemotePresence.prototype._handleLoad = function () {
  this.value = null;
  this._pending = null;
  this._opCache = null;

  this.presence._updateRemotePresence(this);
};

RemoteDocPresence.prototype._transformAgainstOp = function (op, isOwnOp) {
  if (!this.value) return;

  try {
    this.value = this._doc.type.transformPresence(this.value, op, isOwnOp);
  } catch (error) {
    return this.presence.emit('error', error);
  }

  this.presence._updateRemotePresence(this);
};

RemoteDocPresence.prototype._catchUpStalePresence = function () {
  if (this._pending.v >= this._doc.version) return true;

  if (!this._opCache) {
    this._startCachingOps();

    this._doc.fetch(); // We're already subscribed, but we send another subscribe message
    // to force presence updates from other clients


    this.presence.subscribe();
    return false;
  }

  while (this._opCache[this._pending.v]) {
    var item = this._opCache[this._pending.v];
    var op = item.op;
    var isOwnOp = item.isOwnOp; // We use a null op to signify a create or a delete operation. In both
    // cases we just want to reset the presence (which doesn't make sense
    // in a new document), so just set the presence to null.

    if (op === null) {
      this._pending.p = null;
      this._pending.v++;
    } else {
      ot.transformPresence(this._pending, op, isOwnOp);
    }
  }

  var hasCaughtUp = this._pending.v >= this._doc.version;

  if (hasCaughtUp) {
    this._stopCachingOps();
  }

  return hasCaughtUp;
};

RemoteDocPresence.prototype._startCachingOps = function () {
  this._opCache = [];
};

RemoteDocPresence.prototype._stopCachingOps = function () {
  this._opCache = null;
};

RemoteDocPresence.prototype._cacheOp = function (op, isOwnOp) {
  if (this._opCache) {
    op = op ? {
      op: op
    } : null; // Subtract 1 from the current doc version, because an op with v3
    // should be read as the op that takes a doc from v3 -> v4

    this._opCache[this._doc.version - 1] = {
      op: op,
      isOwnOp: isOwnOp
    };
  }
};

/***/ }),

/***/ "../modules/sharedb/lib/client/presence/remote-presence.js":
/*!*****************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/remote-presence.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");

module.exports = RemotePresence;

function RemotePresence(presence, presenceId) {
  this.presence = presence;
  this.presenceId = presenceId;
  this.connection = this.presence.connection;
  this.value = null;
  this.presenceVersion = 0;
}

RemotePresence.prototype.receiveUpdate = function (message) {
  if (message.pv < this.presenceVersion) return;
  this.value = message.p;
  this.presenceVersion = message.pv;

  this.presence._updateRemotePresence(this);
};

RemotePresence.prototype.destroy = function (callback) {
  delete this.presence._remotePresenceInstances[this.presenceId];
  delete this.presence.remotePresences[this.presenceId];
  if (callback) util.nextTick(callback);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/query.js":
/*!**********************************************!*\
  !*** ../modules/sharedb/lib/client/query.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../emitter */ "../modules/sharedb/lib/emitter.js");

var util = __webpack_require__(/*! ../util */ "../modules/sharedb/lib/util.js"); // Queries are live requests to the database for particular sets of fields.
//
// The server actively tells the client when there's new data that matches
// a set of conditions.


module.exports = Query;

function Query(action, connection, id, collection, query, options, callback) {
  emitter.EventEmitter.call(this); // 'qf' or 'qs'

  this.action = action;
  this.connection = connection;
  this.id = id;
  this.collection = collection; // The query itself. For mongo, this should look something like {"data.x":5}

  this.query = query; // A list of resulting documents. These are actual documents, complete with
  // data and all the rest. It is possible to pass in an initial results set,
  // so that a query can be serialized and then re-established

  this.results = null;

  if (options && options.results) {
    this.results = options.results;
    delete options.results;
  }

  this.extra = undefined; // Options to pass through with the query

  this.options = options;
  this.callback = callback;
  this.ready = false;
  this.sent = false;
}

emitter.mixin(Query);

Query.prototype.hasPending = function () {
  return !this.ready;
}; // Helper for subscribe & fetch, since they share the same message format.
//
// This function actually issues the query.


Query.prototype.send = function () {
  if (!this.connection.canSend) return;
  var message = {
    a: this.action,
    id: this.id,
    c: this.collection,
    q: this.query
  };

  if (this.options) {
    message.o = this.options;
  }

  if (this.results) {
    // Collect the version of all the documents in the current result set so we
    // don't need to be sent their snapshots again.
    var results = [];

    for (var i = 0; i < this.results.length; i++) {
      var doc = this.results[i];
      results.push([doc.id, doc.version]);
    }

    message.r = results;
  }

  this.connection.send(message);
  this.sent = true;
}; // Destroy the query object. Any subsequent messages for the query will be
// ignored by the connection.


Query.prototype.destroy = function (callback) {
  if (this.connection.canSend && this.action === 'qs') {
    this.connection.send({
      a: 'qu',
      id: this.id
    });
  }

  this.connection._destroyQuery(this); // There is a callback for consistency, but we don't actually wait for the
  // server's unsubscribe message currently


  if (callback) util.nextTick(callback);
};

Query.prototype._onConnectionStateChanged = function () {
  if (this.connection.canSend && !this.sent) {
    this.send();
  } else {
    this.sent = false;
  }
};

Query.prototype._handleFetch = function (err, data, extra) {
  // Once a fetch query gets its data, it is destroyed.
  this.connection._destroyQuery(this);

  this._handleResponse(err, data, extra);
};

Query.prototype._handleSubscribe = function (err, data, extra) {
  this._handleResponse(err, data, extra);
};

Query.prototype._handleResponse = function (err, data, extra) {
  var callback = this.callback;
  this.callback = null;
  if (err) return this._finishResponse(err, callback);
  if (!data) return this._finishResponse(null, callback);
  var query = this;
  var wait = 1;

  var finish = function (err) {
    if (err) return query._finishResponse(err, callback);
    if (--wait) return;

    query._finishResponse(null, callback);
  };

  if (Array.isArray(data)) {
    wait += data.length;
    this.results = this._ingestSnapshots(data, finish);
    this.extra = extra;
  } else {
    for (var id in data) {
      wait++;
      var snapshot = data[id];
      var doc = this.connection.get(snapshot.c || this.collection, id);
      doc.ingestSnapshot(snapshot, finish);
    }
  }

  finish();
};

Query.prototype._ingestSnapshots = function (snapshots, finish) {
  var results = [];

  for (var i = 0; i < snapshots.length; i++) {
    var snapshot = snapshots[i];
    var doc = this.connection.get(snapshot.c || this.collection, snapshot.d);
    doc.ingestSnapshot(snapshot, finish);
    results.push(doc);
  }

  return results;
};

Query.prototype._finishResponse = function (err, callback) {
  this.emit('ready');
  this.ready = true;

  if (err) {
    this.connection._destroyQuery(this);

    if (callback) return callback(err);
    return this.emit('error', err);
  }

  if (callback) callback(null, this.results, this.extra);
};

Query.prototype._handleError = function (err) {
  this.emit('error', err);
};

Query.prototype._handleDiff = function (diff) {
  // We need to go through the list twice. First, we'll ingest all the new
  // documents. After that we'll emit events and actually update our list.
  // This avoids race conditions around setting documents to be subscribed &
  // unsubscribing documents in event callbacks.
  for (var i = 0; i < diff.length; i++) {
    var d = diff[i];
    if (d.type === 'insert') d.values = this._ingestSnapshots(d.values);
  }

  for (var i = 0; i < diff.length; i++) {
    var d = diff[i];

    switch (d.type) {
      case 'insert':
        var newDocs = d.values;
        Array.prototype.splice.apply(this.results, [d.index, 0].concat(newDocs));
        this.emit('insert', newDocs, d.index);
        break;

      case 'remove':
        var howMany = d.howMany || 1;
        var removed = this.results.splice(d.index, howMany);
        this.emit('remove', removed, d.index);
        break;

      case 'move':
        var howMany = d.howMany || 1;
        var docs = this.results.splice(d.from, howMany);
        Array.prototype.splice.apply(this.results, [d.to, 0].concat(docs));
        this.emit('move', docs, d.from, d.to);
        break;
    }
  }

  this.emit('changed', this.results);
};

Query.prototype._handleExtra = function (extra) {
  this.extra = extra;
  this.emit('extra', extra);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/snapshot-request/snapshot-request.js":
/*!**************************************************************************!*\
  !*** ../modules/sharedb/lib/client/snapshot-request/snapshot-request.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Snapshot = __webpack_require__(/*! ../../snapshot */ "../modules/sharedb/lib/snapshot.js");

var emitter = __webpack_require__(/*! ../../emitter */ "../modules/sharedb/lib/emitter.js");

module.exports = SnapshotRequest;

function SnapshotRequest(connection, requestId, collection, id, callback) {
  emitter.EventEmitter.call(this);

  if (typeof callback !== 'function') {
    throw new Error('Callback is required for SnapshotRequest');
  }

  this.requestId = requestId;
  this.connection = connection;
  this.id = id;
  this.collection = collection;
  this.callback = callback;
  this.sent = false;
}

emitter.mixin(SnapshotRequest);

SnapshotRequest.prototype.send = function () {
  if (!this.connection.canSend) {
    return;
  }

  this.connection.send(this._message());
  this.sent = true;
};

SnapshotRequest.prototype._onConnectionStateChanged = function () {
  if (this.connection.canSend) {
    if (!this.sent) this.send();
  } else {
    // If the connection can't send, then we've had a disconnection, and even if we've already sent
    // the request previously, we need to re-send it over this reconnected client, so reset the
    // sent flag to false.
    this.sent = false;
  }
};

SnapshotRequest.prototype._handleResponse = function (error, message) {
  this.emit('ready');

  if (error) {
    return this.callback(error);
  }

  var metadata = message.meta ? message.meta : null;
  var snapshot = new Snapshot(this.id, message.v, message.type, message.data, metadata);
  this.callback(null, snapshot);
};

/***/ }),

/***/ "../modules/sharedb/lib/client/snapshot-request/snapshot-timestamp-request.js":
/*!************************************************************************************!*\
  !*** ../modules/sharedb/lib/client/snapshot-request/snapshot-timestamp-request.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SnapshotRequest = __webpack_require__(/*! ./snapshot-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-request.js");

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");

module.exports = SnapshotTimestampRequest;

function SnapshotTimestampRequest(connection, requestId, collection, id, timestamp, callback) {
  SnapshotRequest.call(this, connection, requestId, collection, id, callback);

  if (!util.isValidTimestamp(timestamp)) {
    throw new Error('Snapshot timestamp must be a positive integer or null');
  }

  this.timestamp = timestamp;
}

SnapshotTimestampRequest.prototype = Object.create(SnapshotRequest.prototype);

SnapshotTimestampRequest.prototype._message = function () {
  return {
    a: 'nt',
    id: this.requestId,
    c: this.collection,
    d: this.id,
    ts: this.timestamp
  };
};

/***/ }),

/***/ "../modules/sharedb/lib/client/snapshot-request/snapshot-version-request.js":
/*!**********************************************************************************!*\
  !*** ../modules/sharedb/lib/client/snapshot-request/snapshot-version-request.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SnapshotRequest = __webpack_require__(/*! ./snapshot-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-request.js");

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");

module.exports = SnapshotVersionRequest;

function SnapshotVersionRequest(connection, requestId, collection, id, version, callback) {
  SnapshotRequest.call(this, connection, requestId, collection, id, callback);

  if (!util.isValidVersion(version)) {
    throw new Error('Snapshot version must be a positive integer or null');
  }

  this.version = version;
}

SnapshotVersionRequest.prototype = Object.create(SnapshotRequest.prototype);

SnapshotVersionRequest.prototype._message = function () {
  return {
    a: 'nf',
    id: this.requestId,
    c: this.collection,
    d: this.id,
    v: this.version
  };
};

/***/ }),

/***/ "../modules/sharedb/lib/emitter.js":
/*!*****************************************!*\
  !*** ../modules/sharedb/lib/emitter.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:40:02
 * @FilePath: /sharedb/examples/modules/sharedb/lib/emitter.js
 * @Description:
 */
// 发布订阅事件
// 引入 events 模块
var EventEmitter = (__webpack_require__(/*! ../../events */ "../modules/events/events.js").EventEmitter);

exports.EventEmitter = EventEmitter;
exports.mixin = mixin;

function mixin(Constructor) {
  for (var key in EventEmitter.prototype) {
    Constructor.prototype[key] = EventEmitter.prototype[key];
  }
}
/*
例子
// 创建 eventEmitter 对象
  var event = new EventEmitter(); 
  event.on('some_event', function() { 
      console.log('some_event 事件触发'); 
  }); 
  setTimeout(function() { 
      event.emit('some_event'); 
  }, 1000); 
*/

/***/ }),

/***/ "../modules/sharedb/lib/error.js":
/*!***************************************!*\
  !*** ../modules/sharedb/lib/error.js ***!
  \***************************************/
/***/ ((module) => {

function ShareDBError(code, message) {
  this.code = code;
  this.message = message || '';

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ShareDBError);
  } else {
    this.stack = new Error().stack;
  }
}

ShareDBError.prototype = Object.create(Error.prototype);
ShareDBError.prototype.constructor = ShareDBError;
ShareDBError.prototype.name = 'ShareDBError';
ShareDBError.CODES = {
  ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT: 'ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT',
  ERR_APPLY_SNAPSHOT_NOT_PROVIDED: 'ERR_APPLY_SNAPSHOT_NOT_PROVIDED',
  ERR_CLIENT_ID_BADLY_FORMED: 'ERR_CLIENT_ID_BADLY_FORMED',
  ERR_CONNECTION_SEQ_INTEGER_OVERFLOW: 'ERR_CONNECTION_SEQ_INTEGER_OVERFLOW',
  ERR_CONNECTION_STATE_TRANSITION_INVALID: 'ERR_CONNECTION_STATE_TRANSITION_INVALID',
  ERR_DATABASE_ADAPTER_NOT_FOUND: 'ERR_DATABASE_ADAPTER_NOT_FOUND',
  ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE: 'ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE',
  ERR_DATABASE_METHOD_NOT_IMPLEMENTED: 'ERR_DATABASE_METHOD_NOT_IMPLEMENTED',
  ERR_DEFAULT_TYPE_MISMATCH: 'ERR_DEFAULT_TYPE_MISMATCH',
  ERR_DOC_MISSING_VERSION: 'ERR_DOC_MISSING_VERSION',
  ERR_DOC_ALREADY_CREATED: 'ERR_DOC_ALREADY_CREATED',
  ERR_DOC_DOES_NOT_EXIST: 'ERR_DOC_DOES_NOT_EXIST',
  ERR_DOC_TYPE_NOT_RECOGNIZED: 'ERR_DOC_TYPE_NOT_RECOGNIZED',
  ERR_DOC_WAS_DELETED: 'ERR_DOC_WAS_DELETED',
  ERR_INFLIGHT_OP_MISSING: 'ERR_INFLIGHT_OP_MISSING',
  ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION: 'ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION',
  ERR_MAX_SUBMIT_RETRIES_EXCEEDED: 'ERR_MAX_SUBMIT_RETRIES_EXCEEDED',
  ERR_MESSAGE_BADLY_FORMED: 'ERR_MESSAGE_BADLY_FORMED',
  ERR_MILESTONE_ARGUMENT_INVALID: 'ERR_MILESTONE_ARGUMENT_INVALID',
  ERR_OP_ALREADY_SUBMITTED: 'ERR_OP_ALREADY_SUBMITTED',
  ERR_OP_NOT_ALLOWED_IN_PROJECTION: 'ERR_OP_NOT_ALLOWED_IN_PROJECTION',
  ERR_OP_SUBMIT_REJECTED: 'ERR_OP_SUBMIT_REJECTED',
  ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM: 'ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM',
  ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM: 'ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM',
  ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT: 'ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT',
  ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED: 'ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED',
  ERR_OT_OP_BADLY_FORMED: 'ERR_OT_OP_BADLY_FORMED',
  ERR_OT_OP_NOT_APPLIED: 'ERR_OT_OP_NOT_APPLIED',
  ERR_OT_OP_NOT_PROVIDED: 'ERR_OT_OP_NOT_PROVIDED',
  ERR_PRESENCE_TRANSFORM_FAILED: 'ERR_PRESENCE_TRANSFORM_FAILED',
  ERR_PROTOCOL_VERSION_NOT_SUPPORTED: 'ERR_PROTOCOL_VERSION_NOT_SUPPORTED',
  ERR_QUERY_EMITTER_LISTENER_NOT_ASSIGNED: 'ERR_QUERY_EMITTER_LISTENER_NOT_ASSIGNED',

  /**
   * A special error that a "readSnapshots" middleware implementation can use to indicate that it
   * wishes for the ShareDB client to treat it as a silent rejection, not passing the error back to
   * user code.
   *
   * For subscribes, the ShareDB client will still cancel the document subscription.
   */
  ERR_SNAPSHOT_READ_SILENT_REJECTION: 'ERR_SNAPSHOT_READ_SILENT_REJECTION',

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
  ERR_SNAPSHOT_READS_REJECTED: 'ERR_SNAPSHOT_READS_REJECTED',
  ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND: 'ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND',
  ERR_TYPE_CANNOT_BE_PROJECTED: 'ERR_TYPE_CANNOT_BE_PROJECTED',
  ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE: 'ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE',
  ERR_UNKNOWN_ERROR: 'ERR_UNKNOWN_ERROR'
};
module.exports = ShareDBError;

/***/ }),

/***/ "../modules/sharedb/lib/logger/index.js":
/*!**********************************************!*\
  !*** ../modules/sharedb/lib/logger/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:45:32
 * @FilePath: /sharedb/examples/modules/sharedb/lib/logger/index.js
 * @Description: 
 */
// console 中的 ["info", "warn", "error"] 日志方法
var Logger = __webpack_require__(/*! ./logger */ "../modules/sharedb/lib/logger/logger.js");

var logger = new Logger();
module.exports = logger;

/***/ }),

/***/ "../modules/sharedb/lib/logger/logger.js":
/*!***********************************************!*\
  !*** ../modules/sharedb/lib/logger/logger.js ***!
  \***********************************************/
/***/ ((module) => {

/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:43:53
 * @FilePath: /sharedb/examples/modules/sharedb/lib/logger/logger.js
 * @Description:
 */
var SUPPORTED_METHODS = ["info", "warn", "error"];

function Logger() {
  var defaultMethods = {};
  SUPPORTED_METHODS.forEach(function (method) {
    // Deal with Chrome issue: https://bugs.chromium.org/p/chromium/issues/detail?id=179628
    defaultMethods[method] = console[method].bind(console);
  });
  this.setMethods(defaultMethods);
}

module.exports = Logger;

Logger.prototype.setMethods = function (overrides) {
  overrides = overrides || {};
  var logger = this;
  SUPPORTED_METHODS.forEach(function (method) {
    if (typeof overrides[method] === "function") {
      logger[method] = overrides[method];
    }
  });
}; // let logger = new Logger();
// logger.warn("Invalid version from server. Expected: ");

/***/ }),

/***/ "../modules/sharedb/lib/ot.js":
/*!************************************!*\
  !*** ../modules/sharedb/lib/ot.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// This contains the master OT functions for the database. They look like
// ot-types style operational transform functions, but they're a bit different.
// These functions understand versions and can deal with out of bound create &
// delete operations.
var types = __webpack_require__(/*! ./types */ "../modules/sharedb/lib/types.js");

var ShareDBError = __webpack_require__(/*! ./error */ "../modules/sharedb/lib/error.js");

var util = __webpack_require__(/*! ./util */ "../modules/sharedb/lib/util.js");

var ERROR_CODE = ShareDBError.CODES; // Returns an error string on failure. Rockin' it C style.
//失败时返回一个错误字符串。 检测 op

exports.checkOp = function (op) {
  if (op == null || typeof op !== 'object') {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'Op must be an object');
  }

  if (op.create != null) {
    if (typeof op.create !== 'object') {
      return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'Create data must be an object');
    }

    var typeName = op.create.type;

    if (typeof typeName !== 'string') {
      return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'Missing create type');
    }

    var type = types.map[typeName];

    if (type == null || typeof type !== 'object') {
      return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, 'Unknown type');
    }
  } else if (op.del != null) {
    if (op.del !== true) return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'del value must be true');
  } else if (!('op' in op)) {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'Missing op, create, or del');
  }

  if (op.src != null && typeof op.src !== 'string') {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'src must be a string');
  }

  if (op.seq != null && typeof op.seq !== 'number') {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'seq must be a number');
  }

  if (op.src == null && op.seq != null || op.src != null && op.seq == null) {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'Both src and seq must be set together');
  }

  if (op.m != null && typeof op.m !== 'object') {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, 'op.m must be an object or null');
  }
}; // Takes in a string (type name or URI) and returns the normalized name (uri)


exports.normalizeType = function (typeName) {
  return types.map[typeName] && types.map[typeName].uri;
}; // This is the super apply function that takes in snapshot data (including the
// type) and edits it in-place. Returns an error or null for success.


exports.apply = function (snapshot, op) {
  if (typeof snapshot !== 'object') {
    return new ShareDBError(ERROR_CODE.ERR_APPLY_SNAPSHOT_NOT_PROVIDED, 'Missing snapshot');
  }

  if (snapshot.v != null && op.v != null && snapshot.v !== op.v) {
    return new ShareDBError(ERROR_CODE.ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT, 'Version mismatch');
  } // Create operation


  if (op.create) {
    if (snapshot.type) return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, 'Document already exists'); // The document doesn't exist, although it might have once existed

    var create = op.create;
    var type = types.map[create.type];
    if (!type) return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, 'Unknown type');

    try {
      snapshot.data = type.create(create.data);
      snapshot.type = type.uri;
      snapshot.v++;
    } catch (err) {
      return err;
    } // Delete operation

  } else if (op.del) {
    snapshot.data = undefined;
    snapshot.type = null;
    snapshot.v++; // Edit operation
  } else if ('op' in op) {
    var err = applyOpEdit(snapshot, op.op);
    if (err) return err;
    snapshot.v++; // No-op, and we don't have to do anything
  } else {
    snapshot.v++;
  }
};

function applyOpEdit(snapshot, edit) {
  if (!snapshot.type) return new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, 'Document does not exist');
  if (edit === undefined) return new ShareDBError(ERROR_CODE.ERR_OT_OP_NOT_PROVIDED, 'Missing op');
  var type = types.map[snapshot.type];
  if (!type) return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, 'Unknown type');

  try {
    console.log('snapshot.data=', snapshot.data);
    console.log('edit', edit);
    snapshot.data = type.apply(snapshot.data, edit);
  } catch (err) {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_NOT_APPLIED, err.message);
  }
}

exports.transform = function (type, op, appliedOp) {
  // There are 16 cases this function needs to deal with - which are all the
  // combinations of create/delete/op/noop from both op and appliedOp
  if (op.v != null && op.v !== appliedOp.v) {
    return new ShareDBError(ERROR_CODE.ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM, 'Version mismatch');
  }

  if (appliedOp.del) {
    if (op.create || 'op' in op) {
      return new ShareDBError(ERROR_CODE.ERR_DOC_WAS_DELETED, 'Document was deleted');
    }
  } else if (appliedOp.create && ('op' in op || op.create || op.del) || 'op' in appliedOp && op.create) {
    // If appliedOp.create is not true, appliedOp contains an op - which
    // also means the document exists remotely.
    return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, 'Document was created remotely');
  } else if ('op' in appliedOp && 'op' in op) {
    // If we reach here, they both have a .op property.
    if (!type) return new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, 'Document does not exist');

    if (typeof type === 'string') {
      type = types.map[type];
      if (!type) return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, 'Unknown type');
    }

    try {
      op.op = type.transform(op.op, appliedOp.op, 'left');
    } catch (err) {
      return err;
    }
  }

  if (op.v != null) op.v++;
};
/**
 * Apply an array of ops to the provided snapshot.
 *
 * @param snapshot - a Snapshot object which will be mutated by the provided ops
 * @param ops - an array of ops to apply to the snapshot
 * @param options - options (currently for internal use only)
 * @return an error object if applicable
 */


exports.applyOps = function (snapshot, ops, options) {
  options = options || {};

  for (var index = 0; index < ops.length; index++) {
    var op = ops[index];

    if (options._normalizeLegacyJson0Ops) {
      try {
        normalizeLegacyJson0Ops(snapshot, op);
      } catch (error) {
        return new ShareDBError(ERROR_CODE.ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED, 'Cannot normalize legacy json0 op');
      }
    }

    snapshot.v = op.v;
    var error = exports.apply(snapshot, op);
    if (error) return error;
  }
};

exports.transformPresence = function (presence, op, isOwnOp) {
  var opError = this.checkOp(op);
  if (opError) return opError;
  var type = presence.t;

  if (typeof type === 'string') {
    type = types.map[type];
  }

  if (!type) return {
    code: ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED,
    message: 'Unknown type'
  };

  if (!util.supportsPresence(type)) {
    return {
      code: ERROR_CODE.ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE,
      message: 'Type does not support presence'
    };
  }

  if (op.create || op.del) {
    presence.p = null;
    presence.v++;
    return;
  }

  try {
    presence.p = presence.p === null ? null : type.transformPresence(presence.p, op.op, isOwnOp);
  } catch (error) {
    return {
      code: ERROR_CODE.ERR_PRESENCE_TRANSFORM_FAILED,
      message: error.message || error
    };
  }

  presence.v++;
};
/**
 * json0 had a breaking change in https://github.com/ottypes/json0/pull/40
 * The change added stricter type checking, which breaks fetchSnapshot()
 * when trying to rebuild a snapshot from old, committed ops that didn't
 * have this stricter validation. This method fixes up legacy ops to
 * pass the stricter validation
 */
// 合并 op


function normalizeLegacyJson0Ops(snapshot, json0Op) {
  if (snapshot.type !== types.defaultType.uri) return;
  var components = json0Op.op;
  if (!components) return;
  var data = snapshot.data; // type.apply() makes no guarantees about mutating the original data, so
  // we need to clone. However, we only need to apply() if we have multiple
  // components, so avoid cloning if we don't have to.

  if (components.length > 1) data = util.clone(data);

  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    if (typeof component.lm === 'string') component.lm = +component.lm;
    var path = component.p;
    var element = data;

    for (var j = 0; j < path.length; j++) {
      var key = path[j]; // https://github.com/ottypes/json0/blob/73db17e86adc5d801951d1a69453b01382e66c7d/lib/json0.js#L21

      if (Object.prototype.toString.call(element) == '[object Array]') path[j] = +key; // https://github.com/ottypes/json0/blob/73db17e86adc5d801951d1a69453b01382e66c7d/lib/json0.js#L32
      else if (element.constructor === Object) path[j] = key.toString();
      element = element[key];
    } // Apply to update the snapshot, so we can correctly check the path for
    // the next component. We don't need to do this on the final iteration,
    // since there's no more ops.
    //
    //应用更新快照，这样我们可以正确地检查路径
    //下一个组件。我们不需要在最后一次迭代时这么做，
    //因为没有更多的操作。
    //  console.log('types.defaultType.apply===')


    if (i < components.length - 1) data = types.defaultType.apply(data, [component]);
  }
}

/***/ }),

/***/ "../modules/sharedb/lib/snapshot.js":
/*!******************************************!*\
  !*** ../modules/sharedb/lib/snapshot.js ***!
  \******************************************/
/***/ ((module) => {

module.exports = Snapshot;

function Snapshot(id, version, type, data, meta) {
  this.id = id;
  this.v = version;
  this.type = type;
  this.data = data;
  this.m = meta;
}

/***/ }),

/***/ "../modules/sharedb/lib/types.js":
/*!***************************************!*\
  !*** ../modules/sharedb/lib/types.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-06 12:55:43
 * @FilePath: /sharedb/examples/textarea/modules/sharedb/lib/types.js
 * @Description:
 */
exports.defaultType = __webpack_require__(/*! ../../ot-json0 */ "../modules/ot-json0/lib/index.js").type; // exports.defaultType = require('ot-json0').type;

exports.map = {};

exports.register = function (type) {
  if (type.name) {
    exports.map[type.name] = type;
  }

  if (type.uri) {
    exports.map[type.uri] = type;
  }
};

exports.register(exports.defaultType);

/***/ }),

/***/ "../modules/sharedb/lib/util.js":
/*!**************************************!*\
  !*** ../modules/sharedb/lib/util.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

exports.doNothing = doNothing;

function doNothing() {}

exports.hasKeys = function (object) {
  for (var key in object) return true;

  return false;
}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill


exports.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

exports.isValidVersion = function (version) {
  if (version === null) return true;
  return exports.isInteger(version) && version >= 0;
};

exports.isValidTimestamp = function (timestamp) {
  return exports.isValidVersion(timestamp);
};

exports.MAX_SAFE_INTEGER = 9007199254740991;

exports.dig = function () {
  var obj = arguments[0];

  for (var i = 1; i < arguments.length; i++) {
    var key = arguments[i];
    obj = obj[key] || (i === arguments.length - 1 ? undefined : {});
  }

  return obj;
};

exports.digOrCreate = function () {
  var obj = arguments[0];
  var createCallback = arguments[arguments.length - 1];

  for (var i = 1; i < arguments.length - 1; i++) {
    var key = arguments[i];
    obj = obj[key] || (obj[key] = i === arguments.length - 2 ? createCallback() : {});
  }

  return obj;
};

exports.digAndRemove = function () {
  var obj = arguments[0];
  var objects = [obj];

  for (var i = 1; i < arguments.length - 1; i++) {
    var key = arguments[i];
    if (!obj.hasOwnProperty(key)) break;
    obj = obj[key];
    objects.push(obj);
  }

  ;

  for (var i = objects.length - 1; i >= 0; i--) {
    var parent = objects[i];
    var key = arguments[i + 1];
    var child = parent[key];
    if (i === objects.length - 1 || !exports.hasKeys(child)) delete parent[key];
  }
};

exports.supportsPresence = function (type) {
  return type && typeof type.transformPresence === 'function';
};

exports.callEach = function (callbacks, error) {
  var called = false;
  callbacks.forEach(function (callback) {
    if (callback) {
      callback(error);
      called = true;
    }
  });
  return called;
};

exports.truthy = function (arg) {
  return !!arg;
};

exports.nextTick = function (callback) {
  if (typeof process !== 'undefined' && process.nextTick) {
    return process.nextTick.apply(null, arguments);
  }

  var args = [];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  setTimeout(function () {
    callback.apply(null, args);
  });
};

exports.clone = function (obj) {
  return obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
};

/***/ }),

/***/ "../modules/text-diff-binding/index.js":
/*!*********************************************!*\
  !*** ../modules/text-diff-binding/index.js ***!
  \*********************************************/
/***/ ((module) => {

module.exports = TextDiffBinding; // 获取真实dom

function TextDiffBinding(element) {
  this.element = element;
} // 抽象方法


TextDiffBinding.prototype._get = TextDiffBinding.prototype._insert = TextDiffBinding.prototype._remove = function () {
  throw new Error("`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined.");
}; // 获取dom的value


TextDiffBinding.prototype._getElementValue = function () {
  var value = this.element.value; // IE and Opera replace \n with \r\n. Always store strings as \n

  return value.replace(/\r\n/g, "\n");
}; //获取input末尾

/*
  如果是当前Input表单没有获取到光标
  或者当前光标选中不是在末尾
  或者是光标后面的字符串和服务器sharedb的后面内容不相同的时候
  返回false
*/


TextDiffBinding.prototype._getInputEnd = function (previous, //sharedb内容，
value //dom内容
) {
  // 判断是否当前获得焦点的元素:
  if (this.element !== document.activeElement) {
    return null;
  } //如果字符串的长度等于光标开始的位置 那么光标就是在尾部


  var end = value.length - this.element.selectionStart;

  if (end === 0) {
    return end;
  } // 如果光标后面的字符串不相同


  if (previous.slice(previous.length - end) !== value.slice(value.length - end)) {
    return null;
  }

  return end;
}; //为input添加onChange事件 根据用户onChange事件判断是删除还是新增字符串


TextDiffBinding.prototype.onInput = function () {
  //获取sharedb文档内容
  var previous = this._get(); // 获取表单值


  var value = this._getElementValue();

  console.log('value=', value); // 
  //如果他们内容相同

  if (previous === value) {
    return;
  }

  var start = 0; // Attempt to use the DOM cursor position to find the end
  // 尝试使用DOM光标位置查找结束 获取光标结束位置

  var end = this._getInputEnd(previous, //sharedb内容
  value //dom内容
  );

  if (end === null) {
    // If we failed to find the end based on the cursor, do a diff. When
    // ambiguous, prefer to locate ops at the end of the string, since users
    // more frequently add or remove from the end of a text input
    //如果我们没有根据游标找到结束，执行diff
    //二义性，更倾向于在字符串的末尾定位ops，因为用户
    //更频繁地从文本输入的末尾添加或删除
    while (previous.charAt(start) === value.charAt(start)) {
      //找到前面相同的字符
      start++;
    }

    end = 0; //找到后面相同的字符串

    while (previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) && end + start < previous.length && end + start < value.length) {
      end++;
    }
  } else {
    //如果能获取尾部光标 此时 一般是用户在尾部删除字符串 所以我们只需要校验前面字符串相等就行
    while (previous.charAt(start) === value.charAt(start) && start + end < previous.length && start + end < value.length) {
      //获取删除开始位置
      start++;
    }
  }
  /*
   假设 previous内容是 abc
       value内容是    ab
       那么  previous.length 等于 3
       start + end  等于 2
        previous内容是 服务器内容是旧的，
        value内容是表单输入内容是新的
        所以得出他删除了内容
  */


  if (previous.length !== start + end) {
    //截取删除的内容
    var removed = previous.slice(start, previous.length - end); // 删除字符串方法

    this._remove(start, removed); // 

  }
  /*
   假设 previous内容是 abc
       value内容是    abcd
       那么    value.length 等于 3
        start + end  等于 2
        previous内容是 服务器内容是旧的，
        value内容是表单输入内容是新的
        所以得出他添加了内容
  */


  if (value.length !== start + end) {
    //截取添加的内容
    var inserted = value.slice(start, value.length - end); // 添加字符串方法

    this._insert(start, // 插入开始位置
    inserted // 插入内容
    ); // 

  }
}; // 插入文档   //光标判断偏移光标


TextDiffBinding.prototype.onInsert = function (index, //插入内容位置
length //插入内容的长度
) {
  // 更新真实dom文档 并且设置光标偏移
  this._transformSelectionAndUpdate(index, length, insertCursorTransform);
}; //光标判断偏移光标

/*
  比如旧的内容是 abc
  插入         c
  插入位置      在3
  光标在        1
  如果插入位置在光标的后面则光标需要 加上当前插入字符串的长度，
  如果插入位置在光标的后面则不需要偏移贯标
*/


function insertCursorTransform(index, //插入位置
length, // 插入长度
cursor //光标位置
) {
  return index < cursor ? cursor + length : cursor;
} // 更新真实dom文档 并且设置光标偏移


TextDiffBinding.prototype.onRemove = function (index, //删除位置
length // 删除长度
) {
  // 更新真实dom文档 并且设置光标偏移
  this._transformSelectionAndUpdate(index, length, removeCursorTransform);
};
/*
 如果删除位置在光标的前面
  那么等于 cursor - Math.min(length, cursor - index) 
  Math.min(length, cursor - index)  是兼容开始和结束光标，
  比如选中的时候 结束光标是在后面的在字符串最后面，此时如果其他用户删除了 后面的所有字符串，那么
  此时的 开始 如果是 开始 cursor-length 那么就等于负数了，
  比如
  字符串为  123456789
  选中 23456789  开始位置为
 index= 1
 length= 8
 start cursor= 1
 end cursor= 9
*/
// 删除文本时候设置光标偏移


function removeCursorTransform(index, //删除开始位置
length, // 删除长度
cursor // 光标位置
) {
  console.log("index=", index);
  console.log("length=", length);
  console.log("cursor=", cursor);
  return index < cursor ? cursor - Math.min(length, cursor - index) : cursor;
} // 更新真实dom文档 并且设置光标偏移


TextDiffBinding.prototype._transformSelectionAndUpdate = function (index, //插入位置
length, // 插入内容长度
transformCursor // 光标偏移
) {
  //如果当前文档获取焦点
  if (document.activeElement === this.element) {
    //偏移光标开始位置
    var selectionStart = transformCursor(index, //插入位置
    length, // 插入内容长度
    //光标开始位置
    this.element.selectionStart); //偏移光标结束位置

    var selectionEnd = transformCursor(index, //插入位置
    length, // 插入内容长度
    // 光标结束位置
    this.element.selectionEnd);
    /*
      selectionDirection 可选
      一个表示选择方向的字符串，可能的值有：
      "forward"
      "backward"
      "none" 默认值，表示方向未知或不相关。
    */

    var selectionDirection = this.element.selectionDirection; //更新文档

    this.update(); //重新这只光标

    this.element.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  } else {
    //如果当前文档没有获取焦点则直接更新文档
    this.update();
  }
}; // 更新文档到真实dom中


TextDiffBinding.prototype.update = function () {
  var value = this._get(); // 获取dom的value


  if (this._getElementValue() === value) {
    return;
  }

  this.element.value = value;
};

/***/ }),

/***/ "../modules/async/dist/async.mjs":
/*!***************************************!*\
  !*** ../modules/async/dist/async.mjs ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "all": () => (/* binding */ every$1),
/* harmony export */   "allLimit": () => (/* binding */ everyLimit$1),
/* harmony export */   "allSeries": () => (/* binding */ everySeries$1),
/* harmony export */   "any": () => (/* binding */ some$1),
/* harmony export */   "anyLimit": () => (/* binding */ someLimit$1),
/* harmony export */   "anySeries": () => (/* binding */ someSeries$1),
/* harmony export */   "apply": () => (/* binding */ apply),
/* harmony export */   "applyEach": () => (/* binding */ applyEach$1),
/* harmony export */   "applyEachSeries": () => (/* binding */ applyEachSeries),
/* harmony export */   "asyncify": () => (/* binding */ asyncify),
/* harmony export */   "auto": () => (/* binding */ auto),
/* harmony export */   "autoInject": () => (/* binding */ autoInject),
/* harmony export */   "cargo": () => (/* binding */ cargo),
/* harmony export */   "cargoQueue": () => (/* binding */ cargo$1),
/* harmony export */   "compose": () => (/* binding */ compose),
/* harmony export */   "concat": () => (/* binding */ concat$1),
/* harmony export */   "concatLimit": () => (/* binding */ concatLimit$1),
/* harmony export */   "concatSeries": () => (/* binding */ concatSeries$1),
/* harmony export */   "constant": () => (/* binding */ constant),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "detect": () => (/* binding */ detect$1),
/* harmony export */   "detectLimit": () => (/* binding */ detectLimit$1),
/* harmony export */   "detectSeries": () => (/* binding */ detectSeries$1),
/* harmony export */   "dir": () => (/* binding */ dir),
/* harmony export */   "doDuring": () => (/* binding */ doWhilst$1),
/* harmony export */   "doUntil": () => (/* binding */ doUntil),
/* harmony export */   "doWhilst": () => (/* binding */ doWhilst$1),
/* harmony export */   "during": () => (/* binding */ whilst$1),
/* harmony export */   "each": () => (/* binding */ each),
/* harmony export */   "eachLimit": () => (/* binding */ eachLimit$2),
/* harmony export */   "eachOf": () => (/* binding */ eachOf$1),
/* harmony export */   "eachOfLimit": () => (/* binding */ eachOfLimit$2),
/* harmony export */   "eachOfSeries": () => (/* binding */ eachOfSeries$1),
/* harmony export */   "eachSeries": () => (/* binding */ eachSeries$1),
/* harmony export */   "ensureAsync": () => (/* binding */ ensureAsync),
/* harmony export */   "every": () => (/* binding */ every$1),
/* harmony export */   "everyLimit": () => (/* binding */ everyLimit$1),
/* harmony export */   "everySeries": () => (/* binding */ everySeries$1),
/* harmony export */   "filter": () => (/* binding */ filter$1),
/* harmony export */   "filterLimit": () => (/* binding */ filterLimit$1),
/* harmony export */   "filterSeries": () => (/* binding */ filterSeries$1),
/* harmony export */   "find": () => (/* binding */ detect$1),
/* harmony export */   "findLimit": () => (/* binding */ detectLimit$1),
/* harmony export */   "findSeries": () => (/* binding */ detectSeries$1),
/* harmony export */   "flatMap": () => (/* binding */ concat$1),
/* harmony export */   "flatMapLimit": () => (/* binding */ concatLimit$1),
/* harmony export */   "flatMapSeries": () => (/* binding */ concatSeries$1),
/* harmony export */   "foldl": () => (/* binding */ reduce$1),
/* harmony export */   "foldr": () => (/* binding */ reduceRight),
/* harmony export */   "forEach": () => (/* binding */ each),
/* harmony export */   "forEachLimit": () => (/* binding */ eachLimit$2),
/* harmony export */   "forEachOf": () => (/* binding */ eachOf$1),
/* harmony export */   "forEachOfLimit": () => (/* binding */ eachOfLimit$2),
/* harmony export */   "forEachOfSeries": () => (/* binding */ eachOfSeries$1),
/* harmony export */   "forEachSeries": () => (/* binding */ eachSeries$1),
/* harmony export */   "forever": () => (/* binding */ forever$1),
/* harmony export */   "groupBy": () => (/* binding */ groupBy),
/* harmony export */   "groupByLimit": () => (/* binding */ groupByLimit$1),
/* harmony export */   "groupBySeries": () => (/* binding */ groupBySeries),
/* harmony export */   "inject": () => (/* binding */ reduce$1),
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "map": () => (/* binding */ map$1),
/* harmony export */   "mapLimit": () => (/* binding */ mapLimit$1),
/* harmony export */   "mapSeries": () => (/* binding */ mapSeries$1),
/* harmony export */   "mapValues": () => (/* binding */ mapValues),
/* harmony export */   "mapValuesLimit": () => (/* binding */ mapValuesLimit$1),
/* harmony export */   "mapValuesSeries": () => (/* binding */ mapValuesSeries),
/* harmony export */   "memoize": () => (/* binding */ memoize),
/* harmony export */   "nextTick": () => (/* binding */ nextTick),
/* harmony export */   "parallel": () => (/* binding */ parallel),
/* harmony export */   "parallelLimit": () => (/* binding */ parallelLimit),
/* harmony export */   "priorityQueue": () => (/* binding */ priorityQueue),
/* harmony export */   "queue": () => (/* binding */ queue$1),
/* harmony export */   "race": () => (/* binding */ race$1),
/* harmony export */   "reduce": () => (/* binding */ reduce$1),
/* harmony export */   "reduceRight": () => (/* binding */ reduceRight),
/* harmony export */   "reflect": () => (/* binding */ reflect),
/* harmony export */   "reflectAll": () => (/* binding */ reflectAll),
/* harmony export */   "reject": () => (/* binding */ reject$2),
/* harmony export */   "rejectLimit": () => (/* binding */ rejectLimit$1),
/* harmony export */   "rejectSeries": () => (/* binding */ rejectSeries$1),
/* harmony export */   "retry": () => (/* binding */ retry),
/* harmony export */   "retryable": () => (/* binding */ retryable),
/* harmony export */   "select": () => (/* binding */ filter$1),
/* harmony export */   "selectLimit": () => (/* binding */ filterLimit$1),
/* harmony export */   "selectSeries": () => (/* binding */ filterSeries$1),
/* harmony export */   "seq": () => (/* binding */ seq),
/* harmony export */   "series": () => (/* binding */ series),
/* harmony export */   "setImmediate": () => (/* binding */ setImmediate$1),
/* harmony export */   "some": () => (/* binding */ some$1),
/* harmony export */   "someLimit": () => (/* binding */ someLimit$1),
/* harmony export */   "someSeries": () => (/* binding */ someSeries$1),
/* harmony export */   "sortBy": () => (/* binding */ sortBy$1),
/* harmony export */   "timeout": () => (/* binding */ timeout),
/* harmony export */   "times": () => (/* binding */ times),
/* harmony export */   "timesLimit": () => (/* binding */ timesLimit),
/* harmony export */   "timesSeries": () => (/* binding */ timesSeries),
/* harmony export */   "transform": () => (/* binding */ transform),
/* harmony export */   "tryEach": () => (/* binding */ tryEach$1),
/* harmony export */   "unmemoize": () => (/* binding */ unmemoize),
/* harmony export */   "until": () => (/* binding */ until),
/* harmony export */   "waterfall": () => (/* binding */ waterfall$1),
/* harmony export */   "whilst": () => (/* binding */ whilst$1),
/* harmony export */   "wrapSync": () => (/* binding */ asyncify)
/* harmony export */ });
/**
 * Creates a continuation function with some arguments already applied.
 *
 * Useful as a shorthand when combined with other control flow functions. Any
 * arguments passed to the returned function are added to the arguments
 * originally passed to apply.
 *
 * @name apply
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function you want to eventually apply all
 * arguments to. Invokes with (arguments...).
 * @param {...*} arguments... - Any number of arguments to automatically apply
 * when the continuation is called.
 * @returns {Function} the partially-applied function
 * @example
 *
 * // using apply
 * async.parallel([
 *     async.apply(fs.writeFile, 'testfile1', 'test1'),
 *     async.apply(fs.writeFile, 'testfile2', 'test2')
 * ]);
 *
 *
 * // the same process without using apply
 * async.parallel([
 *     function(callback) {
 *         fs.writeFile('testfile1', 'test1', callback);
 *     },
 *     function(callback) {
 *         fs.writeFile('testfile2', 'test2', callback);
 *     }
 * ]);
 *
 * // It's possible to pass any number of additional arguments when calling the
 * // continuation:
 *
 * node> var fn = async.apply(sys.puts, 'one');
 * node> fn('two', 'three');
 * one
 * two
 * three
 */
function apply(fn, ...args) {
  return (...callArgs) => fn(...args, ...callArgs);
}

function initialParams(fn) {
  return function (...args
  /*, callback*/
  ) {
    var callback = args.pop();
    return fn.call(this, args, callback);
  };
}
/* istanbul ignore file */


var hasQueueMicrotask = typeof queueMicrotask === 'function' && queueMicrotask;
var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
  setTimeout(fn, 0);
}

function wrap(defer) {
  return (fn, ...args) => defer(() => fn(...args));
}

var _defer;

if (hasQueueMicrotask) {
  _defer = queueMicrotask;
} else if (hasSetImmediate) {
  _defer = setImmediate;
} else if (hasNextTick) {
  _defer = process.nextTick;
} else {
  _defer = fallback;
}

var setImmediate$1 = wrap(_defer);
/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */

function asyncify(func) {
  if (isAsync(func)) {
    return function (...args
    /*, callback*/
    ) {
      const callback = args.pop();
      const promise = func.apply(this, args);
      return handlePromise(promise, callback);
    };
  }

  return initialParams(function (args, callback) {
    var result;

    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    } // if result is Promise object


    if (result && typeof result.then === 'function') {
      return handlePromise(result, callback);
    } else {
      callback(null, result);
    }
  });
}

function handlePromise(promise, callback) {
  return promise.then(value => {
    invokeCallback(callback, null, value);
  }, err => {
    invokeCallback(callback, err && err.message ? err : new Error(err));
  });
}

function invokeCallback(callback, error, value) {
  try {
    callback(error, value);
  } catch (err) {
    setImmediate$1(e => {
      throw e;
    }, err);
  }
}

function isAsync(fn) {
  return fn[Symbol.toStringTag] === 'AsyncFunction';
}

function isAsyncGenerator(fn) {
  return fn[Symbol.toStringTag] === 'AsyncGenerator';
}

function isAsyncIterable(obj) {
  return typeof obj[Symbol.asyncIterator] === 'function';
}

function wrapAsync(asyncFn) {
  if (typeof asyncFn !== 'function') throw new Error('expected a function');
  return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
} // conditionally promisify a function.
// only return a promise if a callback is omitted


function awaitify(asyncFn, arity = asyncFn.length) {
  if (!arity) throw new Error('arity is undefined');

  function awaitable(...args) {
    if (typeof args[arity - 1] === 'function') {
      return asyncFn.apply(this, args);
    }

    return new Promise((resolve, reject) => {
      args[arity - 1] = (err, ...cbArgs) => {
        if (err) return reject(err);
        resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
      };

      asyncFn.apply(this, args);
    });
  }

  return awaitable;
}

function applyEach(eachfn) {
  return function applyEach(fns, ...callArgs) {
    const go = awaitify(function (callback) {
      var that = this;
      return eachfn(fns, (fn, cb) => {
        wrapAsync(fn).apply(that, callArgs.concat(cb));
      }, callback);
    });
    return go;
  };
}

function _asyncMap(eachfn, arr, iteratee, callback) {
  arr = arr || [];
  var results = [];
  var counter = 0;

  var _iteratee = wrapAsync(iteratee);

  return eachfn(arr, (value, _, iterCb) => {
    var index = counter++;

    _iteratee(value, (err, v) => {
      results[index] = v;
      iterCb(err);
    });
  }, err => {
    callback(err, results);
  });
}

function isArrayLike(value) {
  return value && typeof value.length === 'number' && value.length >= 0 && value.length % 1 === 0;
} // A temporary value used to identify if the loop should be broken.
// See #1064, #1293


const breakLoop = {};

function once(fn) {
  function wrapper(...args) {
    if (fn === null) return;
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  }

  Object.assign(wrapper, fn);
  return wrapper;
}

function getIterator(coll) {
  return coll[Symbol.iterator] && coll[Symbol.iterator]();
}

function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? {
      value: coll[i],
      key: i
    } : null;
  };
}

function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done) return null;
    i++;
    return {
      value: item.value,
      key: i
    };
  };
}

function createObjectIterator(obj) {
  var okeys = obj ? Object.keys(obj) : [];
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];

    if (key === '__proto__') {
      return next();
    }

    return i < len ? {
      value: obj[key],
      key
    } : null;
  };
}

function createIterator(coll) {
  if (isArrayLike(coll)) {
    return createArrayIterator(coll);
  }

  var iterator = getIterator(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}

function onlyOnce(fn) {
  return function (...args) {
    if (fn === null) throw new Error("Callback was already called.");
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  };
} // for async generators


function asyncEachOfLimit(generator, limit, iteratee, callback) {
  let done = false;
  let canceled = false;
  let awaiting = false;
  let running = 0;
  let idx = 0;

  function replenish() {
    //console.log('replenish')
    if (running >= limit || awaiting || done) return; //console.log('replenish awaiting')

    awaiting = true;
    generator.next().then(({
      value,
      done: iterDone
    }) => {
      //console.log('got value', value)
      if (canceled || done) return;
      awaiting = false;

      if (iterDone) {
        done = true;

        if (running <= 0) {
          //console.log('done nextCb')
          callback(null);
        }

        return;
      }

      running++;
      iteratee(value, idx, iterateeCallback);
      idx++;
      replenish();
    }).catch(handleError);
  }

  function iterateeCallback(err, result) {
    //console.log('iterateeCallback')
    running -= 1;
    if (canceled) return;
    if (err) return handleError(err);

    if (err === false) {
      done = true;
      canceled = true;
      return;
    }

    if (result === breakLoop || done && running <= 0) {
      done = true; //console.log('done iterCb')

      return callback(null);
    }

    replenish();
  }

  function handleError(err) {
    if (canceled) return;
    awaiting = false;
    done = true;
    callback(err);
  }

  replenish();
}

var eachOfLimit = limit => {
  return (obj, iteratee, callback) => {
    callback = once(callback);

    if (limit <= 0) {
      throw new RangeError('concurrency limit cannot be less than 1');
    }

    if (!obj) {
      return callback(null);
    }

    if (isAsyncGenerator(obj)) {
      return asyncEachOfLimit(obj, limit, iteratee, callback);
    }

    if (isAsyncIterable(obj)) {
      return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
    }

    var nextElem = createIterator(obj);
    var done = false;
    var canceled = false;
    var running = 0;
    var looping = false;

    function iterateeCallback(err, value) {
      if (canceled) return;
      running -= 1;

      if (err) {
        done = true;
        callback(err);
      } else if (err === false) {
        done = true;
        canceled = true;
      } else if (value === breakLoop || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }

    function replenish() {
      looping = true;

      while (running < limit && !done) {
        var elem = nextElem();

        if (elem === null) {
          done = true;

          if (running <= 0) {
            callback(null);
          }

          return;
        }

        running += 1;
        iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
      }

      looping = false;
    }

    replenish();
  };
};
/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 */


function eachOfLimit$1(coll, limit, iteratee, callback) {
  return eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
}

var eachOfLimit$2 = awaitify(eachOfLimit$1, 4); // eachOf implementation optimized for array-likes

function eachOfArrayLike(coll, iteratee, callback) {
  callback = once(callback);
  var index = 0,
      completed = 0,
      {
    length
  } = coll,
      canceled = false;

  if (length === 0) {
    callback(null);
  }

  function iteratorCallback(err, value) {
    if (err === false) {
      canceled = true;
    }

    if (canceled === true) return;

    if (err) {
      callback(err);
    } else if (++completed === length || value === breakLoop) {
      callback(null);
    }
  }

  for (; index < length; index++) {
    iteratee(coll[index], index, onlyOnce(iteratorCallback));
  }
} // a generic version of eachOf which can handle array, object, and iterator cases.


function eachOfGeneric(coll, iteratee, callback) {
  return eachOfLimit$2(coll, Infinity, iteratee, callback);
}
/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each
 * item in `coll`.
 * The `key` is the item's key, or index in the case of an array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 * @example
 *
 * // dev.json is a file containing a valid json object config for dev environment
 * // dev.json is a file containing a valid json object config for test environment
 * // prod.json is a file containing a valid json object config for prod environment
 * // invalid.json is a file with a malformed json object
 *
 * let configs = {}; //global variable
 * let validConfigFileMap = {dev: 'dev.json', test: 'test.json', prod: 'prod.json'};
 * let invalidConfigFileMap = {dev: 'dev.json', test: 'test.json', invalid: 'invalid.json'};
 *
 * // asynchronous function that reads a json file and parses the contents as json object
 * function parseFile(file, key, callback) {
 *     fs.readFile(file, "utf8", function(err, data) {
 *         if (err) return calback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }
 *
 * // Using callbacks
 * async.forEachOf(validConfigFileMap, parseFile, function (err) {
 *     if (err) {
 *         console.error(err);
 *     } else {
 *         console.log(configs);
 *         // configs is now a map of JSON data, e.g.
 *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
 *     }
 * });
 *
 * //Error handing
 * async.forEachOf(invalidConfigFileMap, parseFile, function (err) {
 *     if (err) {
 *         console.error(err);
 *         // JSON parse error exception
 *     } else {
 *         console.log(configs);
 *     }
 * });
 *
 * // Using Promises
 * async.forEachOf(validConfigFileMap, parseFile)
 * .then( () => {
 *     console.log(configs);
 *     // configs is now a map of JSON data, e.g.
 *     // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
 * }).catch( err => {
 *     console.error(err);
 * });
 *
 * //Error handing
 * async.forEachOf(invalidConfigFileMap, parseFile)
 * .then( () => {
 *     console.log(configs);
 * }).catch( err => {
 *     console.error(err);
 *     // JSON parse error exception
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.forEachOf(validConfigFileMap, parseFile);
 *         console.log(configs);
 *         // configs is now a map of JSON data, e.g.
 *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * //Error handing
 * async () => {
 *     try {
 *         let result = await async.forEachOf(invalidConfigFileMap, parseFile);
 *         console.log(configs);
 *     }
 *     catch (err) {
 *         console.log(err);
 *         // JSON parse error exception
 *     }
 * }
 *
 */


function eachOf(coll, iteratee, callback) {
  var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
  return eachOfImplementation(coll, wrapAsync(iteratee), callback);
}

var eachOf$1 = awaitify(eachOf, 3);
/**
 * Produces a new collection of values by mapping each value in `coll` through
 * the `iteratee` function. The `iteratee` is called with an item from `coll`
 * and a callback for when it has finished processing. Each of these callbacks
 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
 * `iteratee` passes an error to its callback, the main `callback` (for the
 * `map` function) is immediately called with the error.
 *
 * Note, that since this function applies the `iteratee` to each item in
 * parallel, there is no guarantee that the `iteratee` functions will complete
 * in order. However, the results array will be in the same order as the
 * original `coll`.
 *
 * If `map` is passed an Object, the results will be an Array.  The results
 * will roughly be in the order of the original Objects' keys (but this can
 * vary across JavaScript engines).
 *
 * @name map
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an Array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * // file1.txt is a file that is 1000 bytes in size
 * // file2.txt is a file that is 2000 bytes in size
 * // file3.txt is a file that is 3000 bytes in size
 * // file4.txt does not exist
 *
 * const fileList = ['file1.txt','file2.txt','file3.txt'];
 * const withMissingFileList = ['file1.txt','file2.txt','file4.txt'];
 *
 * // asynchronous function that returns the file size in bytes
 * function getFileSizeInBytes(file, callback) {
 *     fs.stat(file, function(err, stat) {
 *         if (err) {
 *             return callback(err);
 *         }
 *         callback(null, stat.size);
 *     });
 * }
 *
 * // Using callbacks
 * async.map(fileList, getFileSizeInBytes, function(err, results) {
 *     if (err) {
 *         console.log(err);
 *     } else {
 *         console.log(results);
 *         // results is now an array of the file size in bytes for each file, e.g.
 *         // [ 1000, 2000, 3000]
 *     }
 * });
 *
 * // Error Handling
 * async.map(withMissingFileList, getFileSizeInBytes, function(err, results) {
 *     if (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     } else {
 *         console.log(results);
 *     }
 * });
 *
 * // Using Promises
 * async.map(fileList, getFileSizeInBytes)
 * .then( results => {
 *     console.log(results);
 *     // results is now an array of the file size in bytes for each file, e.g.
 *     // [ 1000, 2000, 3000]
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Error Handling
 * async.map(withMissingFileList, getFileSizeInBytes)
 * .then( results => {
 *     console.log(results);
 * }).catch( err => {
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let results = await async.map(fileList, getFileSizeInBytes);
 *         console.log(results);
 *         // results is now an array of the file size in bytes for each file, e.g.
 *         // [ 1000, 2000, 3000]
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // Error Handling
 * async () => {
 *     try {
 *         let results = await async.map(withMissingFileList, getFileSizeInBytes);
 *         console.log(results);
 *     }
 *     catch (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     }
 * }
 *
 */

function map(coll, iteratee, callback) {
  return _asyncMap(eachOf$1, coll, iteratee, callback);
}

var map$1 = awaitify(map, 3);
/**
 * Applies the provided arguments to each function in the array, calling
 * `callback` after all functions have completed. If you only provide the first
 * argument, `fns`, then it will return a function which lets you pass in the
 * arguments as if it were a single function call. If more arguments are
 * provided, `callback` is required while `args` is still optional. The results
 * for each of the applied async functions are passed to the final callback
 * as an array.
 *
 * @name applyEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|AsyncIterable|Object} fns - A collection of {@link AsyncFunction}s
 * to all call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {AsyncFunction} - Returns a function that takes no args other than
 * an optional callback, that is the result of applying the `args` to each
 * of the functions.
 * @example
 *
 * const appliedFn = async.applyEach([enableSearch, updateSchema], 'bucket')
 *
 * appliedFn((err, results) => {
 *     // results[0] is the results for `enableSearch`
 *     // results[1] is the results for `updateSchema`
 * });
 *
 * // partial application example:
 * async.each(
 *     buckets,
 *     async (bucket) => async.applyEach([enableSearch, updateSchema], bucket)(),
 *     callback
 * );
 */

var applyEach$1 = applyEach(map$1);
/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
 *
 * @name eachOfSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfSeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 */

function eachOfSeries(coll, iteratee, callback) {
  return eachOfLimit$2(coll, 1, iteratee, callback);
}

var eachOfSeries$1 = awaitify(eachOfSeries, 3);
/**
 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
 *
 * @name mapSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */

function mapSeries(coll, iteratee, callback) {
  return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
}

var mapSeries$1 = awaitify(mapSeries, 3);
/**
 * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
 *
 * @name applyEachSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.applyEach]{@link module:ControlFlow.applyEach}
 * @category Control Flow
 * @param {Array|Iterable|AsyncIterable|Object} fns - A collection of {@link AsyncFunction}s to all
 * call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {AsyncFunction} - A function, that when called, is the result of
 * appling the `args` to the list of functions.  It takes no args, other than
 * a callback.
 */

var applyEachSeries = applyEach(mapSeries$1);
const PROMISE_SYMBOL = Symbol('promiseCallback');

function promiseCallback() {
  let resolve, reject;

  function callback(err, ...args) {
    if (err) return reject(err);
    resolve(args.length > 1 ? args : args[0]);
  }

  callback[PROMISE_SYMBOL] = new Promise((res, rej) => {
    resolve = res, reject = rej;
  });
  return callback;
}
/**
 * Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
 * their requirements. Each function can optionally depend on other functions
 * being completed first, and each function is run as soon as its requirements
 * are satisfied.
 *
 * If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
 * will stop. Further tasks will not execute (so any other functions depending
 * on it will not run), and the main `callback` is immediately called with the
 * error.
 *
 * {@link AsyncFunction}s also receive an object containing the results of functions which
 * have completed so far as the first argument, if they have dependencies. If a
 * task function has no dependencies, it will only be passed a callback.
 *
 * @name auto
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object} tasks - An object. Each of its properties is either a
 * function or an array of requirements, with the {@link AsyncFunction} itself the last item
 * in the array. The object's key of a property serves as the name of the task
 * defined by that property, i.e. can be used when specifying requirements for
 * other tasks. The function receives one or two arguments:
 * * a `results` object, containing the results of the previously executed
 *   functions, only passed if the task has any dependencies,
 * * a `callback(err, result)` function, which must be called when finished,
 *   passing an `error` (which can be `null`) and the result of the function's
 *   execution.
 * @param {number} [concurrency=Infinity] - An optional `integer` for
 * determining the maximum number of tasks that can be run in parallel. By
 * default, as many as possible.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback. Results are always returned; however, if an
 * error occurs, no further `tasks` will be performed, and the results object
 * will only contain partial results. Invoked with (err, results).
 * @returns {Promise} a promise, if a callback is not passed
 * @example
 *
 * //Using Callbacks
 * async.auto({
 *     get_data: function(callback) {
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: ['get_data', 'make_folder', function(results, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(results, callback) {
 *         // once the file is written let's email a link to it...
 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *     }]
 * }, function(err, results) {
 *     if (err) {
 *         console.log('err = ', err);
 *     }
 *     console.log('results = ', results);
 *     // results = {
 *     //     get_data: ['data', 'converted to array']
 *     //     make_folder; 'folder',
 *     //     write_file: 'filename'
 *     //     email_link: { file: 'filename', email: 'user@example.com' }
 *     // }
 * });
 *
 * //Using Promises
 * async.auto({
 *     get_data: function(callback) {
 *         console.log('in get_data');
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         console.log('in make_folder');
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: ['get_data', 'make_folder', function(results, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(results, callback) {
 *         // once the file is written let's email a link to it...
 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *     }]
 * }).then(results => {
 *     console.log('results = ', results);
 *     // results = {
 *     //     get_data: ['data', 'converted to array']
 *     //     make_folder; 'folder',
 *     //     write_file: 'filename'
 *     //     email_link: { file: 'filename', email: 'user@example.com' }
 *     // }
 * }).catch(err => {
 *     console.log('err = ', err);
 * });
 *
 * //Using async/await
 * async () => {
 *     try {
 *         let results = await async.auto({
 *             get_data: function(callback) {
 *                 // async code to get some data
 *                 callback(null, 'data', 'converted to array');
 *             },
 *             make_folder: function(callback) {
 *                 // async code to create a directory to store a file in
 *                 // this is run at the same time as getting the data
 *                 callback(null, 'folder');
 *             },
 *             write_file: ['get_data', 'make_folder', function(results, callback) {
 *                 // once there is some data and the directory exists,
 *                 // write the data to a file in the directory
 *                 callback(null, 'filename');
 *             }],
 *             email_link: ['write_file', function(results, callback) {
 *                 // once the file is written let's email a link to it...
 *                 callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *             }]
 *         });
 *         console.log('results = ', results);
 *         // results = {
 *         //     get_data: ['data', 'converted to array']
 *         //     make_folder; 'folder',
 *         //     write_file: 'filename'
 *         //     email_link: { file: 'filename', email: 'user@example.com' }
 *         // }
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function auto(tasks, concurrency, callback) {
  if (typeof concurrency !== 'number') {
    // concurrency is optional, shift the args.
    callback = concurrency;
    concurrency = null;
  }

  callback = once(callback || promiseCallback());
  var numTasks = Object.keys(tasks).length;

  if (!numTasks) {
    return callback(null);
  }

  if (!concurrency) {
    concurrency = numTasks;
  }

  var results = {};
  var runningTasks = 0;
  var canceled = false;
  var hasError = false;
  var listeners = Object.create(null);
  var readyTasks = []; // for cycle detection:

  var readyToCheck = []; // tasks that have been identified as reachable
  // without the possibility of returning to an ancestor task

  var uncheckedDependencies = {};
  Object.keys(tasks).forEach(key => {
    var task = tasks[key];

    if (!Array.isArray(task)) {
      // no dependencies
      enqueueTask(key, [task]);
      readyToCheck.push(key);
      return;
    }

    var dependencies = task.slice(0, task.length - 1);
    var remainingDependencies = dependencies.length;

    if (remainingDependencies === 0) {
      enqueueTask(key, task);
      readyToCheck.push(key);
      return;
    }

    uncheckedDependencies[key] = remainingDependencies;
    dependencies.forEach(dependencyName => {
      if (!tasks[dependencyName]) {
        throw new Error('async.auto task `' + key + '` has a non-existent dependency `' + dependencyName + '` in ' + dependencies.join(', '));
      }

      addListener(dependencyName, () => {
        remainingDependencies--;

        if (remainingDependencies === 0) {
          enqueueTask(key, task);
        }
      });
    });
  });
  checkForDeadlocks();
  processQueue();

  function enqueueTask(key, task) {
    readyTasks.push(() => runTask(key, task));
  }

  function processQueue() {
    if (canceled) return;

    if (readyTasks.length === 0 && runningTasks === 0) {
      return callback(null, results);
    }

    while (readyTasks.length && runningTasks < concurrency) {
      var run = readyTasks.shift();
      run();
    }
  }

  function addListener(taskName, fn) {
    var taskListeners = listeners[taskName];

    if (!taskListeners) {
      taskListeners = listeners[taskName] = [];
    }

    taskListeners.push(fn);
  }

  function taskComplete(taskName) {
    var taskListeners = listeners[taskName] || [];
    taskListeners.forEach(fn => fn());
    processQueue();
  }

  function runTask(key, task) {
    if (hasError) return;
    var taskCallback = onlyOnce((err, ...result) => {
      runningTasks--;

      if (err === false) {
        canceled = true;
        return;
      }

      if (result.length < 2) {
        [result] = result;
      }

      if (err) {
        var safeResults = {};
        Object.keys(results).forEach(rkey => {
          safeResults[rkey] = results[rkey];
        });
        safeResults[key] = result;
        hasError = true;
        listeners = Object.create(null);
        if (canceled) return;
        callback(err, safeResults);
      } else {
        results[key] = result;
        taskComplete(key);
      }
    });
    runningTasks++;
    var taskFn = wrapAsync(task[task.length - 1]);

    if (task.length > 1) {
      taskFn(results, taskCallback);
    } else {
      taskFn(taskCallback);
    }
  }

  function checkForDeadlocks() {
    // Kahn's algorithm
    // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
    // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
    var currentTask;
    var counter = 0;

    while (readyToCheck.length) {
      currentTask = readyToCheck.pop();
      counter++;
      getDependents(currentTask).forEach(dependent => {
        if (--uncheckedDependencies[dependent] === 0) {
          readyToCheck.push(dependent);
        }
      });
    }

    if (counter !== numTasks) {
      throw new Error('async.auto cannot execute tasks due to a recursive dependency');
    }
  }

  function getDependents(taskName) {
    var result = [];
    Object.keys(tasks).forEach(key => {
      const task = tasks[key];

      if (Array.isArray(task) && task.indexOf(taskName) >= 0) {
        result.push(key);
      }
    });
    return result;
  }

  return callback[PROMISE_SYMBOL];
}

var FN_ARGS = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;
var ARROW_FN_ARGS = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;

function stripComments(string) {
  let stripped = '';
  let index = 0;
  let endBlockComment = string.indexOf('*/');

  while (index < string.length) {
    if (string[index] === '/' && string[index + 1] === '/') {
      // inline comment
      let endIndex = string.indexOf('\n', index);
      index = endIndex === -1 ? string.length : endIndex;
    } else if (endBlockComment !== -1 && string[index] === '/' && string[index + 1] === '*') {
      // block comment
      let endIndex = string.indexOf('*/', index);

      if (endIndex !== -1) {
        index = endIndex + 2;
        endBlockComment = string.indexOf('*/', index);
      } else {
        stripped += string[index];
        index++;
      }
    } else {
      stripped += string[index];
      index++;
    }
  }

  return stripped;
}

function parseParams(func) {
  const src = stripComments(func.toString());
  let match = src.match(FN_ARGS);

  if (!match) {
    match = src.match(ARROW_FN_ARGS);
  }

  if (!match) throw new Error('could not parse args in autoInject\nSource:\n' + src);
  let [, args] = match;
  return args.replace(/\s/g, '').split(FN_ARG_SPLIT).map(arg => arg.replace(FN_ARG, '').trim());
}
/**
 * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
 * tasks are specified as parameters to the function, after the usual callback
 * parameter, with the parameter names matching the names of the tasks it
 * depends on. This can provide even more readable task graphs which can be
 * easier to maintain.
 *
 * If a final callback is specified, the task results are similarly injected,
 * specified as named parameters after the initial error parameter.
 *
 * The autoInject function is purely syntactic sugar and its semantics are
 * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
 *
 * @name autoInject
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.auto]{@link module:ControlFlow.auto}
 * @category Control Flow
 * @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
 * the form 'func([dependencies...], callback). The object's key of a property
 * serves as the name of the task defined by that property, i.e. can be used
 * when specifying requirements for other tasks.
 * * The `callback` parameter is a `callback(err, result)` which must be called
 *   when finished, passing an `error` (which can be `null`) and the result of
 *   the function's execution. The remaining parameters name other tasks on
 *   which the task is dependent, and the results from those tasks are the
 *   arguments of those parameters.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback, and a `results` object with any completed
 * task results, similar to `auto`.
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * //  The example from `auto` can be rewritten as follows:
 * async.autoInject({
 *     get_data: function(callback) {
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: function(get_data, make_folder, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     },
 *     email_link: function(write_file, callback) {
 *         // once the file is written let's email a link to it...
 *         // write_file contains the filename returned by write_file.
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 *
 * // If you are using a JS minifier that mangles parameter names, `autoInject`
 * // will not work with plain functions, since the parameter names will be
 * // collapsed to a single letter identifier.  To work around this, you can
 * // explicitly specify the names of the parameters your task function needs
 * // in an array, similar to Angular.js dependency injection.
 *
 * // This still has an advantage over plain `auto`, since the results a task
 * // depends on are still spread into arguments.
 * async.autoInject({
 *     //...
 *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(write_file, callback) {
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }]
 *     //...
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 */


function autoInject(tasks, callback) {
  var newTasks = {};
  Object.keys(tasks).forEach(key => {
    var taskFn = tasks[key];
    var params;
    var fnIsAsync = isAsync(taskFn);
    var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;

    if (Array.isArray(taskFn)) {
      params = [...taskFn];
      taskFn = params.pop();
      newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
    } else if (hasNoDeps) {
      // no dependencies, use the function as-is
      newTasks[key] = taskFn;
    } else {
      params = parseParams(taskFn);

      if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
        throw new Error("autoInject task functions require explicit parameters.");
      } // remove callback param


      if (!fnIsAsync) params.pop();
      newTasks[key] = params.concat(newTask);
    }

    function newTask(results, taskCb) {
      var newArgs = params.map(name => results[name]);
      newArgs.push(taskCb);
      wrapAsync(taskFn)(...newArgs);
    }
  });
  return auto(newTasks, callback);
} // Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.


class DLL {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }

  removeLink(node) {
    if (node.prev) node.prev.next = node.next;else this.head = node.next;
    if (node.next) node.next.prev = node.prev;else this.tail = node.prev;
    node.prev = node.next = null;
    this.length -= 1;
    return node;
  }

  empty() {
    while (this.head) this.shift();

    return this;
  }

  insertAfter(node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) node.next.prev = newNode;else this.tail = newNode;
    node.next = newNode;
    this.length += 1;
  }

  insertBefore(node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;else this.head = newNode;
    node.prev = newNode;
    this.length += 1;
  }

  unshift(node) {
    if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
  }

  push(node) {
    if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
  }

  shift() {
    return this.head && this.removeLink(this.head);
  }

  pop() {
    return this.tail && this.removeLink(this.tail);
  }

  toArray() {
    return [...this];
  }

  *[Symbol.iterator]() {
    var cur = this.head;

    while (cur) {
      yield cur.data;
      cur = cur.next;
    }
  }

  remove(testFn) {
    var curr = this.head;

    while (curr) {
      var {
        next
      } = curr;

      if (testFn(curr)) {
        this.removeLink(curr);
      }

      curr = next;
    }

    return this;
  }

}

function setInitial(dll, node) {
  dll.length = 1;
  dll.head = dll.tail = node;
}

function queue(worker, concurrency, payload) {
  if (concurrency == null) {
    concurrency = 1;
  } else if (concurrency === 0) {
    throw new RangeError('Concurrency must not be zero');
  }

  var _worker = wrapAsync(worker);

  var numRunning = 0;
  var workersList = [];
  const events = {
    error: [],
    drain: [],
    saturated: [],
    unsaturated: [],
    empty: []
  };

  function on(event, handler) {
    events[event].push(handler);
  }

  function once(event, handler) {
    const handleAndRemove = (...args) => {
      off(event, handleAndRemove);
      handler(...args);
    };

    events[event].push(handleAndRemove);
  }

  function off(event, handler) {
    if (!event) return Object.keys(events).forEach(ev => events[ev] = []);
    if (!handler) return events[event] = [];
    events[event] = events[event].filter(ev => ev !== handler);
  }

  function trigger(event, ...args) {
    events[event].forEach(handler => handler(...args));
  }

  var processingScheduled = false;

  function _insert(data, insertAtFront, rejectOnError, callback) {
    if (callback != null && typeof callback !== 'function') {
      throw new Error('task callback must be a function');
    }

    q.started = true;
    var res, rej;

    function promiseCallback(err, ...args) {
      // we don't care about the error, let the global error handler
      // deal with it
      if (err) return rejectOnError ? rej(err) : res();
      if (args.length <= 1) return res(args[0]);
      res(args);
    }

    var item = {
      data,
      callback: rejectOnError ? promiseCallback : callback || promiseCallback
    };

    if (insertAtFront) {
      q._tasks.unshift(item);
    } else {
      q._tasks.push(item);
    }

    if (!processingScheduled) {
      processingScheduled = true;
      setImmediate$1(() => {
        processingScheduled = false;
        q.process();
      });
    }

    if (rejectOnError || !callback) {
      return new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
    }
  }

  function _createCB(tasks) {
    return function (err, ...args) {
      numRunning -= 1;

      for (var i = 0, l = tasks.length; i < l; i++) {
        var task = tasks[i];
        var index = workersList.indexOf(task);

        if (index === 0) {
          workersList.shift();
        } else if (index > 0) {
          workersList.splice(index, 1);
        }

        task.callback(err, ...args);

        if (err != null) {
          trigger('error', err, task.data);
        }
      }

      if (numRunning <= q.concurrency - q.buffer) {
        trigger('unsaturated');
      }

      if (q.idle()) {
        trigger('drain');
      }

      q.process();
    };
  }

  function _maybeDrain(data) {
    if (data.length === 0 && q.idle()) {
      // call drain immediately if there are no tasks
      setImmediate$1(() => trigger('drain'));
      return true;
    }

    return false;
  }

  const eventMethod = name => handler => {
    if (!handler) {
      return new Promise((resolve, reject) => {
        once(name, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    }

    off(name);
    on(name, handler);
  };

  var isProcessing = false;
  var q = {
    _tasks: new DLL(),

    *[Symbol.iterator]() {
      yield* q._tasks[Symbol.iterator]();
    },

    concurrency,
    payload,
    buffer: concurrency / 4,
    started: false,
    paused: false,

    push(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data)) return;
        return data.map(datum => _insert(datum, false, false, callback));
      }

      return _insert(data, false, false, callback);
    },

    pushAsync(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data)) return;
        return data.map(datum => _insert(datum, false, true, callback));
      }

      return _insert(data, false, true, callback);
    },

    kill() {
      off();

      q._tasks.empty();
    },

    unshift(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data)) return;
        return data.map(datum => _insert(datum, true, false, callback));
      }

      return _insert(data, true, false, callback);
    },

    unshiftAsync(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data)) return;
        return data.map(datum => _insert(datum, true, true, callback));
      }

      return _insert(data, true, true, callback);
    },

    remove(testFn) {
      q._tasks.remove(testFn);
    },

    process() {
      // Avoid trying to start too many processing operations. This can occur
      // when callbacks resolve synchronously (#1267).
      if (isProcessing) {
        return;
      }

      isProcessing = true;

      while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
        var tasks = [],
            data = [];
        var l = q._tasks.length;
        if (q.payload) l = Math.min(l, q.payload);

        for (var i = 0; i < l; i++) {
          var node = q._tasks.shift();

          tasks.push(node);
          workersList.push(node);
          data.push(node.data);
        }

        numRunning += 1;

        if (q._tasks.length === 0) {
          trigger('empty');
        }

        if (numRunning === q.concurrency) {
          trigger('saturated');
        }

        var cb = onlyOnce(_createCB(tasks));

        _worker(data, cb);
      }

      isProcessing = false;
    },

    length() {
      return q._tasks.length;
    },

    running() {
      return numRunning;
    },

    workersList() {
      return workersList;
    },

    idle() {
      return q._tasks.length + numRunning === 0;
    },

    pause() {
      q.paused = true;
    },

    resume() {
      if (q.paused === false) {
        return;
      }

      q.paused = false;
      setImmediate$1(q.process);
    }

  }; // define these as fixed properties, so people get useful errors when updating

  Object.defineProperties(q, {
    saturated: {
      writable: false,
      value: eventMethod('saturated')
    },
    unsaturated: {
      writable: false,
      value: eventMethod('unsaturated')
    },
    empty: {
      writable: false,
      value: eventMethod('empty')
    },
    drain: {
      writable: false,
      value: eventMethod('drain')
    },
    error: {
      writable: false,
      value: eventMethod('error')
    }
  });
  return q;
}
/**
 * Creates a `cargo` object with the specified payload. Tasks added to the
 * cargo will be processed altogether (up to the `payload` limit). If the
 * `worker` is in progress, the task is queued until it becomes available. Once
 * the `worker` has completed some tasks, each callback of those tasks is
 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
 * for how `cargo` and `queue` work.
 *
 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
 * at a time, cargo passes an array of tasks to a single worker, repeating
 * when the worker is finished.
 *
 * @name cargo
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {AsyncFunction} worker - An asynchronous function for processing an array
 * of queued tasks. Invoked with `(tasks, callback)`.
 * @param {number} [payload=Infinity] - An optional `integer` for determining
 * how many tasks should be processed per round; if omitted, the default is
 * unlimited.
 * @returns {module:ControlFlow.QueueObject} A cargo object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the cargo and inner queue.
 * @example
 *
 * // create a cargo object with payload 2
 * var cargo = async.cargo(function(tasks, callback) {
 *     for (var i=0; i<tasks.length; i++) {
 *         console.log('hello ' + tasks[i].name);
 *     }
 *     callback();
 * }, 2);
 *
 * // add some items
 * cargo.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * cargo.push({name: 'bar'}, function(err) {
 *     console.log('finished processing bar');
 * });
 * await cargo.push({name: 'baz'});
 * console.log('finished processing baz');
 */


function cargo(worker, payload) {
  return queue(worker, 1, payload);
}
/**
 * Creates a `cargoQueue` object with the specified payload. Tasks added to the
 * cargoQueue will be processed together (up to the `payload` limit) in `concurrency` parallel workers.
 * If the all `workers` are in progress, the task is queued until one becomes available. Once
 * a `worker` has completed some tasks, each callback of those tasks is
 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
 * for how `cargo` and `queue` work.
 *
 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
 * at a time, and [`cargo`]{@link module:ControlFlow.cargo} passes an array of tasks to a single worker,
 * the cargoQueue passes an array of tasks to multiple parallel workers.
 *
 * @name cargoQueue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @see [async.cargo]{@link module:ControlFLow.cargo}
 * @category Control Flow
 * @param {AsyncFunction} worker - An asynchronous function for processing an array
 * of queued tasks. Invoked with `(tasks, callback)`.
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @param {number} [payload=Infinity] - An optional `integer` for determining
 * how many tasks should be processed per round; if omitted, the default is
 * unlimited.
 * @returns {module:ControlFlow.QueueObject} A cargoQueue object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the cargoQueue and inner queue.
 * @example
 *
 * // create a cargoQueue object with payload 2 and concurrency 2
 * var cargoQueue = async.cargoQueue(function(tasks, callback) {
 *     for (var i=0; i<tasks.length; i++) {
 *         console.log('hello ' + tasks[i].name);
 *     }
 *     callback();
 * }, 2, 2);
 *
 * // add some items
 * cargoQueue.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * cargoQueue.push({name: 'bar'}, function(err) {
 *     console.log('finished processing bar');
 * });
 * cargoQueue.push({name: 'baz'}, function(err) {
 *     console.log('finished processing baz');
 * });
 * cargoQueue.push({name: 'boo'}, function(err) {
 *     console.log('finished processing boo');
 * });
 */


function cargo$1(worker, concurrency, payload) {
  return queue(worker, concurrency, payload);
}
/**
 * Reduces `coll` into a single value using an async `iteratee` to return each
 * successive step. `memo` is the initial state of the reduction. This function
 * only operates in series.
 *
 * For performance reasons, it may make sense to split a call to this function
 * into a parallel map, and then use the normal `Array.prototype.reduce` on the
 * results. This function is for situations where each step in the reduction
 * needs to be async; if you can get the data before reducing it, then it's
 * probably a good idea to do so.
 *
 * @name reduce
 * @static
 * @memberOf module:Collections
 * @method
 * @alias inject
 * @alias foldl
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {AsyncFunction} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction.
 * The `iteratee` should complete with the next state of the reduction.
 * If the iteratee completes with an error, the reduction is stopped and the
 * main `callback` is immediately called with the error.
 * Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * // file1.txt is a file that is 1000 bytes in size
 * // file2.txt is a file that is 2000 bytes in size
 * // file3.txt is a file that is 3000 bytes in size
 * // file4.txt does not exist
 *
 * const fileList = ['file1.txt','file2.txt','file3.txt'];
 * const withMissingFileList = ['file1.txt','file2.txt','file3.txt', 'file4.txt'];
 *
 * // asynchronous function that computes the file size in bytes
 * // file size is added to the memoized value, then returned
 * function getFileSizeInBytes(memo, file, callback) {
 *     fs.stat(file, function(err, stat) {
 *         if (err) {
 *             return callback(err);
 *         }
 *         callback(null, memo + stat.size);
 *     });
 * }
 *
 * // Using callbacks
 * async.reduce(fileList, 0, getFileSizeInBytes, function(err, result) {
 *     if (err) {
 *         console.log(err);
 *     } else {
 *         console.log(result);
 *         // 6000
 *         // which is the sum of the file sizes of the three files
 *     }
 * });
 *
 * // Error Handling
 * async.reduce(withMissingFileList, 0, getFileSizeInBytes, function(err, result) {
 *     if (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     } else {
 *         console.log(result);
 *     }
 * });
 *
 * // Using Promises
 * async.reduce(fileList, 0, getFileSizeInBytes)
 * .then( result => {
 *     console.log(result);
 *     // 6000
 *     // which is the sum of the file sizes of the three files
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Error Handling
 * async.reduce(withMissingFileList, 0, getFileSizeInBytes)
 * .then( result => {
 *     console.log(result);
 * }).catch( err => {
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.reduce(fileList, 0, getFileSizeInBytes);
 *         console.log(result);
 *         // 6000
 *         // which is the sum of the file sizes of the three files
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // Error Handling
 * async () => {
 *     try {
 *         let result = await async.reduce(withMissingFileList, 0, getFileSizeInBytes);
 *         console.log(result);
 *     }
 *     catch (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     }
 * }
 *
 */


function reduce(coll, memo, iteratee, callback) {
  callback = once(callback);

  var _iteratee = wrapAsync(iteratee);

  return eachOfSeries$1(coll, (x, i, iterCb) => {
    _iteratee(memo, x, (err, v) => {
      memo = v;
      iterCb(err);
    });
  }, err => callback(err, memo));
}

var reduce$1 = awaitify(reduce, 4);
/**
 * Version of the compose function that is more natural to read. Each function
 * consumes the return value of the previous function. It is the equivalent of
 * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name seq
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.compose]{@link module:ControlFlow.compose}
 * @category Control Flow
 * @param {...AsyncFunction} functions - the asynchronous functions to compose
 * @returns {Function} a function that composes the `functions` in order
 * @example
 *
 * // Requires lodash (or underscore), express3 and dresende's orm2.
 * // Part of an app, that fetches cats of the logged user.
 * // This example uses `seq` function to avoid overnesting and error
 * // handling clutter.
 * app.get('/cats', function(request, response) {
 *     var User = request.models.User;
 *     async.seq(
 *         User.get.bind(User),  // 'User.get' has signature (id, callback(err, data))
 *         function(user, fn) {
 *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
 *         }
 *     )(req.session.user_id, function (err, cats) {
 *         if (err) {
 *             console.error(err);
 *             response.json({ status: 'error', message: err.message });
 *         } else {
 *             response.json({ status: 'ok', message: 'Cats found', data: cats });
 *         }
 *     });
 * });
 */

function seq(...functions) {
  var _functions = functions.map(wrapAsync);

  return function (...args) {
    var that = this;
    var cb = args[args.length - 1];

    if (typeof cb == 'function') {
      args.pop();
    } else {
      cb = promiseCallback();
    }

    reduce$1(_functions, args, (newargs, fn, iterCb) => {
      fn.apply(that, newargs.concat((err, ...nextargs) => {
        iterCb(err, nextargs);
      }));
    }, (err, results) => cb(err, ...results));
    return cb[PROMISE_SYMBOL];
  };
}
/**
 * Creates a function which is a composition of the passed asynchronous
 * functions. Each function consumes the return value of the function that
 * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
 * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
 *
 * If the last argument to the composed function is not a function, a promise
 * is returned when you call it.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name compose
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {...AsyncFunction} functions - the asynchronous functions to compose
 * @returns {Function} an asynchronous function that is the composed
 * asynchronous `functions`
 * @example
 *
 * function add1(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n + 1);
 *     }, 10);
 * }
 *
 * function mul3(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n * 3);
 *     }, 10);
 * }
 *
 * var add1mul3 = async.compose(mul3, add1);
 * add1mul3(4, function (err, result) {
 *     // result now equals 15
 * });
 */


function compose(...args) {
  return seq(...args.reverse());
}
/**
 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
 *
 * @name mapLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */


function mapLimit(coll, limit, iteratee, callback) {
  return _asyncMap(eachOfLimit(limit), coll, iteratee, callback);
}

var mapLimit$1 = awaitify(mapLimit, 4);
/**
 * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
 *
 * @name concatLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @alias flatMapLimit
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
 * which should use an array as its result. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @returns A Promise, if no callback is passed
 */

function concatLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);

  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, ...args) => {
      if (err) return iterCb(err);
      return iterCb(err, args);
    });
  }, (err, mapResults) => {
    var result = [];

    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        result = result.concat(...mapResults[i]);
      }
    }

    return callback(err, result);
  });
}

var concatLimit$1 = awaitify(concatLimit, 4);
/**
 * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
 * the concatenated list. The `iteratee`s are called in parallel, and the
 * results are concatenated as they return. The results array will be returned in
 * the original order of `coll` passed to the `iteratee` function.
 *
 * @name concat
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @alias flatMap
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
 * which should use an array as its result. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @returns A Promise, if no callback is passed
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 * // dir4 does not exist
 *
 * let directoryList = ['dir1','dir2','dir3'];
 * let withMissingDirectoryList = ['dir1','dir2','dir3', 'dir4'];
 *
 * // Using callbacks
 * async.concat(directoryList, fs.readdir, function(err, results) {
 *    if (err) {
 *        console.log(err);
 *    } else {
 *        console.log(results);
 *        // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
 *    }
 * });
 *
 * // Error Handling
 * async.concat(withMissingDirectoryList, fs.readdir, function(err, results) {
 *    if (err) {
 *        console.log(err);
 *        // [ Error: ENOENT: no such file or directory ]
 *        // since dir4 does not exist
 *    } else {
 *        console.log(results);
 *    }
 * });
 *
 * // Using Promises
 * async.concat(directoryList, fs.readdir)
 * .then(results => {
 *     console.log(results);
 *     // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
 * }).catch(err => {
 *      console.log(err);
 * });
 *
 * // Error Handling
 * async.concat(withMissingDirectoryList, fs.readdir)
 * .then(results => {
 *     console.log(results);
 * }).catch(err => {
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 *     // since dir4 does not exist
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let results = await async.concat(directoryList, fs.readdir);
 *         console.log(results);
 *         // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
 *     } catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // Error Handling
 * async () => {
 *     try {
 *         let results = await async.concat(withMissingDirectoryList, fs.readdir);
 *         console.log(results);
 *     } catch (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *         // since dir4 does not exist
 *     }
 * }
 *
 */

function concat(coll, iteratee, callback) {
  return concatLimit$1(coll, Infinity, iteratee, callback);
}

var concat$1 = awaitify(concat, 3);
/**
 * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
 *
 * @name concatSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @alias flatMapSeries
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
 * The iteratee should complete with an array an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @returns A Promise, if no callback is passed
 */

function concatSeries(coll, iteratee, callback) {
  return concatLimit$1(coll, 1, iteratee, callback);
}

var concatSeries$1 = awaitify(concatSeries, 3);
/**
 * Returns a function that when called, calls-back with the values provided.
 * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
 * [`auto`]{@link module:ControlFlow.auto}.
 *
 * @name constant
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {...*} arguments... - Any number of arguments to automatically invoke
 * callback with.
 * @returns {AsyncFunction} Returns a function that when invoked, automatically
 * invokes the callback with the previous given arguments.
 * @example
 *
 * async.waterfall([
 *     async.constant(42),
 *     function (value, next) {
 *         // value === 42
 *     },
 *     //...
 * ], callback);
 *
 * async.waterfall([
 *     async.constant(filename, "utf8"),
 *     fs.readFile,
 *     function (fileData, next) {
 *         //...
 *     }
 *     //...
 * ], callback);
 *
 * async.auto({
 *     hostname: async.constant("https://server.net/"),
 *     port: findFreePort,
 *     launchServer: ["hostname", "port", function (options, cb) {
 *         startServer(options, cb);
 *     }],
 *     //...
 * }, callback);
 */

function constant(...args) {
  return function (...ignoredArgs
  /*, callback*/
  ) {
    var callback = ignoredArgs.pop();
    return callback(null, ...args);
  };
}

function _createTester(check, getResult) {
  return (eachfn, arr, _iteratee, cb) => {
    var testPassed = false;
    var testResult;
    const iteratee = wrapAsync(_iteratee);
    eachfn(arr, (value, _, callback) => {
      iteratee(value, (err, result) => {
        if (err || err === false) return callback(err);

        if (check(result) && !testResult) {
          testPassed = true;
          testResult = getResult(true, value);
          return callback(null, breakLoop);
        }

        callback();
      });
    }, err => {
      if (err) return cb(err);
      cb(null, testPassed ? testResult : getResult(false));
    });
  };
}
/**
 * Returns the first value in `coll` that passes an async truth test. The
 * `iteratee` is applied in parallel, meaning the first iteratee to return
 * `true` will fire the detect `callback` with that result. That means the
 * result might not be the first item in the original `coll` (in terms of order)
 * that passes the test.

 * If order within the original `coll` is important, then look at
 * [`detectSeries`]{@link module:Collections.detectSeries}.
 *
 * @name detect
 * @static
 * @memberOf module:Collections
 * @method
 * @alias find
 * @category Collections
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @returns A Promise, if no callback is passed
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 *
 * // asynchronous function that checks if a file exists
 * function fileExists(file, callback) {
 *    fs.access(file, fs.constants.F_OK, (err) => {
 *        callback(null, !err);
 *    });
 * }
 *
 * async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists,
 *    function(err, result) {
 *        console.log(result);
 *        // dir1/file1.txt
 *        // result now equals the first file in the list that exists
 *    }
 *);
 *
 * // Using Promises
 * async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists)
 * .then(result => {
 *     console.log(result);
 *     // dir1/file1.txt
 *     // result now equals the first file in the list that exists
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists);
 *         console.log(result);
 *         // dir1/file1.txt
 *         // result now equals the file in the list that exists
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function detect(coll, iteratee, callback) {
  return _createTester(bool => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
}

var detect$1 = awaitify(detect, 3);
/**
 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name detectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findLimit
 * @category Collections
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @returns a Promise if no callback is passed
 */

function detectLimit(coll, limit, iteratee, callback) {
  return _createTester(bool => bool, (res, item) => item)(eachOfLimit(limit), coll, iteratee, callback);
}

var detectLimit$1 = awaitify(detectLimit, 4);
/**
 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
 *
 * @name detectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findSeries
 * @category Collections
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @returns a Promise if no callback is passed
 */

function detectSeries(coll, iteratee, callback) {
  return _createTester(bool => bool, (res, item) => item)(eachOfLimit(1), coll, iteratee, callback);
}

var detectSeries$1 = awaitify(detectSeries, 3);

function consoleFunc(name) {
  return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
    /* istanbul ignore else */
    if (typeof console === 'object') {
      /* istanbul ignore else */
      if (err) {
        /* istanbul ignore else */
        if (console.error) {
          console.error(err);
        }
      } else if (console[name]) {
        /* istanbul ignore else */
        resultArgs.forEach(x => console[name](x));
      }
    }
  });
}
/**
 * Logs the result of an [`async` function]{@link AsyncFunction} to the
 * `console` using `console.dir` to display the properties of the resulting object.
 * Only works in Node.js or in browsers that support `console.dir` and
 * `console.error` (such as FF and Chrome).
 * If multiple arguments are returned from the async function,
 * `console.dir` is called on each argument in order.
 *
 * @name dir
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} function - The function you want to eventually apply
 * all arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, {hello: name});
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.dir(hello, 'world');
 * {hello: 'world'}
 */


var dir = consoleFunc('dir');
/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - A function which is called each time `test`
 * passes. Invoked with (callback).
 * @param {AsyncFunction} test - asynchronous truth test to perform after each
 * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if no callback is passed
 */

function doWhilst(iteratee, test, callback) {
  callback = onlyOnce(callback);

  var _fn = wrapAsync(iteratee);

  var _test = wrapAsync(test);

  var results;

  function next(err, ...args) {
    if (err) return callback(err);
    if (err === false) return;
    results = args;

    _test(...args, check);
  }

  function check(err, truth) {
    if (err) return callback(err);
    if (err === false) return;
    if (!truth) return callback(null, ...results);

    _fn(next);
  }

  return check(null, true);
}

var doWhilst$1 = awaitify(doWhilst, 3);
/**
 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
 * argument ordering differs from `until`.
 *
 * @name doUntil
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` fails. Invoked with (callback).
 * @param {AsyncFunction} test - asynchronous truth test to perform after each
 * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `iteratee`
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if no callback is passed
 */

function doUntil(iteratee, test, callback) {
  const _test = wrapAsync(test);

  return doWhilst$1(iteratee, (...args) => {
    const cb = args.pop();

    _test(...args, (err, truth) => cb(err, !truth));
  }, callback);
}

function _withoutIndex(iteratee) {
  return (value, index, callback) => iteratee(value, callback);
}
/**
 * Applies the function `iteratee` to each item in `coll`, in parallel.
 * The `iteratee` is called with an item from the list, and a callback for when
 * it has finished. If the `iteratee` passes an error to its `callback`, the
 * main `callback` (for the `each` function) is immediately called with the
 * error.
 *
 * Note, that since this function applies `iteratee` to each item in parallel,
 * there is no guarantee that the iteratee functions will complete in order.
 *
 * @name each
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEach
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to
 * each item in `coll`. Invoked with (item, callback).
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOf`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 * // dir4 does not exist
 *
 * const fileList = [ 'dir1/file2.txt', 'dir2/file3.txt', 'dir/file5.txt'];
 * const withMissingFileList = ['dir1/file1.txt', 'dir4/file2.txt'];
 *
 * // asynchronous function that deletes a file
 * const deleteFile = function(file, callback) {
 *     fs.unlink(file, callback);
 * };
 *
 * // Using callbacks
 * async.each(fileList, deleteFile, function(err) {
 *     if( err ) {
 *         console.log(err);
 *     } else {
 *         console.log('All files have been deleted successfully');
 *     }
 * });
 *
 * // Error Handling
 * async.each(withMissingFileList, deleteFile, function(err){
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 *     // since dir4/file2.txt does not exist
 *     // dir1/file1.txt could have been deleted
 * });
 *
 * // Using Promises
 * async.each(fileList, deleteFile)
 * .then( () => {
 *     console.log('All files have been deleted successfully');
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Error Handling
 * async.each(fileList, deleteFile)
 * .then( () => {
 *     console.log('All files have been deleted successfully');
 * }).catch( err => {
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 *     // since dir4/file2.txt does not exist
 *     // dir1/file1.txt could have been deleted
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         await async.each(files, deleteFile);
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // Error Handling
 * async () => {
 *     try {
 *         await async.each(withMissingFileList, deleteFile);
 *     }
 *     catch (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *         // since dir4/file2.txt does not exist
 *         // dir1/file1.txt could have been deleted
 *     }
 * }
 *
 */


function eachLimit(coll, iteratee, callback) {
  return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}

var each = awaitify(eachLimit, 3);
/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfLimit`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 */

function eachLimit$1(coll, limit, iteratee, callback) {
  return eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}

var eachLimit$2 = awaitify(eachLimit$1, 4);
/**
 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
 *
 * Note, that unlike [`each`]{@link module:Collections.each}, this function applies iteratee to each item
 * in series and therefore the iteratee functions will complete in order.

 * @name eachSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachSeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfSeries`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @returns {Promise} a promise, if a callback is omitted
 */

function eachSeries(coll, iteratee, callback) {
  return eachLimit$2(coll, 1, iteratee, callback);
}

var eachSeries$1 = awaitify(eachSeries, 3);
/**
 * Wrap an async function and ensure it calls its callback on a later tick of
 * the event loop.  If the function already calls its callback on a next tick,
 * no extra deferral is added. This is useful for preventing stack overflows
 * (`RangeError: Maximum call stack size exceeded`) and generally keeping
 * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
 * contained. ES2017 `async` functions are returned as-is -- they are immune
 * to Zalgo's corrupting influences, as they always resolve on a later tick.
 *
 * @name ensureAsync
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} fn - an async function, one that expects a node-style
 * callback as its last argument.
 * @returns {AsyncFunction} Returns a wrapped function with the exact same call
 * signature as the function passed in.
 * @example
 *
 * function sometimesAsync(arg, callback) {
 *     if (cache[arg]) {
 *         return callback(null, cache[arg]); // this would be synchronous!!
 *     } else {
 *         doSomeIO(arg, callback); // this IO would be asynchronous
 *     }
 * }
 *
 * // this has a risk of stack overflows if many results are cached in a row
 * async.mapSeries(args, sometimesAsync, done);
 *
 * // this will defer sometimesAsync's callback if necessary,
 * // preventing stack overflows
 * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
 */

function ensureAsync(fn) {
  if (isAsync(fn)) return fn;
  return function (...args
  /*, callback*/
  ) {
    var callback = args.pop();
    var sync = true;
    args.push((...innerArgs) => {
      if (sync) {
        setImmediate$1(() => callback(...innerArgs));
      } else {
        callback(...innerArgs);
      }
    });
    fn.apply(this, args);
    sync = false;
  };
}
/**
 * Returns `true` if every element in `coll` satisfies an async test. If any
 * iteratee call returns `false`, the main `callback` is immediately called.
 *
 * @name every
 * @static
 * @memberOf module:Collections
 * @method
 * @alias all
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in parallel.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 * // dir4 does not exist
 *
 * const fileList = ['dir1/file1.txt','dir2/file3.txt','dir3/file5.txt'];
 * const withMissingFileList = ['file1.txt','file2.txt','file4.txt'];
 *
 * // asynchronous function that checks if a file exists
 * function fileExists(file, callback) {
 *    fs.access(file, fs.constants.F_OK, (err) => {
 *        callback(null, !err);
 *    });
 * }
 *
 * // Using callbacks
 * async.every(fileList, fileExists, function(err, result) {
 *     console.log(result);
 *     // true
 *     // result is true since every file exists
 * });
 *
 * async.every(withMissingFileList, fileExists, function(err, result) {
 *     console.log(result);
 *     // false
 *     // result is false since NOT every file exists
 * });
 *
 * // Using Promises
 * async.every(fileList, fileExists)
 * .then( result => {
 *     console.log(result);
 *     // true
 *     // result is true since every file exists
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * async.every(withMissingFileList, fileExists)
 * .then( result => {
 *     console.log(result);
 *     // false
 *     // result is false since NOT every file exists
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.every(fileList, fileExists);
 *         console.log(result);
 *         // true
 *         // result is true since every file exists
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * async () => {
 *     try {
 *         let result = await async.every(withMissingFileList, fileExists);
 *         console.log(result);
 *         // false
 *         // result is false since NOT every file exists
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function every(coll, iteratee, callback) {
  return _createTester(bool => !bool, res => !res)(eachOf$1, coll, iteratee, callback);
}

var every$1 = awaitify(every, 3);
/**
 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
 *
 * @name everyLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in parallel.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */

function everyLimit(coll, limit, iteratee, callback) {
  return _createTester(bool => !bool, res => !res)(eachOfLimit(limit), coll, iteratee, callback);
}

var everyLimit$1 = awaitify(everyLimit, 4);
/**
 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
 *
 * @name everySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allSeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in series.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */

function everySeries(coll, iteratee, callback) {
  return _createTester(bool => !bool, res => !res)(eachOfSeries$1, coll, iteratee, callback);
}

var everySeries$1 = awaitify(everySeries, 3);

function filterArray(eachfn, arr, iteratee, callback) {
  var truthValues = new Array(arr.length);
  eachfn(arr, (x, index, iterCb) => {
    iteratee(x, (err, v) => {
      truthValues[index] = !!v;
      iterCb(err);
    });
  }, err => {
    if (err) return callback(err);
    var results = [];

    for (var i = 0; i < arr.length; i++) {
      if (truthValues[i]) results.push(arr[i]);
    }

    callback(null, results);
  });
}

function filterGeneric(eachfn, coll, iteratee, callback) {
  var results = [];
  eachfn(coll, (x, index, iterCb) => {
    iteratee(x, (err, v) => {
      if (err) return iterCb(err);

      if (v) {
        results.push({
          index,
          value: x
        });
      }

      iterCb(err);
    });
  }, err => {
    if (err) return callback(err);
    callback(null, results.sort((a, b) => a.index - b.index).map(v => v.value));
  });
}

function _filter(eachfn, coll, iteratee, callback) {
  var filter = isArrayLike(coll) ? filterArray : filterGeneric;
  return filter(eachfn, coll, wrapAsync(iteratee), callback);
}
/**
 * Returns a new array of all the values in `coll` which pass an async truth
 * test. This operation is performed in parallel, but the results array will be
 * in the same order as the original.
 *
 * @name filter
 * @static
 * @memberOf module:Collections
 * @method
 * @alias select
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback provided
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 *
 * const files = ['dir1/file1.txt','dir2/file3.txt','dir3/file6.txt'];
 *
 * // asynchronous function that checks if a file exists
 * function fileExists(file, callback) {
 *    fs.access(file, fs.constants.F_OK, (err) => {
 *        callback(null, !err);
 *    });
 * }
 *
 * // Using callbacks
 * async.filter(files, fileExists, function(err, results) {
 *    if(err) {
 *        console.log(err);
 *    } else {
 *        console.log(results);
 *        // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
 *        // results is now an array of the existing files
 *    }
 * });
 *
 * // Using Promises
 * async.filter(files, fileExists)
 * .then(results => {
 *     console.log(results);
 *     // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
 *     // results is now an array of the existing files
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let results = await async.filter(files, fileExists);
 *         console.log(results);
 *         // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
 *         // results is now an array of the existing files
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function filter(coll, iteratee, callback) {
  return _filter(eachOf$1, coll, iteratee, callback);
}

var filter$1 = awaitify(filter, 3);
/**
 * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name filterLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback provided
 */

function filterLimit(coll, limit, iteratee, callback) {
  return _filter(eachOfLimit(limit), coll, iteratee, callback);
}

var filterLimit$1 = awaitify(filterLimit, 4);
/**
 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
 *
 * @name filterSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectSeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results)
 * @returns {Promise} a promise, if no callback provided
 */

function filterSeries(coll, iteratee, callback) {
  return _filter(eachOfSeries$1, coll, iteratee, callback);
}

var filterSeries$1 = awaitify(filterSeries, 3);
/**
 * Calls the asynchronous function `fn` with a callback parameter that allows it
 * to call itself again, in series, indefinitely.

 * If an error is passed to the callback then `errback` is called with the
 * error, and execution stops, otherwise it will never be called.
 *
 * @name forever
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} fn - an async function to call repeatedly.
 * Invoked with (next).
 * @param {Function} [errback] - when `fn` passes an error to it's callback,
 * this function will be called, and execution stops. Invoked with (err).
 * @returns {Promise} a promise that rejects if an error occurs and an errback
 * is not passed
 * @example
 *
 * async.forever(
 *     function(next) {
 *         // next is suitable for passing to things that need a callback(err [, whatever]);
 *         // it will result in this function being called again.
 *     },
 *     function(err) {
 *         // if next is called with a value in its first parameter, it will appear
 *         // in here as 'err', and execution will stop.
 *     }
 * );
 */

function forever(fn, errback) {
  var done = onlyOnce(errback);
  var task = wrapAsync(ensureAsync(fn));

  function next(err) {
    if (err) return done(err);
    if (err === false) return;
    task(next);
  }

  return next();
}

var forever$1 = awaitify(forever, 2);
/**
 * The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
 *
 * @name groupByLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.groupBy]{@link module:Collections.groupBy}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a `key` to group the value under.
 * Invoked with (value, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Result is an `Object` whoses
 * properties are arrays of values which returned the corresponding key.
 * @returns {Promise} a promise, if no callback is passed
 */

function groupByLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);

  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, key) => {
      if (err) return iterCb(err);
      return iterCb(err, {
        key,
        val
      });
    });
  }, (err, mapResults) => {
    var result = {}; // from MDN, handle object having an `hasOwnProperty` prop

    var {
      hasOwnProperty
    } = Object.prototype;

    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        var {
          key
        } = mapResults[i];
        var {
          val
        } = mapResults[i];

        if (hasOwnProperty.call(result, key)) {
          result[key].push(val);
        } else {
          result[key] = [val];
        }
      }
    }

    return callback(err, result);
  });
}

var groupByLimit$1 = awaitify(groupByLimit, 4);
/**
 * Returns a new object, where each value corresponds to an array of items, from
 * `coll`, that returned the corresponding key. That is, the keys of the object
 * correspond to the values passed to the `iteratee` callback.
 *
 * Note: Since this function applies the `iteratee` to each item in parallel,
 * there is no guarantee that the `iteratee` functions will complete in order.
 * However, the values for each key in the `result` will be in the same order as
 * the original `coll`. For Objects, the values will roughly be in the order of
 * the original Objects' keys (but this can vary across JavaScript engines).
 *
 * @name groupBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a `key` to group the value under.
 * Invoked with (value, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Result is an `Object` whoses
 * properties are arrays of values which returned the corresponding key.
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 * // dir4 does not exist
 *
 * const files = ['dir1/file1.txt','dir2','dir4']
 *
 * // asynchronous function that detects file type as none, file, or directory
 * function detectFile(file, callback) {
 *     fs.stat(file, function(err, stat) {
 *         if (err) {
 *             return callback(null, 'none');
 *         }
 *         callback(null, stat.isDirectory() ? 'directory' : 'file');
 *     });
 * }
 *
 * //Using callbacks
 * async.groupBy(files, detectFile, function(err, result) {
 *     if(err) {
 *         console.log(err);
 *     } else {
 *	       console.log(result);
 *         // {
 *         //     file: [ 'dir1/file1.txt' ],
 *         //     none: [ 'dir4' ],
 *         //     directory: [ 'dir2']
 *         // }
 *         // result is object containing the files grouped by type
 *     }
 * });
 *
 * // Using Promises
 * async.groupBy(files, detectFile)
 * .then( result => {
 *     console.log(result);
 *     // {
 *     //     file: [ 'dir1/file1.txt' ],
 *     //     none: [ 'dir4' ],
 *     //     directory: [ 'dir2']
 *     // }
 *     // result is object containing the files grouped by type
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.groupBy(files, detectFile);
 *         console.log(result);
 *         // {
 *         //     file: [ 'dir1/file1.txt' ],
 *         //     none: [ 'dir4' ],
 *         //     directory: [ 'dir2']
 *         // }
 *         // result is object containing the files grouped by type
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */

function groupBy(coll, iteratee, callback) {
  return groupByLimit$1(coll, Infinity, iteratee, callback);
}
/**
 * The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
 *
 * @name groupBySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.groupBy]{@link module:Collections.groupBy}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a `key` to group the value under.
 * Invoked with (value, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Result is an `Object` whose
 * properties are arrays of values which returned the corresponding key.
 * @returns {Promise} a promise, if no callback is passed
 */


function groupBySeries(coll, iteratee, callback) {
  return groupByLimit$1(coll, 1, iteratee, callback);
}
/**
 * Logs the result of an `async` function to the `console`. Only works in
 * Node.js or in browsers that support `console.log` and `console.error` (such
 * as FF and Chrome). If multiple arguments are returned from the async
 * function, `console.log` is called on each argument in order.
 *
 * @name log
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} function - The function you want to eventually apply
 * all arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, 'hello ' + name);
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.log(hello, 'world');
 * 'hello world'
 */


var log = consoleFunc('log');
/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name mapValuesLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @returns {Promise} a promise, if no callback is passed
 */

function mapValuesLimit(obj, limit, iteratee, callback) {
  callback = once(callback);
  var newObj = {};

  var _iteratee = wrapAsync(iteratee);

  return eachOfLimit(limit)(obj, (val, key, next) => {
    _iteratee(val, key, (err, result) => {
      if (err) return next(err);
      newObj[key] = result;
      next(err);
    });
  }, err => callback(err, newObj));
}

var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);
/**
 * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
 *
 * Produces a new Object by mapping each value of `obj` through the `iteratee`
 * function. The `iteratee` is called each `value` and `key` from `obj` and a
 * callback for when it has finished processing. Each of these callbacks takes
 * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
 * passes an error to its callback, the main `callback` (for the `mapValues`
 * function) is immediately called with the error.
 *
 * Note, the order of the keys in the result is not guaranteed.  The keys will
 * be roughly in the order they complete, (but this is very engine-specific)
 *
 * @name mapValues
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * // file1.txt is a file that is 1000 bytes in size
 * // file2.txt is a file that is 2000 bytes in size
 * // file3.txt is a file that is 3000 bytes in size
 * // file4.txt does not exist
 *
 * const fileMap = {
 *     f1: 'file1.txt',
 *     f2: 'file2.txt',
 *     f3: 'file3.txt'
 * };
 *
 * const withMissingFileMap = {
 *     f1: 'file1.txt',
 *     f2: 'file2.txt',
 *     f3: 'file4.txt'
 * };
 *
 * // asynchronous function that returns the file size in bytes
 * function getFileSizeInBytes(file, key, callback) {
 *     fs.stat(file, function(err, stat) {
 *         if (err) {
 *             return callback(err);
 *         }
 *         callback(null, stat.size);
 *     });
 * }
 *
 * // Using callbacks
 * async.mapValues(fileMap, getFileSizeInBytes, function(err, result) {
 *     if (err) {
 *         console.log(err);
 *     } else {
 *         console.log(result);
 *         // result is now a map of file size in bytes for each file, e.g.
 *         // {
 *         //     f1: 1000,
 *         //     f2: 2000,
 *         //     f3: 3000
 *         // }
 *     }
 * });
 *
 * // Error handling
 * async.mapValues(withMissingFileMap, getFileSizeInBytes, function(err, result) {
 *     if (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     } else {
 *         console.log(result);
 *     }
 * });
 *
 * // Using Promises
 * async.mapValues(fileMap, getFileSizeInBytes)
 * .then( result => {
 *     console.log(result);
 *     // result is now a map of file size in bytes for each file, e.g.
 *     // {
 *     //     f1: 1000,
 *     //     f2: 2000,
 *     //     f3: 3000
 *     // }
 * }).catch (err => {
 *     console.log(err);
 * });
 *
 * // Error Handling
 * async.mapValues(withMissingFileMap, getFileSizeInBytes)
 * .then( result => {
 *     console.log(result);
 * }).catch (err => {
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.mapValues(fileMap, getFileSizeInBytes);
 *         console.log(result);
 *         // result is now a map of file size in bytes for each file, e.g.
 *         // {
 *         //     f1: 1000,
 *         //     f2: 2000,
 *         //     f3: 3000
 *         // }
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // Error Handling
 * async () => {
 *     try {
 *         let result = await async.mapValues(withMissingFileMap, getFileSizeInBytes);
 *         console.log(result);
 *     }
 *     catch (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     }
 * }
 *
 */

function mapValues(obj, iteratee, callback) {
  return mapValuesLimit$1(obj, Infinity, iteratee, callback);
}
/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
 *
 * @name mapValuesSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @returns {Promise} a promise, if no callback is passed
 */


function mapValuesSeries(obj, iteratee, callback) {
  return mapValuesLimit$1(obj, 1, iteratee, callback);
}
/**
 * Caches the results of an async function. When creating a hash to store
 * function results against, the callback is omitted from the hash and an
 * optional hash function can be used.
 *
 * **Note: if the async function errs, the result will not be cached and
 * subsequent calls will call the wrapped function.**
 *
 * If no hash function is specified, the first argument is used as a hash key,
 * which may work reasonably if it is a string or a data type that converts to a
 * distinct string. Note that objects and arrays will not behave reasonably.
 * Neither will cases where the other arguments are significant. In such cases,
 * specify your own hash function.
 *
 * The cache of results is exposed as the `memo` property of the function
 * returned by `memoize`.
 *
 * @name memoize
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} fn - The async function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash
 * for storing results. It has all the arguments applied to it apart from the
 * callback, and must be synchronous.
 * @returns {AsyncFunction} a memoized version of `fn`
 * @example
 *
 * var slow_fn = function(name, callback) {
 *     // do something
 *     callback(null, result);
 * };
 * var fn = async.memoize(slow_fn);
 *
 * // fn can now be used as if it were slow_fn
 * fn('some name', function() {
 *     // callback
 * });
 */


function memoize(fn, hasher = v => v) {
  var memo = Object.create(null);
  var queues = Object.create(null);

  var _fn = wrapAsync(fn);

  var memoized = initialParams((args, callback) => {
    var key = hasher(...args);

    if (key in memo) {
      setImmediate$1(() => callback(null, ...memo[key]));
    } else if (key in queues) {
      queues[key].push(callback);
    } else {
      queues[key] = [callback];

      _fn(...args, (err, ...resultArgs) => {
        // #1465 don't memoize if an error occurred
        if (!err) {
          memo[key] = resultArgs;
        }

        var q = queues[key];
        delete queues[key];

        for (var i = 0, l = q.length; i < l; i++) {
          q[i](err, ...resultArgs);
        }
      });
    }
  });
  memoized.memo = memo;
  memoized.unmemoized = fn;
  return memoized;
}
/* istanbul ignore file */

/**
 * Calls `callback` on a later loop around the event loop. In Node.js this just
 * calls `process.nextTick`.  In the browser it will use `setImmediate` if
 * available, otherwise `setTimeout(callback, 0)`, which means other higher
 * priority events may precede the execution of `callback`.
 *
 * This is used internally for browser-compatibility purposes.
 *
 * @name nextTick
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.setImmediate]{@link module:Utils.setImmediate}
 * @category Util
 * @param {Function} callback - The function to call on a later loop around
 * the event loop. Invoked with (args...).
 * @param {...*} args... - any number of additional arguments to pass to the
 * callback on the next tick.
 * @example
 *
 * var call_order = [];
 * async.nextTick(function() {
 *     call_order.push('two');
 *     // call_order now equals ['one','two']
 * });
 * call_order.push('one');
 *
 * async.setImmediate(function (a, b, c) {
 *     // a, b, and c equal 1, 2, and 3
 * }, 1, 2, 3);
 */


var _defer$1;

if (hasNextTick) {
  _defer$1 = process.nextTick;
} else if (hasSetImmediate) {
  _defer$1 = setImmediate;
} else {
  _defer$1 = fallback;
}

var nextTick = wrap(_defer$1);

var _parallel = awaitify((eachfn, tasks, callback) => {
  var results = isArrayLike(tasks) ? [] : {};
  eachfn(tasks, (task, key, taskCb) => {
    wrapAsync(task)((err, ...result) => {
      if (result.length < 2) {
        [result] = result;
      }

      results[key] = result;
      taskCb(err);
    });
  }, err => callback(err, results));
}, 3);
/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
 * execution of other tasks when a task fails.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection of
 * [async functions]{@link AsyncFunction} to run.
 * Each async function can complete with any number of optional `result` values.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 * @returns {Promise} a promise, if a callback is not passed
 *
 * @example
 *
 * //Using Callbacks
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ], function(err, results) {
 *     console.log(results);
 *     // results is equal to ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     console.log(results);
 *     // results is equal to: { one: 1, two: 2 }
 * });
 *
 * //Using Promises
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ]).then(results => {
 *     console.log(results);
 *     // results is equal to ['one','two'] even though
 *     // the second function had a shorter timeout.
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }).then(results => {
 *     console.log(results);
 *     // results is equal to: { one: 1, two: 2 }
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * //Using async/await
 * async () => {
 *     try {
 *         let results = await async.parallel([
 *             function(callback) {
 *                 setTimeout(function() {
 *                     callback(null, 'one');
 *                 }, 200);
 *             },
 *             function(callback) {
 *                 setTimeout(function() {
 *                     callback(null, 'two');
 *                 }, 100);
 *             }
 *         ]);
 *         console.log(results);
 *         // results is equal to ['one','two'] even though
 *         // the second function had a shorter timeout.
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // an example using an object instead of an array
 * async () => {
 *     try {
 *         let results = await async.parallel({
 *             one: function(callback) {
 *                 setTimeout(function() {
 *                     callback(null, 1);
 *                 }, 200);
 *             },
 *            two: function(callback) {
 *                 setTimeout(function() {
 *                     callback(null, 2);
 *                 }, 100);
 *            }
 *         });
 *         console.log(results);
 *         // results is equal to: { one: 1, two: 2 }
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function parallel(tasks, callback) {
  return _parallel(eachOf$1, tasks, callback);
}
/**
 * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name parallelLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.parallel]{@link module:ControlFlow.parallel}
 * @category Control Flow
 * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection of
 * [async functions]{@link AsyncFunction} to run.
 * Each async function can complete with any number of optional `result` values.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 * @returns {Promise} a promise, if a callback is not passed
 */


function parallelLimit(tasks, limit, callback) {
  return _parallel(eachOfLimit(limit), tasks, callback);
}
/**
 * A queue of tasks for the worker function to complete.
 * @typedef {Iterable} QueueObject
 * @memberOf module:ControlFlow
 * @property {Function} length - a function returning the number of items
 * waiting to be processed. Invoke with `queue.length()`.
 * @property {boolean} started - a boolean indicating whether or not any
 * items have been pushed and processed by the queue.
 * @property {Function} running - a function returning the number of items
 * currently being processed. Invoke with `queue.running()`.
 * @property {Function} workersList - a function returning the array of items
 * currently being processed. Invoke with `queue.workersList()`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
 * @property {number} concurrency - an integer for determining how many `worker`
 * functions should be run in parallel. This property can be changed after a
 * `queue` is created to alter the concurrency on-the-fly.
 * @property {number} payload - an integer that specifies how many items are
 * passed to the worker function at a time. only applies if this is a
 * [cargo]{@link module:ControlFlow.cargo} object
 * @property {AsyncFunction} push - add a new task to the `queue`. Calls `callback`
 * once the `worker` has finished processing the task. Instead of a single task,
 * a `tasks` array can be submitted. The respective callback is used for every
 * task in the list. Invoke with `queue.push(task, [callback])`,
 * @property {AsyncFunction} unshift - add a new task to the front of the `queue`.
 * Invoke with `queue.unshift(task, [callback])`.
 * @property {AsyncFunction} pushAsync - the same as `q.push`, except this returns
 * a promise that rejects if an error occurs.
 * @property {AsyncFunction} unshiftAsync - the same as `q.unshift`, except this returns
 * a promise that rejects if an error occurs.
 * @property {Function} remove - remove items from the queue that match a test
 * function.  The test function will be passed an object with a `data` property,
 * and a `priority` property, if this is a
 * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
 * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
 * `function ({data, priority}) {}` and returns a Boolean.
 * @property {Function} saturated - a function that sets a callback that is
 * called when the number of running workers hits the `concurrency` limit, and
 * further tasks will be queued.  If the callback is omitted, `q.saturated()`
 * returns a promise for the next occurrence.
 * @property {Function} unsaturated - a function that sets a callback that is
 * called when the number of running workers is less than the `concurrency` &
 * `buffer` limits, and further tasks will not be queued. If the callback is
 * omitted, `q.unsaturated()` returns a promise for the next occurrence.
 * @property {number} buffer - A minimum threshold buffer in order to say that
 * the `queue` is `unsaturated`.
 * @property {Function} empty - a function that sets a callback that is called
 * when the last item from the `queue` is given to a `worker`. If the callback
 * is omitted, `q.empty()` returns a promise for the next occurrence.
 * @property {Function} drain - a function that sets a callback that is called
 * when the last item from the `queue` has returned from the `worker`. If the
 * callback is omitted, `q.drain()` returns a promise for the next occurrence.
 * @property {Function} error - a function that sets a callback that is called
 * when a task errors. Has the signature `function(error, task)`. If the
 * callback is omitted, `error()` returns a promise that rejects on the next
 * error.
 * @property {boolean} paused - a boolean for determining whether the queue is
 * in a paused state.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke with `queue.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. No more tasks
 * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
 *
 * @example
 * const q = async.queue(worker, 2)
 * q.push(item1)
 * q.push(item2)
 * q.push(item3)
 * // queues are iterable, spread into an array to inspect
 * const items = [...q] // [item1, item2, item3]
 * // or use for of
 * for (let item of q) {
 *     console.log(item)
 * }
 *
 * q.drain(() => {
 *     console.log('all done')
 * })
 * // or
 * await q.drain()
 */

/**
 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
 * `queue` are processed in parallel (up to the `concurrency` limit). If all
 * `worker`s are in progress, the task is queued until one becomes available.
 * Once a `worker` completes a `task`, that `task`'s callback is called.
 *
 * @name queue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} worker - An async function for processing a queued task.
 * If you want to handle errors from an individual task, pass a callback to
 * `q.push()`. Invoked with (task, callback).
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can be
 * attached as certain properties to listen for specific events during the
 * lifecycle of the queue.
 * @example
 *
 * // create a queue object with concurrency 2
 * var q = async.queue(function(task, callback) {
 *     console.log('hello ' + task.name);
 *     callback();
 * }, 2);
 *
 * // assign a callback
 * q.drain(function() {
 *     console.log('all items have been processed');
 * });
 * // or await the end
 * await q.drain()
 *
 * // assign an error callback
 * q.error(function(err, task) {
 *     console.error('task experienced an error');
 * });
 *
 * // add some items to the queue
 * q.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * // callback is optional
 * q.push({name: 'bar'});
 *
 * // add some items to the queue (batch-wise)
 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
 *     console.log('finished processing item');
 * });
 *
 * // add some items to the front of the queue
 * q.unshift({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 */


function queue$1(worker, concurrency) {
  var _worker = wrapAsync(worker);

  return queue((items, cb) => {
    _worker(items[0], cb);
  }, concurrency, 1);
} // Binary min-heap implementation used for priority queue.
// Implementation is stable, i.e. push time is considered for equal priorities


class Heap {
  constructor() {
    this.heap = [];
    this.pushCount = Number.MIN_SAFE_INTEGER;
  }

  get length() {
    return this.heap.length;
  }

  empty() {
    this.heap = [];
    return this;
  }

  percUp(index) {
    let p;

    while (index > 0 && smaller(this.heap[index], this.heap[p = parent(index)])) {
      let t = this.heap[index];
      this.heap[index] = this.heap[p];
      this.heap[p] = t;
      index = p;
    }
  }

  percDown(index) {
    let l;

    while ((l = leftChi(index)) < this.heap.length) {
      if (l + 1 < this.heap.length && smaller(this.heap[l + 1], this.heap[l])) {
        l = l + 1;
      }

      if (smaller(this.heap[index], this.heap[l])) {
        break;
      }

      let t = this.heap[index];
      this.heap[index] = this.heap[l];
      this.heap[l] = t;
      index = l;
    }
  }

  push(node) {
    node.pushCount = ++this.pushCount;
    this.heap.push(node);
    this.percUp(this.heap.length - 1);
  }

  unshift(node) {
    return this.heap.push(node);
  }

  shift() {
    let [top] = this.heap;
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.percDown(0);
    return top;
  }

  toArray() {
    return [...this];
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.heap.length; i++) {
      yield this.heap[i].data;
    }
  }

  remove(testFn) {
    let j = 0;

    for (let i = 0; i < this.heap.length; i++) {
      if (!testFn(this.heap[i])) {
        this.heap[j] = this.heap[i];
        j++;
      }
    }

    this.heap.splice(j);

    for (let i = parent(this.heap.length - 1); i >= 0; i--) {
      this.percDown(i);
    }

    return this;
  }

}

function leftChi(i) {
  return (i << 1) + 1;
}

function parent(i) {
  return (i + 1 >> 1) - 1;
}

function smaller(x, y) {
  if (x.priority !== y.priority) {
    return x.priority < y.priority;
  } else {
    return x.pushCount < y.pushCount;
  }
}
/**
 * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
 * completed in ascending priority order.
 *
 * @name priorityQueue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {AsyncFunction} worker - An async function for processing a queued task.
 * If you want to handle errors from an individual task, pass a callback to
 * `q.push()`.
 * Invoked with (task, callback).
 * @param {number} concurrency - An `integer` for determining how many `worker`
 * functions should be run in parallel.  If omitted, the concurrency defaults to
 * `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
 * differences between `queue` and `priorityQueue` objects:
 * * `push(task, priority, [callback])` - `priority` should be a number. If an
 *   array of `tasks` is given, all tasks will be assigned the same priority.
 * * The `unshift` method was removed.
 */


function priorityQueue(worker, concurrency) {
  // Start with a normal queue
  var q = queue$1(worker, concurrency);
  var processingScheduled = false;
  q._tasks = new Heap(); // Override push to accept second parameter representing priority

  q.push = function (data, priority = 0, callback = () => {}) {
    if (typeof callback !== 'function') {
      throw new Error('task callback must be a function');
    }

    q.started = true;

    if (!Array.isArray(data)) {
      data = [data];
    }

    if (data.length === 0 && q.idle()) {
      // call drain immediately if there are no tasks
      return setImmediate$1(() => q.drain());
    }

    for (var i = 0, l = data.length; i < l; i++) {
      var item = {
        data: data[i],
        priority,
        callback
      };

      q._tasks.push(item);
    }

    if (!processingScheduled) {
      processingScheduled = true;
      setImmediate$1(() => {
        processingScheduled = false;
        q.process();
      });
    }
  }; // Remove unshift function


  delete q.unshift;
  return q;
}
/**
 * Runs the `tasks` array of functions in parallel, without waiting until the
 * previous function has completed. Once any of the `tasks` complete or pass an
 * error to its callback, the main `callback` is immediately called. It's
 * equivalent to `Promise.race()`.
 *
 * @name race
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
 * to run. Each function can complete with an optional `result` value.
 * @param {Function} callback - A callback to run once any of the functions have
 * completed. This function gets an error or result from the first function that
 * completed. Invoked with (err, result).
 * @returns undefined
 * @example
 *
 * async.race([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // main callback
 * function(err, result) {
 *     // the result will be equal to 'two' as it finishes earlier
 * });
 */


function race(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
  if (!tasks.length) return callback();

  for (var i = 0, l = tasks.length; i < l; i++) {
    wrapAsync(tasks[i])(callback);
  }
}

var race$1 = awaitify(race, 2);
/**
 * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
 *
 * @name reduceRight
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reduce]{@link module:Collections.reduce}
 * @alias foldr
 * @category Collection
 * @param {Array} array - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {AsyncFunction} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction.
 * The `iteratee` should complete with the next state of the reduction.
 * If the iteratee completes with an error, the reduction is stopped and the
 * main `callback` is immediately called with the error.
 * Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 * @returns {Promise} a promise, if no callback is passed
 */

function reduceRight(array, memo, iteratee, callback) {
  var reversed = [...array].reverse();
  return reduce$1(reversed, memo, iteratee, callback);
}
/**
 * Wraps the async function in another function that always completes with a
 * result object, even when it errors.
 *
 * The result object has either the property `error` or `value`.
 *
 * @name reflect
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} fn - The async function you want to wrap
 * @returns {Function} - A function that always passes null to it's callback as
 * the error. The second argument to the callback will be an `object` with
 * either an `error` or a `value` property.
 * @example
 *
 * async.parallel([
 *     async.reflect(function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff but error ...
 *         callback('bad stuff happened');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     })
 * ],
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = 'bad stuff happened'
 *     // results[2].value = 'two'
 * });
 */


function reflect(fn) {
  var _fn = wrapAsync(fn);

  return initialParams(function reflectOn(args, reflectCallback) {
    args.push((error, ...cbArgs) => {
      let retVal = {};

      if (error) {
        retVal.error = error;
      }

      if (cbArgs.length > 0) {
        var value = cbArgs;

        if (cbArgs.length <= 1) {
          [value] = cbArgs;
        }

        retVal.value = value;
      }

      reflectCallback(null, retVal);
    });
    return _fn.apply(this, args);
  });
}
/**
 * A helper function that wraps an array or an object of functions with `reflect`.
 *
 * @name reflectAll
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.reflect]{@link module:Utils.reflect}
 * @category Util
 * @param {Array|Object|Iterable} tasks - The collection of
 * [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
 * @returns {Array} Returns an array of async functions, each wrapped in
 * `async.reflect`
 * @example
 *
 * let tasks = [
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         // do some more stuff but error ...
 *         callback(new Error('bad stuff happened'));
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ];
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = Error('bad stuff happened')
 *     // results[2].value = 'two'
 * });
 *
 * // an example using an object instead of an array
 * let tasks = {
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         callback('two');
 *     },
 *     three: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'three');
 *         }, 100);
 *     }
 * };
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results.one.value = 'one'
 *     // results.two.error = 'two'
 *     // results.three.value = 'three'
 * });
 */


function reflectAll(tasks) {
  var results;

  if (Array.isArray(tasks)) {
    results = tasks.map(reflect);
  } else {
    results = {};
    Object.keys(tasks).forEach(key => {
      results[key] = reflect.call(this, tasks[key]);
    });
  }

  return results;
}

function reject(eachfn, arr, _iteratee, callback) {
  const iteratee = wrapAsync(_iteratee);
  return _filter(eachfn, arr, (value, cb) => {
    iteratee(value, (err, v) => {
      cb(err, !v);
    });
  }, callback);
}
/**
 * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
 *
 * @name reject
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 *
 * const fileList = ['dir1/file1.txt','dir2/file3.txt','dir3/file6.txt'];
 *
 * // asynchronous function that checks if a file exists
 * function fileExists(file, callback) {
 *    fs.access(file, fs.constants.F_OK, (err) => {
 *        callback(null, !err);
 *    });
 * }
 *
 * // Using callbacks
 * async.reject(fileList, fileExists, function(err, results) {
 *    // [ 'dir3/file6.txt' ]
 *    // results now equals an array of the non-existing files
 * });
 *
 * // Using Promises
 * async.reject(fileList, fileExists)
 * .then( results => {
 *     console.log(results);
 *     // [ 'dir3/file6.txt' ]
 *     // results now equals an array of the non-existing files
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let results = await async.reject(fileList, fileExists);
 *         console.log(results);
 *         // [ 'dir3/file6.txt' ]
 *         // results now equals an array of the non-existing files
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function reject$1(coll, iteratee, callback) {
  return reject(eachOf$1, coll, iteratee, callback);
}

var reject$2 = awaitify(reject$1, 3);
/**
 * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name rejectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */

function rejectLimit(coll, limit, iteratee, callback) {
  return reject(eachOfLimit(limit), coll, iteratee, callback);
}

var rejectLimit$1 = awaitify(rejectLimit, 4);
/**
 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
 *
 * @name rejectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback is passed
 */

function rejectSeries(coll, iteratee, callback) {
  return reject(eachOfSeries$1, coll, iteratee, callback);
}

var rejectSeries$1 = awaitify(rejectSeries, 3);

function constant$1(value) {
  return function () {
    return value;
  };
}
/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @see [async.retryable]{@link module:ControlFlow.retryable}
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {AsyncFunction} task - An async function to retry.
 * Invoked with (callback).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 * @returns {Promise} a promise if no callback provided
 *
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // to retry individual methods that are not as reliable within other
 * // control flow functions, use the `retryable` wrapper:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retryable(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */


const DEFAULT_TIMES = 5;
const DEFAULT_INTERVAL = 0;

function retry(opts, task, callback) {
  var options = {
    times: DEFAULT_TIMES,
    intervalFunc: constant$1(DEFAULT_INTERVAL)
  };

  if (arguments.length < 3 && typeof opts === 'function') {
    callback = task || promiseCallback();
    task = opts;
  } else {
    parseTimes(options, opts);
    callback = callback || promiseCallback();
  }

  if (typeof task !== 'function') {
    throw new Error("Invalid arguments for async.retry");
  }

  var _task = wrapAsync(task);

  var attempt = 1;

  function retryAttempt() {
    _task((err, ...args) => {
      if (err === false) return;

      if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
        setTimeout(retryAttempt, options.intervalFunc(attempt - 1));
      } else {
        callback(err, ...args);
      }
    });
  }

  retryAttempt();
  return callback[PROMISE_SYMBOL];
}

function parseTimes(acc, t) {
  if (typeof t === 'object') {
    acc.times = +t.times || DEFAULT_TIMES;
    acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
    acc.errorFilter = t.errorFilter;
  } else if (typeof t === 'number' || typeof t === 'string') {
    acc.times = +t || DEFAULT_TIMES;
  } else {
    throw new Error("Invalid arguments for async.retry");
  }
}
/**
 * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
 * wraps a task and makes it retryable, rather than immediately calling it
 * with retries.
 *
 * @name retryable
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.retry]{@link module:ControlFlow.retry}
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
 * options, exactly the same as from `retry`, except for a `opts.arity` that
 * is the arity of the `task` function, defaulting to `task.length`
 * @param {AsyncFunction} task - the asynchronous function to wrap.
 * This function will be passed any arguments passed to the returned wrapper.
 * Invoked with (...args, callback).
 * @returns {AsyncFunction} The wrapped function, which when invoked, will
 * retry on an error, based on the parameters specified in `opts`.
 * This function will accept the same parameters as `task`.
 * @example
 *
 * async.auto({
 *     dep1: async.retryable(3, getFromFlakyService),
 *     process: ["dep1", async.retryable(3, function (results, cb) {
 *         maybeProcessData(results.dep1, cb);
 *     })]
 * }, callback);
 */


function retryable(opts, task) {
  if (!task) {
    task = opts;
    opts = null;
  }

  let arity = opts && opts.arity || task.length;

  if (isAsync(task)) {
    arity += 1;
  }

  var _task = wrapAsync(task);

  return initialParams((args, callback) => {
    if (args.length < arity - 1 || callback == null) {
      args.push(callback);
      callback = promiseCallback();
    }

    function taskFn(cb) {
      _task(...args, cb);
    }

    if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
    return callback[PROMISE_SYMBOL];
  });
}
/**
 * Run the functions in the `tasks` collection in series, each one running once
 * the previous function has completed. If any functions in the series pass an
 * error to its callback, no more functions are run, and `callback` is
 * immediately called with the value of the error. Otherwise, `callback`
 * receives an array of results when `tasks` have completed.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function, and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 *  results from {@link async.series}.
 *
 * **Note** that while many implementations preserve the order of object
 * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
 * explicitly states that
 *
 * > The mechanics and order of enumerating the properties is not specified.
 *
 * So if you rely on the order in which your series of functions are executed,
 * and want this to work on all platforms, consider using an array.
 *
 * @name series
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing
 * [async functions]{@link AsyncFunction} to run in series.
 * Each function can complete with any number of optional `result` values.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This function gets a results array (or object)
 * containing all the result arguments passed to the `task` callbacks. Invoked
 * with (err, result).
 * @return {Promise} a promise, if no callback is passed
 * @example
 *
 * //Using Callbacks
 * async.series([
 *     function(callback) {
 *         setTimeout(function() {
 *             // do some async task
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             // then do another async task
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ], function(err, results) {
 *     console.log(results);
 *     // results is equal to ['one','two']
 * });
 *
 * // an example using objects instead of arrays
 * async.series({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             // do some async task
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             // then do another async task
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     console.log(results);
 *     // results is equal to: { one: 1, two: 2 }
 * });
 *
 * //Using Promises
 * async.series([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ]).then(results => {
 *     console.log(results);
 *     // results is equal to ['one','two']
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * // an example using an object instead of an array
 * async.series({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             // do some async task
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             // then do another async task
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }).then(results => {
 *     console.log(results);
 *     // results is equal to: { one: 1, two: 2 }
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * //Using async/await
 * async () => {
 *     try {
 *         let results = await async.series([
 *             function(callback) {
 *                 setTimeout(function() {
 *                     // do some async task
 *                     callback(null, 'one');
 *                 }, 200);
 *             },
 *             function(callback) {
 *                 setTimeout(function() {
 *                     // then do another async task
 *                     callback(null, 'two');
 *                 }, 100);
 *             }
 *         ]);
 *         console.log(results);
 *         // results is equal to ['one','two']
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * // an example using an object instead of an array
 * async () => {
 *     try {
 *         let results = await async.parallel({
 *             one: function(callback) {
 *                 setTimeout(function() {
 *                     // do some async task
 *                     callback(null, 1);
 *                 }, 200);
 *             },
 *            two: function(callback) {
 *                 setTimeout(function() {
 *                     // then do another async task
 *                     callback(null, 2);
 *                 }, 100);
 *            }
 *         });
 *         console.log(results);
 *         // results is equal to: { one: 1, two: 2 }
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function series(tasks, callback) {
  return _parallel(eachOfSeries$1, tasks, callback);
}
/**
 * Returns `true` if at least one element in the `coll` satisfies an async test.
 * If any iteratee call returns `true`, the main `callback` is immediately
 * called.
 *
 * @name some
 * @static
 * @memberOf module:Collections
 * @method
 * @alias any
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in parallel.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 * @example
 *
 * // dir1 is a directory that contains file1.txt, file2.txt
 * // dir2 is a directory that contains file3.txt, file4.txt
 * // dir3 is a directory that contains file5.txt
 * // dir4 does not exist
 *
 * // asynchronous function that checks if a file exists
 * function fileExists(file, callback) {
 *    fs.access(file, fs.constants.F_OK, (err) => {
 *        callback(null, !err);
 *    });
 * }
 *
 * // Using callbacks
 * async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists,
 *    function(err, result) {
 *        console.log(result);
 *        // true
 *        // result is true since some file in the list exists
 *    }
 *);
 *
 * async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists,
 *    function(err, result) {
 *        console.log(result);
 *        // false
 *        // result is false since none of the files exists
 *    }
 *);
 *
 * // Using Promises
 * async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists)
 * .then( result => {
 *     console.log(result);
 *     // true
 *     // result is true since some file in the list exists
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists)
 * .then( result => {
 *     console.log(result);
 *     // false
 *     // result is false since none of the files exists
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists);
 *         console.log(result);
 *         // true
 *         // result is true since some file in the list exists
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 * async () => {
 *     try {
 *         let result = await async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists);
 *         console.log(result);
 *         // false
 *         // result is false since none of the files exists
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function some(coll, iteratee, callback) {
  return _createTester(Boolean, res => res)(eachOf$1, coll, iteratee, callback);
}

var some$1 = awaitify(some, 3);
/**
 * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
 *
 * @name someLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anyLimit
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in parallel.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */

function someLimit(coll, limit, iteratee, callback) {
  return _createTester(Boolean, res => res)(eachOfLimit(limit), coll, iteratee, callback);
}

var someLimit$1 = awaitify(someLimit, 4);
/**
 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anySeries
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in series.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 */

function someSeries(coll, iteratee, callback) {
  return _createTester(Boolean, res => res)(eachOfSeries$1, coll, iteratee, callback);
}

var someSeries$1 = awaitify(someSeries, 3);
/**
 * Sorts a list by the results of running each `coll` value through an async
 * `iteratee`.
 *
 * @name sortBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a value to use as the sort criteria as
 * its `result`.
 * Invoked with (item, callback).
 * @param {Function} callback - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is the items
 * from the original `coll` sorted by the values returned by the `iteratee`
 * calls. Invoked with (err, results).
 * @returns {Promise} a promise, if no callback passed
 * @example
 *
 * // bigfile.txt is a file that is 251100 bytes in size
 * // mediumfile.txt is a file that is 11000 bytes in size
 * // smallfile.txt is a file that is 121 bytes in size
 *
 * // asynchronous function that returns the file size in bytes
 * function getFileSizeInBytes(file, callback) {
 *     fs.stat(file, function(err, stat) {
 *         if (err) {
 *             return callback(err);
 *         }
 *         callback(null, stat.size);
 *     });
 * }
 *
 * // Using callbacks
 * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], getFileSizeInBytes,
 *     function(err, results) {
 *         if (err) {
 *             console.log(err);
 *         } else {
 *             console.log(results);
 *             // results is now the original array of files sorted by
 *             // file size (ascending by default), e.g.
 *             // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
 *         }
 *     }
 * );
 *
 * // By modifying the callback parameter the
 * // sorting order can be influenced:
 *
 * // ascending order
 * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], function(file, callback) {
 *     getFileSizeInBytes(file, function(getFileSizeErr, fileSize) {
 *         if (getFileSizeErr) return callback(getFileSizeErr);
 *         callback(null, fileSize);
 *     });
 * }, function(err, results) {
 *         if (err) {
 *             console.log(err);
 *         } else {
 *             console.log(results);
 *             // results is now the original array of files sorted by
 *             // file size (ascending by default), e.g.
 *             // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
 *         }
 *     }
 * );
 *
 * // descending order
 * async.sortBy(['bigfile.txt','mediumfile.txt','smallfile.txt'], function(file, callback) {
 *     getFileSizeInBytes(file, function(getFileSizeErr, fileSize) {
 *         if (getFileSizeErr) {
 *             return callback(getFileSizeErr);
 *         }
 *         callback(null, fileSize * -1);
 *     });
 * }, function(err, results) {
 *         if (err) {
 *             console.log(err);
 *         } else {
 *             console.log(results);
 *             // results is now the original array of files sorted by
 *             // file size (ascending by default), e.g.
 *             // [ 'bigfile.txt', 'mediumfile.txt', 'smallfile.txt']
 *         }
 *     }
 * );
 *
 * // Error handling
 * async.sortBy(['mediumfile.txt','smallfile.txt','missingfile.txt'], getFileSizeInBytes,
 *     function(err, results) {
 *         if (err) {
 *             console.log(err);
 *             // [ Error: ENOENT: no such file or directory ]
 *         } else {
 *             console.log(results);
 *         }
 *     }
 * );
 *
 * // Using Promises
 * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], getFileSizeInBytes)
 * .then( results => {
 *     console.log(results);
 *     // results is now the original array of files sorted by
 *     // file size (ascending by default), e.g.
 *     // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
 * }).catch( err => {
 *     console.log(err);
 * });
 *
 * // Error handling
 * async.sortBy(['mediumfile.txt','smallfile.txt','missingfile.txt'], getFileSizeInBytes)
 * .then( results => {
 *     console.log(results);
 * }).catch( err => {
 *     console.log(err);
 *     // [ Error: ENOENT: no such file or directory ]
 * });
 *
 * // Using async/await
 * (async () => {
 *     try {
 *         let results = await async.sortBy(['bigfile.txt','mediumfile.txt','smallfile.txt'], getFileSizeInBytes);
 *         console.log(results);
 *         // results is now the original array of files sorted by
 *         // file size (ascending by default), e.g.
 *         // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * })();
 *
 * // Error handling
 * async () => {
 *     try {
 *         let results = await async.sortBy(['missingfile.txt','mediumfile.txt','smallfile.txt'], getFileSizeInBytes);
 *         console.log(results);
 *     }
 *     catch (err) {
 *         console.log(err);
 *         // [ Error: ENOENT: no such file or directory ]
 *     }
 * }
 *
 */

function sortBy(coll, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);

  return map$1(coll, (x, iterCb) => {
    _iteratee(x, (err, criteria) => {
      if (err) return iterCb(err);
      iterCb(err, {
        value: x,
        criteria
      });
    });
  }, (err, results) => {
    if (err) return callback(err);
    callback(null, results.sort(comparator).map(v => v.value));
  });

  function comparator(left, right) {
    var a = left.criteria,
        b = right.criteria;
    return a < b ? -1 : a > b ? 1 : 0;
  }
}

var sortBy$1 = awaitify(sortBy, 3);
/**
 * Sets a time limit on an asynchronous function. If the function does not call
 * its callback within the specified milliseconds, it will be called with a
 * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
 *
 * @name timeout
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} asyncFn - The async function to limit in time.
 * @param {number} milliseconds - The specified time limit.
 * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
 * to timeout Error for more information..
 * @returns {AsyncFunction} Returns a wrapped function that can be used with any
 * of the control flow functions.
 * Invoke this function with the same parameters as you would `asyncFunc`.
 * @example
 *
 * function myFunction(foo, callback) {
 *     doAsyncTask(foo, function(err, data) {
 *         // handle errors
 *         if (err) return callback(err);
 *
 *         // do some stuff ...
 *
 *         // return processed data
 *         return callback(null, data);
 *     });
 * }
 *
 * var wrapped = async.timeout(myFunction, 1000);
 *
 * // call `wrapped` as you would `myFunction`
 * wrapped({ bar: 'bar' }, function(err, data) {
 *     // if `myFunction` takes < 1000 ms to execute, `err`
 *     // and `data` will have their expected values
 *
 *     // else `err` will be an Error with the code 'ETIMEDOUT'
 * });
 */

function timeout(asyncFn, milliseconds, info) {
  var fn = wrapAsync(asyncFn);
  return initialParams((args, callback) => {
    var timedOut = false;
    var timer;

    function timeoutCallback() {
      var name = asyncFn.name || 'anonymous';
      var error = new Error('Callback function "' + name + '" timed out.');
      error.code = 'ETIMEDOUT';

      if (info) {
        error.info = info;
      }

      timedOut = true;
      callback(error);
    }

    args.push((...cbArgs) => {
      if (!timedOut) {
        callback(...cbArgs);
        clearTimeout(timer);
      }
    }); // setup timer and call original function

    timer = setTimeout(timeoutCallback, milliseconds);
    fn(...args);
  });
}

function range(size) {
  var result = Array(size);

  while (size--) {
    result[size] = size;
  }

  return result;
}
/**
 * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name timesLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} count - The number of times to run the function.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - The async function to call `n` times.
 * Invoked with the iteration index and a callback: (n, next).
 * @param {Function} callback - see [async.map]{@link module:Collections.map}.
 * @returns {Promise} a promise, if no callback is provided
 */


function timesLimit(count, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);

  return mapLimit$1(range(count), limit, _iteratee, callback);
}
/**
 * Calls the `iteratee` function `n` times, and accumulates results in the same
 * manner you would use with [map]{@link module:Collections.map}.
 *
 * @name times
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {AsyncFunction} iteratee - The async function to call `n` times.
 * Invoked with the iteration index and a callback: (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 * @returns {Promise} a promise, if no callback is provided
 * @example
 *
 * // Pretend this is some complicated async factory
 * var createUser = function(id, callback) {
 *     callback(null, {
 *         id: 'user' + id
 *     });
 * };
 *
 * // generate 5 users
 * async.times(5, function(n, next) {
 *     createUser(n, function(err, user) {
 *         next(err, user);
 *     });
 * }, function(err, users) {
 *     // we should now have 5 users
 * });
 */


function times(n, iteratee, callback) {
  return timesLimit(n, Infinity, iteratee, callback);
}
/**
 * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
 *
 * @name timesSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {AsyncFunction} iteratee - The async function to call `n` times.
 * Invoked with the iteration index and a callback: (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 * @returns {Promise} a promise, if no callback is provided
 */


function timesSeries(n, iteratee, callback) {
  return timesLimit(n, 1, iteratee, callback);
}
/**
 * A relative of `reduce`.  Takes an Object or Array, and iterates over each
 * element in parallel, each step potentially mutating an `accumulator` value.
 * The type of the accumulator defaults to the type of collection passed in.
 *
 * @name transform
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
 * @param {*} [accumulator] - The initial state of the transform.  If omitted,
 * it will default to an empty Object or Array, depending on the type of `coll`
 * @param {AsyncFunction} iteratee - A function applied to each item in the
 * collection that potentially modifies the accumulator.
 * Invoked with (accumulator, item, key, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the transformed accumulator.
 * Invoked with (err, result).
 * @returns {Promise} a promise, if no callback provided
 * @example
 *
 * // file1.txt is a file that is 1000 bytes in size
 * // file2.txt is a file that is 2000 bytes in size
 * // file3.txt is a file that is 3000 bytes in size
 *
 * // helper function that returns human-readable size format from bytes
 * function formatBytes(bytes, decimals = 2) {
 *   // implementation not included for brevity
 *   return humanReadbleFilesize;
 * }
 *
 * const fileList = ['file1.txt','file2.txt','file3.txt'];
 *
 * // asynchronous function that returns the file size, transformed to human-readable format
 * // e.g. 1024 bytes = 1KB, 1234 bytes = 1.21 KB, 1048576 bytes = 1MB, etc.
 * function transformFileSize(acc, value, key, callback) {
 *     fs.stat(value, function(err, stat) {
 *         if (err) {
 *             return callback(err);
 *         }
 *         acc[key] = formatBytes(stat.size);
 *         callback(null);
 *     });
 * }
 *
 * // Using callbacks
 * async.transform(fileList, transformFileSize, function(err, result) {
 *     if(err) {
 *         console.log(err);
 *     } else {
 *         console.log(result);
 *         // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
 *     }
 * });
 *
 * // Using Promises
 * async.transform(fileList, transformFileSize)
 * .then(result => {
 *     console.log(result);
 *     // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * (async () => {
 *     try {
 *         let result = await async.transform(fileList, transformFileSize);
 *         console.log(result);
 *         // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * })();
 *
 * @example
 *
 * // file1.txt is a file that is 1000 bytes in size
 * // file2.txt is a file that is 2000 bytes in size
 * // file3.txt is a file that is 3000 bytes in size
 *
 * // helper function that returns human-readable size format from bytes
 * function formatBytes(bytes, decimals = 2) {
 *   // implementation not included for brevity
 *   return humanReadbleFilesize;
 * }
 *
 * const fileMap = { f1: 'file1.txt', f2: 'file2.txt', f3: 'file3.txt' };
 *
 * // asynchronous function that returns the file size, transformed to human-readable format
 * // e.g. 1024 bytes = 1KB, 1234 bytes = 1.21 KB, 1048576 bytes = 1MB, etc.
 * function transformFileSize(acc, value, key, callback) {
 *     fs.stat(value, function(err, stat) {
 *         if (err) {
 *             return callback(err);
 *         }
 *         acc[key] = formatBytes(stat.size);
 *         callback(null);
 *     });
 * }
 *
 * // Using callbacks
 * async.transform(fileMap, transformFileSize, function(err, result) {
 *     if(err) {
 *         console.log(err);
 *     } else {
 *         console.log(result);
 *         // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
 *     }
 * });
 *
 * // Using Promises
 * async.transform(fileMap, transformFileSize)
 * .then(result => {
 *     console.log(result);
 *     // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
 * }).catch(err => {
 *     console.log(err);
 * });
 *
 * // Using async/await
 * async () => {
 *     try {
 *         let result = await async.transform(fileMap, transformFileSize);
 *         console.log(result);
 *         // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
 *     }
 *     catch (err) {
 *         console.log(err);
 *     }
 * }
 *
 */


function transform(coll, accumulator, iteratee, callback) {
  if (arguments.length <= 3 && typeof accumulator === 'function') {
    callback = iteratee;
    iteratee = accumulator;
    accumulator = Array.isArray(coll) ? [] : {};
  }

  callback = once(callback || promiseCallback());

  var _iteratee = wrapAsync(iteratee);

  eachOf$1(coll, (v, k, cb) => {
    _iteratee(accumulator, v, k, cb);
  }, err => callback(err, accumulator));
  return callback[PROMISE_SYMBOL];
}
/**
 * It runs each task in series but stops whenever any of the functions were
 * successful. If one of the tasks were successful, the `callback` will be
 * passed the result of the successful task. If all tasks fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name tryEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing functions to
 * run, each function is passed a `callback(err, result)` it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback which is called when one
 * of the tasks has succeeded, or all have failed. It receives the `err` and
 * `result` arguments of the last attempt at completing the `task`. Invoked with
 * (err, results).
 * @returns {Promise} a promise, if no callback is passed
 * @example
 * async.tryEach([
 *     function getDataFromFirstWebsite(callback) {
 *         // Try getting the data from the first website
 *         callback(err, data);
 *     },
 *     function getDataFromSecondWebsite(callback) {
 *         // First website failed,
 *         // Try getting the data from the backup website
 *         callback(err, data);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     Now do something with the data.
 * });
 *
 */


function tryEach(tasks, callback) {
  var error = null;
  var result;
  return eachSeries$1(tasks, (task, taskCb) => {
    wrapAsync(task)((err, ...args) => {
      if (err === false) return taskCb(err);

      if (args.length < 2) {
        [result] = args;
      } else {
        result = args;
      }

      error = err;
      taskCb(err ? null : {});
    });
  }, () => callback(error, result));
}

var tryEach$1 = awaitify(tryEach);
/**
 * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
 * unmemoized form. Handy for testing.
 *
 * @name unmemoize
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.memoize]{@link module:Utils.memoize}
 * @category Util
 * @param {AsyncFunction} fn - the memoized function
 * @returns {AsyncFunction} a function that calls the original unmemoized function
 */

function unmemoize(fn) {
  return (...args) => {
    return (fn.unmemoized || fn)(...args);
  };
}
/**
 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs.
 *
 * @name whilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} test - asynchronous truth test to perform before each
 * execution of `iteratee`. Invoked with ().
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` passes. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * var count = 0;
 * async.whilst(
 *     function test(cb) { cb(null, count < 5); },
 *     function iter(callback) {
 *         count++;
 *         setTimeout(function() {
 *             callback(null, count);
 *         }, 1000);
 *     },
 *     function (err, n) {
 *         // 5 seconds have passed, n = 5
 *     }
 * );
 */


function whilst(test, iteratee, callback) {
  callback = onlyOnce(callback);

  var _fn = wrapAsync(iteratee);

  var _test = wrapAsync(test);

  var results = [];

  function next(err, ...rest) {
    if (err) return callback(err);
    results = rest;
    if (err === false) return;

    _test(check);
  }

  function check(err, truth) {
    if (err) return callback(err);
    if (err === false) return;
    if (!truth) return callback(null, ...results);

    _fn(next);
  }

  return _test(check);
}

var whilst$1 = awaitify(whilst, 3);
/**
 * Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs. `callback` will be passed an error and any
 * arguments passed to the final `iteratee`'s callback.
 *
 * The inverse of [whilst]{@link module:ControlFlow.whilst}.
 *
 * @name until
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {AsyncFunction} test - asynchronous truth test to perform before each
 * execution of `iteratee`. Invoked with (callback).
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` fails. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if a callback is not passed
 *
 * @example
 * const results = []
 * let finished = false
 * async.until(function test(cb) {
 *     cb(null, finished)
 * }, function iter(next) {
 *     fetchPage(url, (err, body) => {
 *         if (err) return next(err)
 *         results = results.concat(body.objects)
 *         finished = !!body.next
 *         next(err)
 *     })
 * }, function done (err) {
 *     // all pages have been fetched
 * })
 */

function until(test, iteratee, callback) {
  const _test = wrapAsync(test);

  return whilst$1(cb => _test((err, truth) => cb(err, !truth)), iteratee, callback);
}
/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
 * to run.
 * Each function should complete with any number of `result` values.
 * The `result` values will be passed as arguments, in order, to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */


function waterfall(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
  if (!tasks.length) return callback();
  var taskIndex = 0;

  function nextTask(args) {
    var task = wrapAsync(tasks[taskIndex++]);
    task(...args, onlyOnce(next));
  }

  function next(err, ...args) {
    if (err === false) return;

    if (err || taskIndex === tasks.length) {
      return callback(err, ...args);
    }

    nextTask(args);
  }

  nextTask([]);
}

var waterfall$1 = awaitify(waterfall);
/**
 * An "async function" in the context of Async is an asynchronous function with
 * a variable number of parameters, with the final parameter being a callback.
 * (`function (arg1, arg2, ..., callback) {}`)
 * The final callback is of the form `callback(err, results...)`, which must be
 * called once the function is completed.  The callback should be called with a
 * Error as its first argument to signal that an error occurred.
 * Otherwise, if no error occurred, it should be called with `null` as the first
 * argument, and any additional `result` arguments that may apply, to signal
 * successful completion.
 * The callback must be called exactly once, ideally on a later tick of the
 * JavaScript event loop.
 *
 * This type of function is also referred to as a "Node-style async function",
 * or a "continuation passing-style function" (CPS). Most of the methods of this
 * library are themselves CPS/Node-style async functions, or functions that
 * return CPS/Node-style async functions.
 *
 * Wherever we accept a Node-style async function, we also directly accept an
 * [ES2017 `async` function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}.
 * In this case, the `async` function will not be passed a final callback
 * argument, and any thrown error will be used as the `err` argument of the
 * implicit callback, and the return value will be used as the `result` value.
 * (i.e. a `rejected` of the returned Promise becomes the `err` callback
 * argument, and a `resolved` value becomes the `result`.)
 *
 * Note, due to JavaScript limitations, we can only detect native `async`
 * functions and not transpilied implementations.
 * Your environment must have `async`/`await` support for this to work.
 * (e.g. Node > v7.6, or a recent version of a modern browser).
 * If you are using `async` functions through a transpiler (e.g. Babel), you
 * must still wrap the function with [asyncify]{@link module:Utils.asyncify},
 * because the `async function` will be compiled to an ordinary function that
 * returns a promise.
 *
 * @typedef {Function} AsyncFunction
 * @static
 */

var index = {
  apply,
  applyEach: applyEach$1,
  applyEachSeries,
  asyncify,
  auto,
  autoInject,
  cargo,
  cargoQueue: cargo$1,
  compose,
  concat: concat$1,
  concatLimit: concatLimit$1,
  concatSeries: concatSeries$1,
  constant,
  detect: detect$1,
  detectLimit: detectLimit$1,
  detectSeries: detectSeries$1,
  dir,
  doUntil,
  doWhilst: doWhilst$1,
  each,
  eachLimit: eachLimit$2,
  eachOf: eachOf$1,
  eachOfLimit: eachOfLimit$2,
  eachOfSeries: eachOfSeries$1,
  eachSeries: eachSeries$1,
  ensureAsync,
  every: every$1,
  everyLimit: everyLimit$1,
  everySeries: everySeries$1,
  filter: filter$1,
  filterLimit: filterLimit$1,
  filterSeries: filterSeries$1,
  forever: forever$1,
  groupBy,
  groupByLimit: groupByLimit$1,
  groupBySeries,
  log,
  map: map$1,
  mapLimit: mapLimit$1,
  mapSeries: mapSeries$1,
  mapValues,
  mapValuesLimit: mapValuesLimit$1,
  mapValuesSeries,
  memoize,
  nextTick,
  parallel,
  parallelLimit,
  priorityQueue,
  queue: queue$1,
  race: race$1,
  reduce: reduce$1,
  reduceRight,
  reflect,
  reflectAll,
  reject: reject$2,
  rejectLimit: rejectLimit$1,
  rejectSeries: rejectSeries$1,
  retry,
  retryable,
  seq,
  series,
  setImmediate: setImmediate$1,
  some: some$1,
  someLimit: someLimit$1,
  someSeries: someSeries$1,
  sortBy: sortBy$1,
  timeout,
  times,
  timesLimit,
  timesSeries,
  transform,
  tryEach: tryEach$1,
  unmemoize,
  until,
  waterfall: waterfall$1,
  whilst: whilst$1,
  // aliases
  all: every$1,
  allLimit: everyLimit$1,
  allSeries: everySeries$1,
  any: some$1,
  anyLimit: someLimit$1,
  anySeries: someSeries$1,
  find: detect$1,
  findLimit: detectLimit$1,
  findSeries: detectSeries$1,
  flatMap: concat$1,
  flatMapLimit: concatLimit$1,
  flatMapSeries: concatSeries$1,
  forEach: each,
  forEachSeries: eachSeries$1,
  forEachLimit: eachLimit$2,
  forEachOf: eachOf$1,
  forEachOfSeries: eachOfSeries$1,
  forEachOfLimit: eachOfLimit$2,
  inject: reduce$1,
  foldl: reduce$1,
  foldr: reduceRight,
  select: filter$1,
  selectLimit: filterLimit$1,
  selectSeries: filterSeries$1,
  wrapSync: asyncify,
  during: whilst$1,
  doDuring: doWhilst$1
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************!*\
  !*** ./client.js ***!
  \*******************/
/*
 * @Date: 2022-03-31 09:46:25
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-21 14:08:23
 * @FilePath: /sharedb/examples/textarea/client.js
 * @Description:
 */
// sharedb 协同
var sharedb = __webpack_require__(/*! ../modules/sharedb/lib/client */ "../modules/sharedb/lib/client/index.js"); // websocket 连接


var ReconnectingWebSocket = (__webpack_require__(/*! ../modules/reconnecting-websocket */ "../modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js")["default"]); // console.log('ReconnectingWebSocket=', ReconnectingWebSocket)
//给input添加onChange事件，触发onChange事件 变成op，调用sharedb 发布op消息 


var StringBinding = __webpack_require__(/*! ../modules/sharedb-string-binding */ "../modules/sharedb-string-binding/index.js"); // socket


var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket); // textarea dom

var element = document.querySelector('textarea'); //  dom

var statusSpan = document.getElementById('status-span');
statusSpan.innerHTML = 'Not Connected';
element.style.backgroundColor = 'gray';
socket.addEventListener('open', function () {
  statusSpan.innerHTML = 'Connected';
  element.style.backgroundColor = 'white';
});
socket.addEventListener('close', function () {
  statusSpan.innerHTML = 'Closed';
  element.style.backgroundColor = 'gray';
});
socket.addEventListener('error', function () {
  statusSpan.innerHTML = 'Error';
  element.style.backgroundColor = 'red';
}); // Create local Doc instance mapped to 'examples' collection document with id 'textarea'
//创建本地文档实例映射到id为“textarea”的“examples”集合文档
// 获取到文档对象

var doc = connection.get('examples', 'textarea'); // console.log("doc.subscribe=", doc.subscribe);
// 获取到文档对象

doc.subscribe(function (err) {
  if (err) {
    throw err;
  } //绑定 input 事件


  var binding = new StringBinding(element, doc, ['content']); // 初始化

  binding.setup();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map