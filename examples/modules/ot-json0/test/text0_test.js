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

// console.log("json0=", json0);
// // 插入
// let insterOp1 = {
//   p: ["content", 0],
//   si: "a",
// };
// let op1 = json0.type.normalize(insterOp1);

// // 上一次文本
// let snapshot1 = { content: "" };
// let newDoc1 = json0.type.apply(snapshot1, op1);

// console.log("newDoc1=", newDoc1);

// 插入
let insterOp1 = {
  p: ["content", 2], //位置
  si: "b",  // 内容
};
let op1 = json0.type.normalize(insterOp1);



// 上一次文本
let snapshot1 = { content: 'ac' };
let newDoc1 = json0.type.apply(snapshot1, op1);
console.log("newDoc1=", newDoc1);


// 删除
let insterOp2 = {
  p: ["content", 2], //位置
  sd: "c",  // 内容
};
let op2 = json0.type.normalize(insterOp2);



// 上一次文本
let snapshot2 = { content: 'abc' };
let newDoc2 = json0.type.apply(snapshot2, op2);
console.log("newDoc2=", newDoc2);





  // // handle subtype ops
  // if (c.t && subtypes[c.t]) {
  //   c_.t = c.t;
  //   c_.o = subtypes[c.t].invert(c.o);
  // }

  // if (c.si !== void 0) c_.sd = c.si;
  // if (c.sd !== void 0) c_.si = c.sd;

  // if (c.oi !== void 0) c_.od = c.oi;
  // if (c.od !== void 0) c_.oi = c.od;

  // if (c.li !== void 0) c_.ld = c.li;
  // if (c.ld !== void 0) c_.li = c.ld;

  // if (c.na !== void 0) c_.na = -c.na;

  // if (c.lm !== void 0) {
  //   c_.lm = c.p[c.p.length - 1];
  //   c_.p = c.p.slice(0, c.p.length - 1).concat([c.lm]);
  // }
 
