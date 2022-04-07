var clone,
  genRandomOp,
  json0,
  randomInt,
  randomKey,
  randomNewKey,
  randomPath,
  randomReal,
  randomThing,
  randomWord,
  _ref;

json0 = require("../lib/json0");

(_ref = require("ot-fuzzer")),
  (randomInt = _ref.randomInt),
  (randomReal = _ref.randomReal),
  (randomWord = _ref.randomWord);

clone = function (o) {
  return JSON.parse(JSON.stringify(o));
};

randomKey = function (obj) {
  var count, key, result;
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return void 0;
    } else {
      return randomInt(obj.length);
    }
  } else {
    count = 0;
    for (key in obj) {
      if (randomReal() < 1 / ++count) {
        result = key;
      }
    }
    return result;
  }
};

randomNewKey = function (obj) {
  var key;
  key = randomWord();
  while (obj[key] !== void 0) {
    key = randomWord();
  }
  return key;
};

randomThing = function () {
  var obj, _i, _j, _ref1, _ref2, _results;
  switch (randomInt(6)) {
    case 0:
      return null;
    case 1:
      return "";
    case 2:
      return randomWord();
    case 3:
      obj = {};
      for (
        _i = 1, _ref1 = randomInt(5);
        1 <= _ref1 ? _i <= _ref1 : _i >= _ref1;
        1 <= _ref1 ? _i++ : _i--
      ) {
        obj[randomNewKey(obj)] = randomThing();
      }
      return obj;
    case 4:
      _results = [];
      for (
        _j = 1, _ref2 = randomInt(5);
        1 <= _ref2 ? _j <= _ref2 : _j >= _ref2;
        1 <= _ref2 ? _j++ : _j--
      ) {
        _results.push(randomThing());
      }
      return _results;
    case 5:
      return randomInt(50);
  }
};

randomPath = function (data) {
  var key, path;
  path = [];
  while (randomReal() > 0.85 && typeof data === "object") {
    key = randomKey(data);
    if (key == null) {
      break;
    }
    path.push(key);
    data = data[key];
  }
  return path;
};

module.exports = genRandomOp = function (data) {
  var c,
    container,
    inc,
    k,
    key,
    length,
    newIndex,
    newValue,
    obj,
    op,
    operand,
    p,
    parent,
    path,
    pct,
    pos,
    str,
    subOp;
  pct = 0.95;
  container = {
    data: clone(data),
  };
  op = (function () {
    var _i, _len, _results;
    _results = [];
    while (randomReal() < pct) {
      pct *= 0.6;
      path = randomPath(container["data"]);
      parent = container;
      key = "data";
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        p = path[_i];
        parent = parent[key];
        key = p;
      }
      operand = parent[key];
      if (randomReal() < 0.4 && parent !== container && Array.isArray(parent)) {
        newIndex = randomInt(parent.length);
        parent.splice(key, 1);
        parent.splice(newIndex, 0, operand);
        _results.push({
          p: path,
          lm: newIndex,
        });
      } else if (randomReal() < 0.3 || operand === null) {
        newValue = randomThing();
        parent[key] = newValue;
        if (Array.isArray(parent)) {
          _results.push({
            p: path,
            ld: operand,
            li: clone(newValue),
          });
        } else {
          _results.push({
            p: path,
            od: operand,
            oi: clone(newValue),
          });
        }
      } else if (typeof operand === "string") {
        if (randomReal() > 0.5 || operand.length === 0) {
          pos = randomInt(operand.length + 1);
          str = randomWord() + " ";
          path.push(pos);
          parent[key] = operand.slice(0, pos) + str + operand.slice(pos);
          c = {
            p: path,
            si: str,
          };
        } else {
          pos = randomInt(operand.length);
          length = Math.min(randomInt(4), operand.length - pos);
          str = operand.slice(pos, pos + length);
          path.push(pos);
          parent[key] = operand.slice(0, pos) + operand.slice(pos + length);
          c = {
            p: path,
            sd: str,
          };
        }
        if (json0._testStringSubtype) {
          subOp = {
            p: path.pop(),
          };
          if (c.si != null) {
            subOp.i = c.si;
          } else {
            subOp.d = c.sd;
          }
          c = {
            p: path,
            t: "text0",
            o: [subOp],
          };
        }
        _results.push(c);
      } else if (typeof operand === "number") {
        inc = randomInt(10) - 3;
        parent[key] += inc;
        _results.push({
          p: path,
          na: inc,
        });
      } else if (Array.isArray(operand)) {
        if (randomReal() > 0.5 || operand.length === 0) {
          pos = randomInt(operand.length + 1);
          obj = randomThing();
          path.push(pos);
          operand.splice(pos, 0, obj);
          _results.push({
            p: path,
            li: clone(obj),
          });
        } else {
          pos = randomInt(operand.length);
          obj = operand[pos];
          path.push(pos);
          operand.splice(pos, 1);
          _results.push({
            p: path,
            ld: clone(obj),
          });
        }
      } else {
        k = randomKey(operand);
        if (randomReal() > 0.5 || k == null) {
          k = randomNewKey(operand);
          obj = randomThing();
          path.push(k);
          operand[k] = obj;
          _results.push({
            p: path,
            oi: clone(obj),
          });
        } else {
          obj = operand[k];
          path.push(k);
          delete operand[k];
          _results.push({
            p: path,
            od: clone(obj),
          });
        }
      }
    }
    return _results;
  })();
  return [op, container.data];
};
