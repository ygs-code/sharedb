// 断言
const assert = require("assert");
// 工具模块 相当于一个类
const util = require("util");
const fs = require("fs");
// 随机数生成
const seedrandom = require("seedrandom");
// 易于使用的进度条命令行/终端应用程序
const { Bar, Presets } = require("cli-progress");

const nestedObject = {};
// nestedObject.a = [nestedObject];
// nestedObject.b = [['a', ['b']], 'b', 'c', 'd'];
// nestedObject.b = {};
// nestedObject.b.inner = nestedObject.b;
// nestedObject.b.obj = nestedObject;

console.log(
  "1.>",
  JSON.stringify(
    util.inspect(
      {
        colors: "abcd",
        depth: "asdfsdf",
      },
      { colors: true, depth: null }
    )
  )
);

// var myrng =  seedrandom;
// console.log(myrng());                // Always 0.9282578795792454
// console.log(myrng().int32());          // Always 1966374204
// console.log(myrng().quick());          // Always 0.7316977467853576
// console.log(myrng().double());          //

const debugMode = !!process.env.DEBUG;

// You can use this to enable debugging info in this file.
const p = (x) => {
  if (debugMode) console.warn(x);
};
//  检查
const i = (o) =>
  debugMode ? util.inspect(o, { colors: true, depth: null }) : "";

// By default, use a new seed every 6 hours. This balances making test runs stable while debugging
// with avoiding obscure bugs caused by a rare seed.
//seed = Math.floor Date.now() / (1000*60*60*6)
const seed = process.env.SEED != null ? process.env.SEED : 1;

const restorefile =
  process.env.SYNCFILE != null ? process.env.SYNCFILE : "fuzzercrash.data";
let restorestate = {
  iter: 0,
  seedstate: true,
};

try {
  restorestate = JSON.parse(fs.readFileSync(restorefile, "utf8"));
  console.log(`restored from ${restorefile} iteration ${restorestate.iter}`);
} catch (error) {}

console.log("restorestate=", restorestate);

// 产生随机数
const randomReal = (exports.randomReal = seedrandom(seed, {
  state: restorestate.seedstate,
}));

console.log("randomReal=", randomReal());

// Generate a random int 0 <= k < n
//  产生随机数
const randomInt = (exports.randomInt = (n) => Math.floor(randomReal() * n));

// Return a random word from a corpus each time the method is called
// 每次调用该方法时，从语料库中返回一个随机单词
// 读取jabberwocky.txt文件中的单词，并形成一个数组
const randWords = fs
  .readFileSync(__dirname + "/jabberwocky.txt")
  .toString()
  .split(/\W+/);
console.log("randWords=", randWords);

const randomWord = (exports.randomWord = () =>
  randWords[randomInt(randWords.length)]);
console.log("randomWord=", randomWord());
// Cross-transform function. Transform server by client and client by server. Returns
// [server, client].
// Cross-transform函数。按客户端转换服务器，按服务器转换客户机。返回
const transformX = (type, left, right) => [
  type.transform(left, right, "left"),
  type.transform(right, left, "right"),
];

// Transform a list of server ops by a list of client ops.
// Returns [serverOps', clientOps'].
// This is O(serverOps.length * clientOps.length)
//将服务器操作列表转换为客户端操作列表。
//返回[serverOps'， clientOps']。
//这是O(serverOps。长度* clientOps.length)
function transformLists(
  type,
  serverOps, // 服务器 op
  clientOps //  客户端 op
) {
  clientOps = clientOps.slice(); // Shallow copy for inline replaces.
  const serverOpsOut = [];

  for (let s of serverOps) {
    for (let ci = 0; ci < clientOps.length; ci++) {
      [s, clientOps[ci]] = transformX(type, s, clientOps[ci]);
    }

    serverOpsOut.push(s);
  }

  return [serverOpsOut, clientOps];
}

// Compose a whole list of ops together 一起写一份行动清单
const composeList = (type, ops) => ops.reduce(type.compose);

// This is needed because calling apply() might destroy the original object.
// These two variants have almost the same performance.
// const clone = function(o) { if (typeof o === 'object') { return JSON.parse(JSON.stringify(o)); } else { return o; } };
//这是必需的，因为调用apply()可能会销毁原来的对象。
//这两种变体的性能几乎相同。
// const clone = function(o) {if (typeof o === = 'object') {return JSON.parse(JSON.stringify(o));} else {return o;}};
function clone(old) {
  if (old === null) return null;
  else if (Array.isArray(old)) return old.map(clone);
  else if (typeof old === "object") {
    const o = {};
    for (let k in old) o[k] = clone(old[k]);
    return o;
  }
  // Everything else in JS is immutable.
  else return old;
}

