'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (worker, concurrency) {
    // Start with a normal queue
    var q = (0, _queue2.default)(worker, concurrency);
    var processingScheduled = false;

    q._tasks = new _Heap2.default();

    // Override push to accept second parameter representing priority
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
            return (0, _setImmediate2.default)(() => q.drain());
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
            (0, _setImmediate2.default)(() => {
                processingScheduled = false;
                q.process();
            });
        }
    };

    // Remove unshift function
    delete q.unshift;

    return q;
};

var _setImmediate = require('./setImmediate.js');

var _setImmediate2 = _interopRequireDefault(_setImmediate);

var _queue = require('./queue.js');

var _queue2 = _interopRequireDefault(_queue);

var _Heap = require('./internal/Heap.js');

var _Heap2 = _interopRequireDefault(_Heap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

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