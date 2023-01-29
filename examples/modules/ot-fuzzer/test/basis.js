/*
 * @Date: 2022-03-31 17:05:41
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 17:08:40
 * @FilePath: /sharedb/examples/modules/ot-fuzzer/test/basis.js
 * @Description:
 */
const fuzzer = require("../lib");

// describe("basis", () =>
//   it("basis tests", function () {
//     console.log(
//       "I have " +
//         fuzzer.randomInt(100) +
//         " " +
//         fuzzer.randomWord() +
//         " in my basket"
//     );
//   }));

console.log(
  "I have " +
    fuzzer.randomInt(1000) +
    " " +
    fuzzer.randomWord() +
    " in my basket"
);
