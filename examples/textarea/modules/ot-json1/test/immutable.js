/*
 * @Date: 2022-03-31 18:38:03
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 20:31:09
 * @FilePath: /sharedb/examples/modules/ot-json1/test/immutable.js
 * @Description: 
 */
const assert = require('assert')
const { type } = require('../dist/json1.release')
const log = require('../dist/log').default
const genOp = require('./genOp')
const deepClone = require('../dist/deepClone').default

// This tests that none of apply / compose / transform / genOp mutate their input
describe('immutable guarantees', function() {
  // 源文档
  const origDoc = { x: 'hi', y: 'omg', z: [1, 'whoa', 3] }
  //深拷贝
  const expectDoc = deepClone(origDoc)
  const n = 2
  // // These tests are only slow in debug mode. In release mode they're pretty snappy.
  // this.slow(n * 5)
  // //延迟
  // this.timeout(n * 10)

  it('apply does not mutate', () => {
    const result = []
    for (let i = 0; i < n; i++) {
      const [op, doc] = genOp(origDoc)

      console.log('origDoc=',origDoc)
      console.log('expectDoc=',origDoc)
      console.log('op=',op)
      console.log('doc=',doc)

    
      // 判断两个对象是否相等
      assert.deepStrictEqual(origDoc, expectDoc)
      
      const expectOp = deepClone(op)
      try {
        // 合并
        type.apply(origDoc, op)
        // console.log('  type.apply=======' ,  type.apply.name)
      } catch (e) {
        console.log(`Apply failed! Repro apply( ${JSON.stringify(origDoc)}, ${JSON.stringify(op)} )`)
        throw e
      }

      assert.deepStrictEqual(origDoc, expectDoc)
     
                           // 这里肯定相等因为他们是深拷贝的
      result.push(assert.deepStrictEqual(op, expectOp))
    }
    return result
  })

  // it('compose does not mutate', () => {
  //   for (let i = 0; i < n; i++) {
  //     let op2
  //     let [op1, doc] = genOp(origDoc)
  //     ;[op2, doc] = genOp(doc)

  //     const expectOp1 = deepClone(op1)
  //     const expectOp2 = deepClone(op2)
  //     type.compose(
  //       op1,
  //       op2
  //     )

  //     assert.deepStrictEqual(op1, expectOp1)
  //     assert.deepStrictEqual(op2, expectOp2)
  //   }
  // })

  // it('transform does not mutate', () => {
  //   for (let i = 0; i < n; i++) {
  //     const [op1, doc1] = genOp(origDoc)
  //     const [op2, doc2] = genOp(origDoc)

  //     const expectOp1 = deepClone(op1)
  //     const expectOp2 = deepClone(op2)

  //     type.transformNoConflict(op1, op2, 'left')
  //     type.transformNoConflict(op2, op1, 'right')
  //     assert.deepStrictEqual(op1, expectOp1)
  //     assert.deepStrictEqual(op2, expectOp2)
  //   }
  // })
})
