var assert, fuzzer, text0;

assert = require("assert");

fuzzer = require("ot-fuzzer");

text0 = require("../lib/text0");

describe("text0", function () {
  describe("compose", function () {
    return it("is sane", function () {
      assert.deepEqual(text0.compose([], []), []);
      assert.deepEqual(
        text0.compose(
          [
            {
              i: "x",
              p: 0,
            },
          ],
          []
        ),
        [
          {
            i: "x",
            p: 0,
          },
        ]
      );
      assert.deepEqual(
        text0.compose(
          [],
          [
            {
              i: "x",
              p: 0,
            },
          ]
        ),
        [
          {
            i: "x",
            p: 0,
          },
        ]
      );
      return assert.deepEqual(
        text0.compose(
          [
            {
              i: "y",
              p: 100,
            },
          ],
          [
            {
              i: "x",
              p: 0,
            },
          ]
        ),
        [
          {
            i: "y",
            p: 100,
          },
          {
            i: "x",
            p: 0,
          },
        ]
      );
    });
  });
  describe("transform", function () {
    it("is sane", function () {
      assert.deepEqual([], text0.transform([], [], "left"));
      assert.deepEqual([], text0.transform([], [], "right"));
      assert.deepEqual(
        [
          {
            i: "y",
            p: 100,
          },
          {
            i: "x",
            p: 0,
          },
        ],
        text0.transform(
          [
            {
              i: "y",
              p: 100,
            },
            {
              i: "x",
              p: 0,
            },
          ],
          [],
          "left"
        )
      );
      return assert.deepEqual(
        [],
        text0.transform(
          [],
          [
            {
              i: "y",
              p: 100,
            },
            {
              i: "x",
              p: 0,
            },
          ],
          "right"
        )
      );
    });
    it("inserts", function () {
      assert.deepEqual(
        [
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              i: "a",
              p: 1,
            },
          ],
        ],
        text0.transformX(
          [
            {
              i: "x",
              p: 9,
            },
          ],
          [
            {
              i: "a",
              p: 1,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              i: "a",
              p: 11,
            },
          ],
        ],
        text0.transformX(
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              i: "a",
              p: 10,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              d: "a",
              p: 9,
            },
          ],
        ],
        text0.transformX(
          [
            {
              i: "x",
              p: 11,
            },
          ],
          [
            {
              d: "a",
              p: 9,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              d: "a",
              p: 10,
            },
          ],
        ],
        text0.transformX(
          [
            {
              i: "x",
              p: 11,
            },
          ],
          [
            {
              d: "a",
              p: 10,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              i: "x",
              p: 11,
            },
          ],
          [
            {
              d: "a",
              p: 12,
            },
          ],
        ],
        text0.transformX(
          [
            {
              i: "x",
              p: 11,
            },
          ],
          [
            {
              d: "a",
              p: 11,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          {
            i: "x",
            p: 10,
          },
        ],
        text0.transform(
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              d: "a",
              p: 11,
            },
          ],
          "left"
        )
      );
      assert.deepEqual(
        [
          {
            i: "x",
            p: 10,
          },
        ],
        text0.transform(
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              d: "a",
              p: 10,
            },
          ],
          "left"
        )
      );
      return assert.deepEqual(
        [
          {
            i: "x",
            p: 10,
          },
        ],
        text0.transform(
          [
            {
              i: "x",
              p: 10,
            },
          ],
          [
            {
              d: "a",
              p: 10,
            },
          ],
          "right"
        )
      );
    });
    return it("deletes", function () {
      assert.deepEqual(
        [
          [
            {
              d: "abc",
              p: 8,
            },
          ],
          [
            {
              d: "xy",
              p: 4,
            },
          ],
        ],
        text0.transformX(
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "xy",
              p: 4,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              d: "ac",
              p: 10,
            },
          ],
          [],
        ],
        text0.transformX(
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "b",
              p: 11,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [],
          [
            {
              d: "ac",
              p: 10,
            },
          ],
        ],
        text0.transformX(
          [
            {
              d: "b",
              p: 11,
            },
          ],
          [
            {
              d: "abc",
              p: 10,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              d: "a",
              p: 10,
            },
          ],
          [],
        ],
        text0.transformX(
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "bc",
              p: 11,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              d: "c",
              p: 10,
            },
          ],
          [],
        ],
        text0.transformX(
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "ab",
              p: 10,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              d: "a",
              p: 10,
            },
          ],
          [
            {
              d: "d",
              p: 10,
            },
          ],
        ],
        text0.transformX(
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "bcd",
              p: 11,
            },
          ]
        )
      );
      assert.deepEqual(
        [
          [
            {
              d: "d",
              p: 10,
            },
          ],
          [
            {
              d: "a",
              p: 10,
            },
          ],
        ],
        text0.transformX(
          [
            {
              d: "bcd",
              p: 11,
            },
          ],
          [
            {
              d: "abc",
              p: 10,
            },
          ]
        )
      );
      return assert.deepEqual(
        [
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "xy",
              p: 10,
            },
          ],
        ],
        text0.transformX(
          [
            {
              d: "abc",
              p: 10,
            },
          ],
          [
            {
              d: "xy",
              p: 13,
            },
          ]
        )
      );
    });
  });
  describe("transformCursor", function () {
    it("is sane", function () {
      assert.strictEqual(0, text0.transformCursor(0, [], "right"));
      assert.strictEqual(0, text0.transformCursor(0, [], "left"));
      return assert.strictEqual(100, text0.transformCursor(100, []));
    });
    it("works vs insert", function () {
      assert.strictEqual(
        0,
        text0.transformCursor(
          0,
          [
            {
              i: "asdf",
              p: 100,
            },
          ],
          "right"
        )
      );
      assert.strictEqual(
        0,
        text0.transformCursor(
          0,
          [
            {
              i: "asdf",
              p: 100,
            },
          ],
          "left"
        )
      );
      assert.strictEqual(
        204,
        text0.transformCursor(
          200,
          [
            {
              i: "asdf",
              p: 100,
            },
          ],
          "right"
        )
      );
      assert.strictEqual(
        204,
        text0.transformCursor(
          200,
          [
            {
              i: "asdf",
              p: 100,
            },
          ],
          "left"
        )
      );
      assert.strictEqual(
        104,
        text0.transformCursor(
          100,
          [
            {
              i: "asdf",
              p: 100,
            },
          ],
          "right"
        )
      );
      return assert.strictEqual(
        100,
        text0.transformCursor(
          100,
          [
            {
              i: "asdf",
              p: 100,
            },
          ],
          "left"
        )
      );
    });
    return it("works vs delete", function () {
      assert.strictEqual(
        0,
        text0.transformCursor(
          0,
          [
            {
              d: "asdf",
              p: 100,
            },
          ],
          "right"
        )
      );
      assert.strictEqual(
        0,
        text0.transformCursor(
          0,
          [
            {
              d: "asdf",
              p: 100,
            },
          ],
          "left"
        )
      );
      assert.strictEqual(
        0,
        text0.transformCursor(0, [
          {
            d: "asdf",
            p: 100,
          },
        ])
      );
      assert.strictEqual(
        196,
        text0.transformCursor(200, [
          {
            d: "asdf",
            p: 100,
          },
        ])
      );
      assert.strictEqual(
        100,
        text0.transformCursor(100, [
          {
            d: "asdf",
            p: 100,
          },
        ])
      );
      assert.strictEqual(
        100,
        text0.transformCursor(102, [
          {
            d: "asdf",
            p: 100,
          },
        ])
      );
      assert.strictEqual(
        100,
        text0.transformCursor(104, [
          {
            d: "asdf",
            p: 100,
          },
        ])
      );
      return assert.strictEqual(
        101,
        text0.transformCursor(105, [
          {
            d: "asdf",
            p: 100,
          },
        ])
      );
    });
  });
  describe("normalize", function () {
    it("is sane", function () {
      var testUnchanged;
      testUnchanged = function (op) {
        return assert.deepEqual(op, text0.normalize(op));
      };
      testUnchanged([]);
      testUnchanged([
        {
          i: "asdf",
          p: 100,
        },
      ]);
      return testUnchanged([
        {
          i: "asdf",
          p: 100,
        },
        {
          d: "fdsa",
          p: 123,
        },
      ]);
    });
    it("adds missing p:0", function () {
      assert.deepEqual(
        [
          {
            i: "abc",
            p: 0,
          },
        ],
        text0.normalize([
          {
            i: "abc",
          },
        ])
      );
      assert.deepEqual(
        [
          {
            d: "abc",
            p: 0,
          },
        ],
        text0.normalize([
          {
            d: "abc",
          },
        ])
      );
      return assert.deepEqual(
        [
          {
            i: "abc",
            p: 0,
          },
          {
            d: "abc",
            p: 0,
          },
        ],
        text0.normalize([
          {
            i: "abc",
          },
          {
            d: "abc",
          },
        ])
      );
    });
    it("converts op to an array", function () {
      assert.deepEqual(
        [
          {
            i: "abc",
            p: 0,
          },
        ],
        text0.normalize({
          i: "abc",
          p: 0,
        })
      );
      return assert.deepEqual(
        [
          {
            d: "abc",
            p: 0,
          },
        ],
        text0.normalize({
          d: "abc",
          p: 0,
        })
      );
    });
    it("works with a really simple op", function () {
      return assert.deepEqual(
        [
          {
            i: "abc",
            p: 0,
          },
        ],
        text0.normalize({
          i: "abc",
        })
      );
    });
    it("compress inserts", function () {
      assert.deepEqual(
        [
          {
            i: "xyzabc",
            p: 10,
          },
        ],
        text0.normalize([
          {
            i: "abc",
            p: 10,
          },
          {
            i: "xyz",
            p: 10,
          },
        ])
      );
      assert.deepEqual(
        [
          {
            i: "axyzbc",
            p: 10,
          },
        ],
        text0.normalize([
          {
            i: "abc",
            p: 10,
          },
          {
            i: "xyz",
            p: 11,
          },
        ])
      );
      return assert.deepEqual(
        [
          {
            i: "abcxyz",
            p: 10,
          },
        ],
        text0.normalize([
          {
            i: "abc",
            p: 10,
          },
          {
            i: "xyz",
            p: 13,
          },
        ])
      );
    });
    it("doesnt compress separate inserts", function () {
      var t;
      t = function (op) {
        return assert.deepEqual(op, text0.normalize(op));
      };
      t([
        {
          i: "abc",
          p: 10,
        },
        {
          i: "xyz",
          p: 9,
        },
      ]);
      return t([
        {
          i: "abc",
          p: 10,
        },
        {
          i: "xyz",
          p: 14,
        },
      ]);
    });
    it("compress deletes", function () {
      assert.deepEqual(
        [
          {
            d: "xyabc",
            p: 8,
          },
        ],
        text0.normalize([
          {
            d: "abc",
            p: 10,
          },
          {
            d: "xy",
            p: 8,
          },
        ])
      );
      assert.deepEqual(
        [
          {
            d: "xabcy",
            p: 9,
          },
        ],
        text0.normalize([
          {
            d: "abc",
            p: 10,
          },
          {
            d: "xy",
            p: 9,
          },
        ])
      );
      return assert.deepEqual(
        [
          {
            d: "abcxy",
            p: 10,
          },
        ],
        text0.normalize([
          {
            d: "abc",
            p: 10,
          },
          {
            d: "xy",
            p: 10,
          },
        ])
      );
    });
    return it("doesnt compress separate deletes", function () {
      var t;
      t = function (op) {
        return assert.deepEqual(op, text0.normalize(op));
      };
      t([
        {
          d: "abc",
          p: 10,
        },
        {
          d: "xyz",
          p: 6,
        },
      ]);
      return t([
        {
          d: "abc",
          p: 10,
        },
        {
          d: "xyz",
          p: 11,
        },
      ]);
    });
  });
  return describe("randomizer", function () {
    return it("passes", function () {
      this.timeout(4000);
      this.slow(4000);
      return fuzzer(text0, require("./text0-generator"));
    });
  });
});
