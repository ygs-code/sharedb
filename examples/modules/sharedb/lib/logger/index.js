/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:45:32
 * @FilePath: /sharedb/examples/modules/sharedb/lib/logger/index.js
 * @Description: 
 */

 // console 中的 ["info", "warn", "error"] 日志方法
var Logger = require('./logger');
var logger = new Logger();
module.exports = logger;
