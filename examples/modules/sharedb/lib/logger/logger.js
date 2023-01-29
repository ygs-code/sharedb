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
};

// let logger = new Logger();
// logger.warn("Invalid version from server. Expected: ");