// Returns client result //返回客户端结果
const testRandomOp = function (type, genRandomOp, initialDoc = type.create()) {
  const makeDoc = () => ({
    ops: [],
    result: initialDoc,
  });
  const opSets = [0, 1, 2].map(() => makeDoc());
  const [client, client2, server] = opSets;

  let doc;
  for (let i = 0; i < 10; i++) {
    doc = opSets[randomInt(3)];
    let [op, newDoc] = genRandomOp(doc.result);
    if (type.makeInvertible) op = type.makeInvertible(op, doc.result);
    doc.result = newDoc;
    doc.ops.push(op);
  }

  for (const { ops, result } of [client, client2, server]) {
    p(`Doc ${i(initialDoc)} + ${i(ops)} = ${i(result)}`);
  }

  const checkSnapshotsEq = function (a, b) {
    if (type.serialize)
      assert.deepStrictEqual(type.serialize(a), type.serialize(b));
    else assert.deepStrictEqual(a, b);
  };

  // First, test type.apply. //首先，测试类型。
  for (const set of opSets) {
    let s = clone(initialDoc);
    for (const op of set.ops) s = type.apply(s, op);

    checkSnapshotsEq(s, set.result);
  }

  // If the type has a shatter function, we should be able to shatter all the
  // ops, apply them and get the same results.
  //如果该类型有一个打散函数，我们应该能够打散所有
  // ops，应用它们得到相同的结果。
  if (type.shatter) {
    for (const set of opSets) {
      let s = clone(initialDoc);
      for (const op of set.ops) {
        for (const atom of type.shatter(op)) {
          s = type.apply(s, atom);
        }
      }

      checkSnapshotsEq(s, set.result);
    }
  }

  if (type.invert != null) {
    // Invert all the ops and apply them to result. Should end up with initialDoc.
    //反转所有的运算并应用到result。应该以initialDoc结束。
    for (const set of opSets) {
      let snapshot = clone(set.result);

      for (let i = set.ops.length - 1; i >= 0; i--) {
        const op = set.ops[i];
        const op_ = type.invert(op);
        snapshot = type.apply(snapshot, op_);
      }

      checkSnapshotsEq(snapshot, initialDoc);
    }
  }

  if (type.diff != null)
    for (const set of opSets) {
      if (doc.ops.length > 0) {
        const op_ = type.diff(clone(initialDoc), set.result);
        const result = type.apply(clone(initialDoc), op_);

        checkSnapshotsEq(result, set.result);
      }
    }

  if (type.diffX != null) {
    for (const set of opSets) {
      const [op1_, op2_] = type.diffX(initialDoc, set.result);
      const result1 = type.apply(clone(set.result), op1_);
      const result2 = type.apply(clone(initialDoc), op2_);

      checkSnapshotsEq(result1, initialDoc);
      checkSnapshotsEq(result2, set.result);
    }
  }

  // If all the ops are composed together, then applied, we should get the same result.
  //反转所有的运算并应用到result。应该以initialDoc结束。
  if (type.compose != null) {
    p("COMPOSE");
    const compose = (set) => {
      if (set.ops.length > 0) {
        set.composed = composeList(type, set.ops);
        p(`Compose ${i(set.ops)} = ${i(set.composed)}`);
        // .... And this should match the expected document.
        //……这应该与预期的文档相匹配。
        checkSnapshotsEq(
          set.result,
          type.apply(clone(initialDoc), set.composed)
        );
      }
    };

    for (const set of opSets) compose(set);

    // for (const set of opSets) { if (set.composed !== undefined) { if (typeof testInvert === 'function') {
    //   testInvert(set, [set.composed]);
    // } } }

    // Check the diamond property holds //检查钻石属性保持
    if (client.composed !== undefined && server.composed !== undefined) {
      p(
        `Diamond\n\toriginal: ${i(initialDoc)}\n\tLeft: + ${i(
          server.composed
        )} -> ${i(server.result)}\n\tRight: + ${i(client.composed)} -> ${i(
          client.result
        )}`
      );

      const [server_, client_] = transformX(
        type,
        server.composed,
        client.composed
      );
      p(
        `XF ${i(server.composed)} x ${i(client.composed)} -> ${i(
          server_
        )} x ${i(client_)}`
      );

      const s_c = type.apply(clone(server.result), client_);
      const c_s = type.apply(clone(client.result), server_);

      // Interestingly, these will not be the same as s_c and c_s above.
      // Eg, when:
      //  server.ops = [ [ { d: 'x' } ], [ { i: 'c' } ] ]
      //  client.ops = [ 1, { i: 'b' } ]
      checkSnapshotsEq(s_c, c_s);

      if (type.tp2) {
        // This is an interesting property which I don't think is strictly
        // enforced by the TP2 property, but which my text-tp2 type holds. I'm
        // curious if this will hold for any TP2 type.
        //
        // Given X, [A,B] based on a document, I'm testing if:
        //  T(T(x, A), B) == T(x, A.B).
        //
        // Because this holds, it is possible to collapse intermediate ops
        // without effecting the OT code.
        let x1 = server.composed;
        for (const c of client.ops) {
          x1 = type.transform(x1, c, "left");
        }

        let x2 = server.composed;
        x2 = type.transform(x2, client.composed, "left");

        assert.deepStrictEqual(x1, x2);
      }

      if (type.tp2 && client2.composed !== undefined) {
        // TP2 requires that T(op3, op1 . T(op2, op1)) == T(op3, op2 . T(op1, op2)).
        const lhs = type.transform(
          client2.composed,
          type.compose(client.composed, server_),
          "left"
        );
        const rhs = type.transform(
          client2.composed,
          type.compose(server.composed, client_),
          "left"
        );

        assert.deepStrictEqual(lhs, rhs);
      }
    }
  }

  if (type.prune != null) {
    p("PRUNE");

    const [op1] = genRandomOp(initialDoc);
    const [op2] = genRandomOp(initialDoc);

    for (const idDelta of ["left", "right"]) {
      const op1_ = type.transform(op1, op2, idDelta);
      const op1_pruned = type.prune(op1_, op2, idDelta);

      assert.deepStrictEqual(op1, op1_pruned);
    }
  }

  // Now we'll check the n^2 transform method.
  if (client.ops.length > 0 && server.ops.length > 0) {
    p(
      `s ${i(server.result)} c ${i(client.result)} XF ${i(server.ops)} x ${i(
        client.ops
      )}`
    );

    const [s_, c_] = transformLists(type, server.ops, client.ops);

    p(`XF result -> ${i(s_)} x ${i(c_)}`);
    p(`applying ${i(c_)} to ${i(server.result)}`);
    const s_c = c_.reduce(type.apply, clone(server.result));
    const c_s = s_.reduce(type.apply, clone(client.result));

    checkSnapshotsEq(s_c, c_s);

    // ... And we'll do a round-trip using invert().
    if (type.invert != null) {
      const c_inv = c_.slice().reverse().map(type.invert);
      const server_result_ = c_inv.reduce(type.apply, clone(s_c));
      checkSnapshotsEq(server.result, server_result_);

      const orig_ = server.ops
        .slice()
        .reverse()
        .map(type.invert)
        .reduce(type.apply, server_result_);
      checkSnapshotsEq(orig_, initialDoc);
    }
  }

  return client.result;
};

