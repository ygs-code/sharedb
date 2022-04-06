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

var EventEmitter = require("events").EventEmitter;

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
