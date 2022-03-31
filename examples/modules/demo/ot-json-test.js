/*
 * @Date: 2022-03-31 18:27:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 18:47:35
 * @FilePath: /sharedb/examples/modules/demo/ot-json-test.js
 * @Description: 
 */
/*
json0 ：  https://github.com/ottypes/json0
json1 ：  https://github.com/ottypes/json1
ot-json1 ：https://github.com/Calyhre/ot-json1-immutable



 */

// const ot = require("../ot-json0");
const json1 = require('../../modules/ot-json1')
console.log('json1=========',json1)

//操作1
const op1 = json1.moveOp(['a', 'x'], ['a', 'y'])

// The easiest way to make compound operations is to just compose smaller operations
//操作2
const op2 = [
  json1.moveOp(['a'], ['b']),
  json1.insertOp(['b', 'z'], 'hi there')
].reduce(json1.type.compose, null)

// op2 = [['a', {p:0}], ['b', {d:0}, 'x', {i: 'hi there'}]]

const op1_ = json1.type.transform(op1, op2, 'left')
// op1_ now moves b.x -> b.y instead, because op2 moved 'a' to 'b'.

let doc = {a: {x: 5}}
doc = json1.type.apply(doc, op2) // doc = {b: {x: 5, z: 'hi there'}}
doc = json1.type.apply(doc, op1_) // doc = {b: {y: 5, z: 'hi there'}}


// Using the CP1 diamond property, this is the same as:

doc = {a: {x: 5}}
doc = json1.type.apply(doc, op1) // doc = {a: {y: 5}}
const op2_ = json1.type.transform(op2, op1, 'right')
doc = json1.type.apply(doc, op2) // doc = {b: {y: 5, z: 'hi there'}}

console.log('doc=',doc)