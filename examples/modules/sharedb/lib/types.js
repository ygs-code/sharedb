/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-06 12:55:43
 * @FilePath: /sharedb/examples/textarea/modules/sharedb/lib/types.js
 * @Description:
 */

exports.defaultType = require("../../ot-json0").type;

// exports.defaultType = require('ot-json0').type;

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
