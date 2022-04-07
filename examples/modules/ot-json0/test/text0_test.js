/*
 * @Date: 2022-04-07 16:18:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-07 17:12:07
 * @FilePath: /sharedb/examples/modules/ot-json0/test/text0_test.js
 * @Description:
 */

var json0 = require("../lib");

/*
"content" 是文档key
*/

console.log("json0=", json0);
// 插入
let insterOp1 = {
  p: ["content", 0],
  si: "a",
};
let op1 = json0.type.normalize(insterOp1);

// 上一次文本
let snapshot1 = { content: "" };
let newDoc1 = json0.type.apply(snapshot1, op1);

console.log("newDoc1=", newDoc1);

// 插入
let insterOp2 = {
  p: ["content", 1],
  si: "b",
};
let op2 = json0.type.normalize(insterOp2);

// 上一次文本
let snapshot2 = { content: 'ac' };
let newDoc2 = json0.type.apply(snapshot2, op2);
console.log("newDoc2=", newDoc2);







// 编辑