const collectStats = (type) => {
  const functions = ["transform", "compose", "apply", "prune", "invert"].filter(
    (fn) => type[fn] != null
  );

  const orig = {};
  for (const fn of functions) orig[fn] = type[fn];

  const restore = () => {
    for (const fn of functions) type[fn] = orig[fn];
  };

  const stats = {};
  for (const fn of functions) stats[fn] = 0;

  const collect =
    (fn) =>
    (...args) => {
      stats[fn]++;
      return orig[fn](...args);
    };

  for (const fn of functions) type[fn] = collect(fn);

  return [stats, restore];
};

const save = (seedstate, doc, iter) =>
  fs.writeFileSync(
    "fuzzercrash.data",
    JSON.stringify({ seedstate, doc, iter })
  );

// Run some iterations of the random op tester. Requires a random op generator for the type.
module.exports = function (type, genRandomOp, iterations = 2000) {
  assert.ok(type.transform);

  const [stats, restore] = collectStats(type);

  console.error(
    `   Running ${iterations} randomized tests for type ${type.name}...`
  );
  if (seed != null) {
    console.error(`     (seed: ${seed})`);
  }

  const warnUnless = function (fn) {
    if (type[fn] == null) {
      console.error(
        `NOTE: Not running ${fn} tests because ${type.name} does not have ${fn}() defined`
      );
    }
  };
  warnUnless("invert");
  warnUnless("compose");

  let doc = restorestate.doc ? type.create(restorestate.doc) : type.create();

  console.time("randomizer");
  if (typeof type.setDebug === "function") {
    type.setDebug(debugMode);
  }
  // iterationsPerPct = iterations / 100
  const bar = new Bar({ fps: 3, etaBuffer: 4000 }, Presets.shades_classic);
  bar.start(iterations, restorestate.iter);

  for (
    let n = restorestate.iter, end = iterations, asc = restorestate.iter <= end;
    asc ? n <= end : n >= end;
    asc ? n++ : n--
  ) {
    // if n % (iterationsPerPct * 2) == 0
    //   process.stdout.write (if n % (iterationsPerPct * 10) == 0 then "#{n / iterationsPerPct}" else '.')

    var seedstate;
    try {
      seedstate = randomReal.state();
      if (n % 1000 === 0) {
        save(seedstate, doc, n);
      }
      bar.update(n);

      // debugger if debugMode

      doc = testRandomOp(type, genRandomOp, doc);
    } catch (e) {
      bar.stop();
      console.log(`----- 💣💥 CRASHED AT ITER ${n} -----`);
      fs.writeFileSync(
        restorefile,
        JSON.stringify({ seedstate, doc, iter: n })
      );
      console.log("Fuzzer state saved to fuzzercrash.data");
      throw e;
    }
  }

  bar.stop();

  console.timeEnd("randomizer");
  console.log();

  console.log("Performed:");
  for (let fn in stats) {
    const number = stats[fn];
    console.log(`\t${fn}s: ${number}`);
  }

  restore();

  fs.unlinkSync(restorefile);
};

for (let k in exports) {
  const v = exports[k];
  module.exports[k] = v;
}
