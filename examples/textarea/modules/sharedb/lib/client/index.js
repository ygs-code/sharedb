/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:29:21
 * @FilePath: /sharedb/examples/modules/sharedb/lib/client/index.js
 * @Description: 
 */
// 连接
exports.Connection = require('./connection'); 
// 文档
exports.Doc = require('./doc');
// 错误
exports.Error = require('../error');
// 查询
exports.Query = require('./query');
// 类型
exports.types = require('../types');
// 日志
exports.logger = require('../logger');