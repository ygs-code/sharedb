/*
 * @Date: 2022-05-12 17:59:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-13 15:21:51
 * @FilePath: /webpack-cli/@webpack-cli/client/definePlugin/browser-reload-error-overlay-wepback-plugin/ansiToHtml.js
 * @Description: 
 */
(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _createForOfIteratorHelper(o, allowArrayLike) {
          var it =
            (typeof Symbol !== "undefined" && o[Symbol.iterator]) ||
            o["@@iterator"];
          if (!it) {
            if (
              Array.isArray(o) ||
              (it = _unsupportedIterableToArray(o)) ||
              (allowArrayLike && o && typeof o.length === "number")
            ) {
              if (it) o = it;
              var i = 0;
              var F = function F() {};
              return {
                s: F,
                n: function n() {
                  if (i >= o.length) return { done: true };
                  return { done: false, value: o[i++] };
                },
                e: function e(_e) {
                  throw _e;
                },
                f: F,
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          var normalCompletion = true,
            didErr = false,
            err;
          return {
            s: function s() {
              it = it.call(o);
            },
            n: function n() {
              var step = it.next();
              normalCompletion = step.done;
              return step;
            },
            e: function e(_e2) {
              didErr = true;
              err = _e2;
            },
            f: function f() {
              try {
                if (!normalCompletion && it["return"] != null) it["return"]();
              } finally {
                if (didErr) throw err;
              }
            },
          };
        }

        function _unsupportedIterableToArray(o, minLen) {
          if (!o) return;
          if (typeof o === "string") return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if (n === "Object" && o.constructor) n = o.constructor.name;
          if (n === "Map" || n === "Set") return Array.from(o);
          if (
            n === "Arguments" ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return _arrayLikeToArray(o, minLen);
        }

        function _arrayLikeToArray(arr, len) {
          if (len == null || len > arr.length) len = arr.length;
          for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        }

        var entities = require("entities");

        var defaults = {
          fg: "#FFF",
          bg: "#000",
          newline: false,
          escapeXML: false,
          stream: false,
          colors: getDefaultColors(),
        };

        function getDefaultColors() {
          var colors = {
            0: "#000",
            1: "#A00",
            2: "#0A0",
            3: "#A50",
            4: "#00A",
            5: "#A0A",
            6: "#0AA",
            7: "#AAA",
            8: "#555",
            9: "#F55",
            10: "#5F5",
            11: "#FF5",
            12: "#55F",
            13: "#F5F",
            14: "#5FF",
            15: "#FFF",
          };
          range(0, 5).forEach(function (red) {
            range(0, 5).forEach(function (green) {
              range(0, 5).forEach(function (blue) {
                return setStyleColor(red, green, blue, colors);
              });
            });
          });
          range(0, 23).forEach(function (gray) {
            var c = gray + 232;
            var l = toHexString(gray * 10 + 8);
            colors[c] = "#" + l + l + l;
          });
          return colors;
        }
        /**
         * @param {number} red
         * @param {number} green
         * @param {number} blue
         * @param {object} colors
         */

        function setStyleColor(red, green, blue, colors) {
          var c = 16 + red * 36 + green * 6 + blue;
          var r = red > 0 ? red * 40 + 55 : 0;
          var g = green > 0 ? green * 40 + 55 : 0;
          var b = blue > 0 ? blue * 40 + 55 : 0;
          colors[c] = toColorHexString([r, g, b]);
        }
        /**
         * Converts from a number like 15 to a hex string like 'F'
         * @param {number} num
         * @returns {string}
         */

        function toHexString(num) {
          var str = num.toString(16);

          while (str.length < 2) {
            str = "0" + str;
          }

          return str;
        }
        /**
         * Converts from an array of numbers like [15, 15, 15] to a hex string like 'FFF'
         * @param {[red, green, blue]} ref
         * @returns {string}
         */

        function toColorHexString(ref) {
          var results = [];

          var _iterator = _createForOfIteratorHelper(ref),
            _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var r = _step.value;
              results.push(toHexString(r));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return "#" + results.join("");
        }
        /**
         * @param {Array} stack
         * @param {string} token
         * @param {*} data
         * @param {object} options
         */

        function generateOutput(stack, token, data, options) {
          var result;

          if (token === "text") {
            result = pushText(data, options);
          } else if (token === "display") {
            result = handleDisplay(stack, data, options);
          } else if (token === "xterm256Foreground") {
            result = pushForegroundColor(stack, options.colors[data]);
          } else if (token === "xterm256Background") {
            result = pushBackgroundColor(stack, options.colors[data]);
          } else if (token === "rgb") {
            result = handleRgb(stack, data);
          }

          return result;
        }
        /**
         * @param {Array} stack
         * @param {string} data
         * @returns {*}
         */

        function handleRgb(stack, data) {
          data = data.substring(2).slice(0, -1);
          var operation = +data.substr(0, 2);
          var color = data.substring(5).split(";");
          var rgb = color
            .map(function (value) {
              return ("0" + Number(value).toString(16)).substr(-2);
            })
            .join("");
          return pushStyle(
            stack,
            (operation === 38 ? "color:#" : "background-color:#") + rgb
          );
        }
        /**
         * @param {Array} stack
         * @param {number} code
         * @param {object} options
         * @returns {*}
         */

        function handleDisplay(stack, code, options) {
          code = parseInt(code, 10);
          var codeMap = {
            "-1": function _() {
              return "<br/>";
            },
            0: function _() {
              return stack.length && resetStyles(stack);
            },
            1: function _() {
              return pushTag(stack, "b");
            },
            3: function _() {
              return pushTag(stack, "i");
            },
            4: function _() {
              return pushTag(stack, "u");
            },
            8: function _() {
              return pushStyle(stack, "display:none");
            },
            9: function _() {
              return pushTag(stack, "strike");
            },
            22: function _() {
              return pushStyle(
                stack,
                "font-weight:normal;text-decoration:none;font-style:normal"
              );
            },
            23: function _() {
              return closeTag(stack, "i");
            },
            24: function _() {
              return closeTag(stack, "u");
            },
            39: function _() {
              return pushForegroundColor(stack, options.fg);
            },
            49: function _() {
              return pushBackgroundColor(stack, options.bg);
            },
            53: function _() {
              return pushStyle(stack, "text-decoration:overline");
            },
          };
          var result;

          if (codeMap[code]) {
            result = codeMap[code]();
          } else if (4 < code && code < 7) {
            result = pushTag(stack, "blink");
          } else if (29 < code && code < 38) {
            result = pushForegroundColor(stack, options.colors[code - 30]);
          } else if (39 < code && code < 48) {
            result = pushBackgroundColor(stack, options.colors[code - 40]);
          } else if (89 < code && code < 98) {
            result = pushForegroundColor(
              stack,
              options.colors[8 + (code - 90)]
            );
          } else if (99 < code && code < 108) {
            result = pushBackgroundColor(
              stack,
              options.colors[8 + (code - 100)]
            );
          }

          return result;
        }
        /**
         * Clear all the styles
         * @returns {string}
         */

        function resetStyles(stack) {
          var stackClone = stack.slice(0);
          stack.length = 0;
          return stackClone
            .reverse()
            .map(function (tag) {
              return "</" + tag + ">";
            })
            .join("");
        }
        /**
         * Creates an array of numbers ranging from low to high
         * @param {number} low
         * @param {number} high
         * @returns {Array}
         * @example range(3, 7); // creates [3, 4, 5, 6, 7]
         */

        function range(low, high) {
          var results = [];

          for (var j = low; j <= high; j++) {
            results.push(j);
          }

          return results;
        }
        /**
         * Returns a new function that is true if value is NOT the same category
         * @param {string} category
         * @returns {function}
         */

        function notCategory(category) {
          return function (e) {
            return (
              (category === null || e.category !== category) &&
              category !== "all"
            );
          };
        }
        /**
         * Converts a code into an ansi token type
         * @param {number} code
         * @returns {string}
         */

        function categoryForCode(code) {
          code = parseInt(code, 10);
          var result = null;

          if (code === 0) {
            result = "all";
          } else if (code === 1) {
            result = "bold";
          } else if (2 < code && code < 5) {
            result = "underline";
          } else if (4 < code && code < 7) {
            result = "blink";
          } else if (code === 8) {
            result = "hide";
          } else if (code === 9) {
            result = "strike";
          } else if (
            (29 < code && code < 38) ||
            code === 39 ||
            (89 < code && code < 98)
          ) {
            result = "foreground-color";
          } else if (
            (39 < code && code < 48) ||
            code === 49 ||
            (99 < code && code < 108)
          ) {
            result = "background-color";
          }

          return result;
        }
        /**
         * @param {string} text
         * @param {object} options
         * @returns {string}
         */

        function pushText(text, options) {
          if (options.escapeXML) {
            return entities.encodeXML(text);
          }

          return text;
        }
        /**
         * @param {Array} stack
         * @param {string} tag
         * @param {string} [style='']
         * @returns {string}
         */

        function pushTag(stack, tag, style) {
          if (!style) {
            style = "";
          }

          stack.push(tag);
          return "<"
            .concat(tag)
            .concat(style ? ' style="'.concat(style, '"') : "", ">");
        }
        /**
         * @param {Array} stack
         * @param {string} style
         * @returns {string}
         */

        function pushStyle(stack, style) {
          return pushTag(stack, "span", style);
        }

        function pushForegroundColor(stack, color) {
          return pushTag(stack, "span", "color:" + color);
        }

        function pushBackgroundColor(stack, color) {
          return pushTag(stack, "span", "background-color:" + color);
        }
        /**
         * @param {Array} stack
         * @param {string} style
         * @returns {string}
         */

        function closeTag(stack, style) {
          var last;

          if (stack.slice(-1)[0] === style) {
            last = stack.pop();
          }

          if (last) {
            return "</" + style + ">";
          }
        }
        /**
         * @param {string} text
         * @param {object} options
         * @param {function} callback
         * @returns {Array}
         */

        function tokenize(text, options, callback) {
          var ansiMatch = false;
          var ansiHandler = 3;

          function remove() {
            return "";
          }

          function removeXterm256Foreground(m, g1) {
            callback("xterm256Foreground", g1);
            return "";
          }

          function removeXterm256Background(m, g1) {
            callback("xterm256Background", g1);
            return "";
          }

          function newline(m) {
            if (options.newline) {
              callback("display", -1);
            } else {
              callback("text", m);
            }

            return "";
          }

          function ansiMess(m, g1) {
            ansiMatch = true;

            if (g1.trim().length === 0) {
              g1 = "0";
            }

            g1 = g1.trimRight(";").split(";");

            var _iterator2 = _createForOfIteratorHelper(g1),
              _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                var g = _step2.value;
                callback("display", g);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            return "";
          }

          function realText(m) {
            callback("text", m);
            return "";
          }

          function rgb(m) {
            callback("rgb", m);
            return "";
          }
          /* eslint no-control-regex:0 */

          var tokens = [
            {
              pattern: /^\x08+/,
              sub: remove,
            },
            {
              pattern: /^\x1b\[[012]?K/,
              sub: remove,
            },
            {
              pattern: /^\x1b\[\(B/,
              sub: remove,
            },
            {
              pattern: /^\x1b\[[34]8;2;\d+;\d+;\d+m/,
              sub: rgb,
            },
            {
              pattern: /^\x1b\[38;5;(\d+)m/,
              sub: removeXterm256Foreground,
            },
            {
              pattern: /^\x1b\[48;5;(\d+)m/,
              sub: removeXterm256Background,
            },
            {
              pattern: /^\n/,
              sub: newline,
            },
            {
              pattern: /^\r+\n/,
              sub: newline,
            },
            {
              pattern: /^\r/,
              sub: newline,
            },
            {
              pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
              sub: ansiMess,
            },
            {
              // CSI n J
              // ED - Erase in Display Clears part of the screen.
              // If n is 0 (or missing), clear from cursor to end of screen.
              // If n is 1, clear from cursor to beginning of the screen.
              // If n is 2, clear entire screen (and moves cursor to upper left on DOS ANSI.SYS).
              // If n is 3, clear entire screen and delete all lines saved in the scrollback buffer
              //   (this feature was added for xterm and is supported by other terminal applications).
              pattern: /^\x1b\[\d?J/,
              sub: remove,
            },
            {
              // CSI n ; m f
              // HVP - Horizontal Vertical Position Same as CUP
              pattern: /^\x1b\[\d{0,3};\d{0,3}f/,
              sub: remove,
            },
            {
              // catch-all for CSI sequences?
              pattern: /^\x1b\[?[\d;]{0,3}/,
              sub: remove,
            },
            {
              /**
               * extracts real text - not containing:
               * - `\x1b' - ESC - escape (Ascii 27)
               * - '\x08' - BS - backspace (Ascii 8)
               * - `\n` - Newline - linefeed (LF) (ascii 10)
               * - `\r` - Windows Carriage Return (CR)
               */
              pattern: /^(([^\x1b\x08\r\n])+)/,
              sub: realText,
            },
          ];

          function process(handler, i) {
            if (i > ansiHandler && ansiMatch) {
              return;
            }

            ansiMatch = false;
            text = text.replace(handler.pattern, handler.sub);
          }

          var results1 = [];
          var _text = text,
            length = _text.length;

          outer: while (length > 0) {
            for (var i = 0, o = 0, len = tokens.length; o < len; i = ++o) {
              var handler = tokens[i];
              process(handler, i);

              if (text.length !== length) {
                // We matched a token and removed it from the text. We need to
                // start matching *all* tokens against the new text.
                length = text.length;
                continue outer;
              }
            }

            if (text.length === length) {
              break;
            }

            results1.push(0);
            length = text.length;
          }

          return results1;
        }
        /**
         * If streaming, then the stack is "sticky"
         *
         * @param {Array} stickyStack
         * @param {string} token
         * @param {*} data
         * @returns {Array}
         */

        function updateStickyStack(stickyStack, token, data) {
          if (token !== "text") {
            stickyStack = stickyStack.filter(
              notCategory(categoryForCode(data))
            );
            stickyStack.push({
              token: token,
              data: data,
              category: categoryForCode(data),
            });
          }

          return stickyStack;
        }

        var Filter = /*#__PURE__*/ (function () {
          /**
           * @param {object} options
           * @param {string=} options.fg The default foreground color used when reset color codes are encountered.
           * @param {string=} options.bg The default background color used when reset color codes are encountered.
           * @param {boolean=} options.newline Convert newline characters to `<br/>`.
           * @param {boolean=} options.escapeXML Generate HTML/XML entities.
           * @param {boolean=} options.stream Save style state across invocations of `toHtml()`.
           * @param {(string[] | {[code: number]: string})=} options.colors Can override specific colors or the entire ANSI palette.
           */
          function Filter(options) {
            _classCallCheck(this, Filter);

            options = options || {};

            if (options.colors) {
              options.colors = Object.assign(
                {},
                defaults.colors,
                options.colors
              );
            }

            this.options = Object.assign({}, defaults, options);
            this.stack = [];
            this.stickyStack = [];
          }
          /**
           * @param {string | string[]} input
           * @returns {string}
           */

          _createClass(Filter, [
            {
              key: "toHtml",
              value: function toHtml(input) {
                var _this = this;

                input = typeof input === "string" ? [input] : input;
                var stack = this.stack,
                  options = this.options;
                var buf = [];
                this.stickyStack.forEach(function (element) {
                  var output = generateOutput(
                    stack,
                    element.token,
                    element.data,
                    options
                  );

                  if (output) {
                    buf.push(output);
                  }
                });
                tokenize(input.join(""), options, function (token, data) {
                  var output = generateOutput(stack, token, data, options);

                  if (output) {
                    buf.push(output);
                  }

                  if (options.stream) {
                    _this.stickyStack = updateStickyStack(
                      _this.stickyStack,
                      token,
                      data
                    );
                  }
                });

                if (stack.length) {
                  buf.push(resetStyles(stack));
                }

                return buf.join("");
              },
            },
          ]);

          return Filter;
        })();

        window.ansiToHtml = Filter;
      },
      { entities: 5 },
    ],
    2: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.decodeHTML =
          exports.decodeHTMLStrict =
          exports.decodeXML =
            void 0;
        var entities_json_1 = __importDefault(require("./maps/entities.json"));
        var legacy_json_1 = __importDefault(require("./maps/legacy.json"));
        var xml_json_1 = __importDefault(require("./maps/xml.json"));
        var decode_codepoint_1 = __importDefault(require("./decode_codepoint"));
        var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
        exports.decodeXML = getStrictDecoder(xml_json_1.default);
        exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
        function getStrictDecoder(map) {
          var replace = getReplacer(map);
          return function (str) {
            return String(str).replace(strictEntityRe, replace);
          };
        }
        var sorter = function (a, b) {
          return a < b ? 1 : -1;
        };
        exports.decodeHTML = (function () {
          var legacy = Object.keys(legacy_json_1.default).sort(sorter);
          var keys = Object.keys(entities_json_1.default).sort(sorter);
          for (var i = 0, j = 0; i < keys.length; i++) {
            if (legacy[j] === keys[i]) {
              keys[i] += ";?";
              j++;
            } else {
              keys[i] += ";";
            }
          }
          var re = new RegExp(
            "&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)",
            "g"
          );
          var replace = getReplacer(entities_json_1.default);
          function replacer(str) {
            if (str.substr(-1) !== ";") str += ";";
            return replace(str);
          }
          // TODO consider creating a merged map
          return function (str) {
            return String(str).replace(re, replacer);
          };
        })();
        function getReplacer(map) {
          return function replace(str) {
            if (str.charAt(1) === "#") {
              var secondChar = str.charAt(2);
              if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
              }
              return decode_codepoint_1.default(parseInt(str.substr(2), 10));
            }
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            return map[str.slice(1, -1)] || str;
          };
        }
      },
      {
        "./decode_codepoint": 3,
        "./maps/entities.json": 7,
        "./maps/legacy.json": 8,
        "./maps/xml.json": 9,
      },
    ],
    3: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        var decode_json_1 = __importDefault(require("./maps/decode.json"));
        // Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
        var fromCodePoint =
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          String.fromCodePoint ||
          function (codePoint) {
            var output = "";
            if (codePoint > 0xffff) {
              codePoint -= 0x10000;
              output += String.fromCharCode(
                ((codePoint >>> 10) & 0x3ff) | 0xd800
              );
              codePoint = 0xdc00 | (codePoint & 0x3ff);
            }
            output += String.fromCharCode(codePoint);
            return output;
          };
        function decodeCodePoint(codePoint) {
          if (
            (codePoint >= 0xd800 && codePoint <= 0xdfff) ||
            codePoint > 0x10ffff
          ) {
            return "\uFFFD";
          }
          if (codePoint in decode_json_1.default) {
            codePoint = decode_json_1.default[codePoint];
          }
          return fromCodePoint(codePoint);
        }
        exports.default = decodeCodePoint;
      },
      { "./maps/decode.json": 6 },
    ],
    4: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.escapeUTF8 =
          exports.escape =
          exports.encodeNonAsciiHTML =
          exports.encodeHTML =
          exports.encodeXML =
            void 0;
        var xml_json_1 = __importDefault(require("./maps/xml.json"));
        var inverseXML = getInverseObj(xml_json_1.default);
        var xmlReplacer = getInverseReplacer(inverseXML);
        /**
         * Encodes all non-ASCII characters, as well as characters not valid in XML
         * documents using XML entities.
         *
         * If a character has no equivalent entity, a
         * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
         */
        exports.encodeXML = getASCIIEncoder(inverseXML);
        var entities_json_1 = __importDefault(require("./maps/entities.json"));
        var inverseHTML = getInverseObj(entities_json_1.default);
        var htmlReplacer = getInverseReplacer(inverseHTML);
        /**
         * Encodes all entities and non-ASCII characters in the input.
         *
         * This includes characters that are valid ASCII characters in HTML documents.
         * For example `#` will be encoded as `&num;`. To get a more compact output,
         * consider using the `encodeNonAsciiHTML` function.
         *
         * If a character has no equivalent entity, a
         * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
         */
        exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
        /**
         * Encodes all non-ASCII characters, as well as characters not valid in HTML
         * documents using HTML entities.
         *
         * If a character has no equivalent entity, a
         * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
         */
        exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
        function getInverseObj(obj) {
          return Object.keys(obj)
            .sort()
            .reduce(function (inverse, name) {
              inverse[obj[name]] = "&" + name + ";";
              return inverse;
            }, {});
        }
        function getInverseReplacer(inverse) {
          var single = [];
          var multiple = [];
          for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
            var k = _a[_i];
            if (k.length === 1) {
              // Add value to single array
              single.push("\\" + k);
            } else {
              // Add value to multiple array
              multiple.push(k);
            }
          }
          // Add ranges to single characters.
          single.sort();
          for (var start = 0; start < single.length - 1; start++) {
            // Find the end of a run of characters
            var end = start;
            while (
              end < single.length - 1 &&
              single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)
            ) {
              end += 1;
            }
            var count = 1 + end - start;
            // We want to replace at least three characters
            if (count < 3) continue;
            single.splice(start, count, single[start] + "-" + single[end]);
          }
          multiple.unshift("[" + single.join("") + "]");
          return new RegExp(multiple.join("|"), "g");
        }
        // /[^\0-\x7F]/gu
        var reNonASCII =
          /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
        var getCodePoint =
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          String.prototype.codePointAt != null
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              function (str) {
                return str.codePointAt(0);
              }
            : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
              function (c) {
                return (
                  (c.charCodeAt(0) - 0xd800) * 0x400 +
                  c.charCodeAt(1) -
                  0xdc00 +
                  0x10000
                );
              };
        function singleCharReplacer(c) {
          return (
            "&#x" +
            (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
              .toString(16)
              .toUpperCase() +
            ";"
          );
        }
        function getInverse(inverse, re) {
          return function (data) {
            return data
              .replace(re, function (name) {
                return inverse[name];
              })
              .replace(reNonASCII, singleCharReplacer);
          };
        }
        var reEscapeChars = new RegExp(
          xmlReplacer.source + "|" + reNonASCII.source,
          "g"
        );
        /**
         * Encodes all non-ASCII characters, as well as characters not valid in XML
         * documents using numeric hexadecimal reference (eg. `&#xfc;`).
         *
         * Have a look at `escapeUTF8` if you want a more concise output at the expense
         * of reduced transportability.
         *
         * @param data String to escape.
         */
        function escape(data) {
          return data.replace(reEscapeChars, singleCharReplacer);
        }
        exports.escape = escape;
        /**
         * Encodes all characters not valid in XML documents using numeric hexadecimal
         * reference (eg. `&#xfc;`).
         *
         * Note that the output will be character-set dependent.
         *
         * @param data String to escape.
         */
        function escapeUTF8(data) {
          return data.replace(xmlReplacer, singleCharReplacer);
        }
        exports.escapeUTF8 = escapeUTF8;
        function getASCIIEncoder(obj) {
          return function (data) {
            return data.replace(reEscapeChars, function (c) {
              return obj[c] || singleCharReplacer(c);
            });
          };
        }
      },
      { "./maps/entities.json": 7, "./maps/xml.json": 9 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.decodeXMLStrict =
          exports.decodeHTML5Strict =
          exports.decodeHTML4Strict =
          exports.decodeHTML5 =
          exports.decodeHTML4 =
          exports.decodeHTMLStrict =
          exports.decodeHTML =
          exports.decodeXML =
          exports.encodeHTML5 =
          exports.encodeHTML4 =
          exports.escapeUTF8 =
          exports.escape =
          exports.encodeNonAsciiHTML =
          exports.encodeHTML =
          exports.encodeXML =
          exports.encode =
          exports.decodeStrict =
          exports.decode =
            void 0;
        var decode_1 = require("./decode");
        var encode_1 = require("./encode");
        /**
         * Decodes a string with entities.
         *
         * @param data String to decode.
         * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
         * @deprecated Use `decodeXML` or `decodeHTML` directly.
         */
        function decode(data, level) {
          return (
            !level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML
          )(data);
        }
        exports.decode = decode;
        /**
         * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
         *
         * @param data String to decode.
         * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
         * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
         */
        function decodeStrict(data, level) {
          return (
            !level || level <= 0
              ? decode_1.decodeXML
              : decode_1.decodeHTMLStrict
          )(data);
        }
        exports.decodeStrict = decodeStrict;
        /**
         * Encodes a string with entities.
         *
         * @param data String to encode.
         * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
         * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
         */
        function encode(data, level) {
          return (
            !level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML
          )(data);
        }
        exports.encode = encode;
        var encode_2 = require("./encode");
        Object.defineProperty(exports, "encodeXML", {
          enumerable: true,
          get: function () {
            return encode_2.encodeXML;
          },
        });
        Object.defineProperty(exports, "encodeHTML", {
          enumerable: true,
          get: function () {
            return encode_2.encodeHTML;
          },
        });
        Object.defineProperty(exports, "encodeNonAsciiHTML", {
          enumerable: true,
          get: function () {
            return encode_2.encodeNonAsciiHTML;
          },
        });
        Object.defineProperty(exports, "escape", {
          enumerable: true,
          get: function () {
            return encode_2.escape;
          },
        });
        Object.defineProperty(exports, "escapeUTF8", {
          enumerable: true,
          get: function () {
            return encode_2.escapeUTF8;
          },
        });
        // Legacy aliases (deprecated)
        Object.defineProperty(exports, "encodeHTML4", {
          enumerable: true,
          get: function () {
            return encode_2.encodeHTML;
          },
        });
        Object.defineProperty(exports, "encodeHTML5", {
          enumerable: true,
          get: function () {
            return encode_2.encodeHTML;
          },
        });
        var decode_2 = require("./decode");
        Object.defineProperty(exports, "decodeXML", {
          enumerable: true,
          get: function () {
            return decode_2.decodeXML;
          },
        });
        Object.defineProperty(exports, "decodeHTML", {
          enumerable: true,
          get: function () {
            return decode_2.decodeHTML;
          },
        });
        Object.defineProperty(exports, "decodeHTMLStrict", {
          enumerable: true,
          get: function () {
            return decode_2.decodeHTMLStrict;
          },
        });
        // Legacy aliases (deprecated)
        Object.defineProperty(exports, "decodeHTML4", {
          enumerable: true,
          get: function () {
            return decode_2.decodeHTML;
          },
        });
        Object.defineProperty(exports, "decodeHTML5", {
          enumerable: true,
          get: function () {
            return decode_2.decodeHTML;
          },
        });
        Object.defineProperty(exports, "decodeHTML4Strict", {
          enumerable: true,
          get: function () {
            return decode_2.decodeHTMLStrict;
          },
        });
        Object.defineProperty(exports, "decodeHTML5Strict", {
          enumerable: true,
          get: function () {
            return decode_2.decodeHTMLStrict;
          },
        });
        Object.defineProperty(exports, "decodeXMLStrict", {
          enumerable: true,
          get: function () {
            return decode_2.decodeXML;
          },
        });
      },
      { "./decode": 2, "./encode": 4 },
    ],
    6: [
      function (require, module, exports) {
        module.exports = {
          0: 65533,
          128: 8364,
          130: 8218,
          131: 402,
          132: 8222,
          133: 8230,
          134: 8224,
          135: 8225,
          136: 710,
          137: 8240,
          138: 352,
          139: 8249,
          140: 338,
          142: 381,
          145: 8216,
          146: 8217,
          147: 8220,
          148: 8221,
          149: 8226,
          150: 8211,
          151: 8212,
          152: 732,
          153: 8482,
          154: 353,
          155: 8250,
          156: 339,
          158: 382,
          159: 376,
        };
      },
      {},
    ],
    7: [
      function (require, module, exports) {
        module.exports = {
          Aacute: "Á",
          aacute: "á",
          Abreve: "Ă",
          abreve: "ă",
          ac: "∾",
          acd: "∿",
          acE: "∾̳",
          Acirc: "Â",
          acirc: "â",
          acute: "´",
          Acy: "А",
          acy: "а",
          AElig: "Æ",
          aelig: "æ",
          af: "⁡",
          Afr: "𝔄",
          afr: "𝔞",
          Agrave: "À",
          agrave: "à",
          alefsym: "ℵ",
          aleph: "ℵ",
          Alpha: "Α",
          alpha: "α",
          Amacr: "Ā",
          amacr: "ā",
          amalg: "⨿",
          amp: "&",
          AMP: "&",
          andand: "⩕",
          And: "⩓",
          and: "∧",
          andd: "⩜",
          andslope: "⩘",
          andv: "⩚",
          ang: "∠",
          ange: "⦤",
          angle: "∠",
          angmsdaa: "⦨",
          angmsdab: "⦩",
          angmsdac: "⦪",
          angmsdad: "⦫",
          angmsdae: "⦬",
          angmsdaf: "⦭",
          angmsdag: "⦮",
          angmsdah: "⦯",
          angmsd: "∡",
          angrt: "∟",
          angrtvb: "⊾",
          angrtvbd: "⦝",
          angsph: "∢",
          angst: "Å",
          angzarr: "⍼",
          Aogon: "Ą",
          aogon: "ą",
          Aopf: "𝔸",
          aopf: "𝕒",
          apacir: "⩯",
          ap: "≈",
          apE: "⩰",
          ape: "≊",
          apid: "≋",
          apos: "'",
          ApplyFunction: "⁡",
          approx: "≈",
          approxeq: "≊",
          Aring: "Å",
          aring: "å",
          Ascr: "𝒜",
          ascr: "𝒶",
          Assign: "≔",
          ast: "*",
          asymp: "≈",
          asympeq: "≍",
          Atilde: "Ã",
          atilde: "ã",
          Auml: "Ä",
          auml: "ä",
          awconint: "∳",
          awint: "⨑",
          backcong: "≌",
          backepsilon: "϶",
          backprime: "‵",
          backsim: "∽",
          backsimeq: "⋍",
          Backslash: "∖",
          Barv: "⫧",
          barvee: "⊽",
          barwed: "⌅",
          Barwed: "⌆",
          barwedge: "⌅",
          bbrk: "⎵",
          bbrktbrk: "⎶",
          bcong: "≌",
          Bcy: "Б",
          bcy: "б",
          bdquo: "„",
          becaus: "∵",
          because: "∵",
          Because: "∵",
          bemptyv: "⦰",
          bepsi: "϶",
          bernou: "ℬ",
          Bernoullis: "ℬ",
          Beta: "Β",
          beta: "β",
          beth: "ℶ",
          between: "≬",
          Bfr: "𝔅",
          bfr: "𝔟",
          bigcap: "⋂",
          bigcirc: "◯",
          bigcup: "⋃",
          bigodot: "⨀",
          bigoplus: "⨁",
          bigotimes: "⨂",
          bigsqcup: "⨆",
          bigstar: "★",
          bigtriangledown: "▽",
          bigtriangleup: "△",
          biguplus: "⨄",
          bigvee: "⋁",
          bigwedge: "⋀",
          bkarow: "⤍",
          blacklozenge: "⧫",
          blacksquare: "▪",
          blacktriangle: "▴",
          blacktriangledown: "▾",
          blacktriangleleft: "◂",
          blacktriangleright: "▸",
          blank: "␣",
          blk12: "▒",
          blk14: "░",
          blk34: "▓",
          block: "█",
          bne: "=⃥",
          bnequiv: "≡⃥",
          bNot: "⫭",
          bnot: "⌐",
          Bopf: "𝔹",
          bopf: "𝕓",
          bot: "⊥",
          bottom: "⊥",
          bowtie: "⋈",
          boxbox: "⧉",
          boxdl: "┐",
          boxdL: "╕",
          boxDl: "╖",
          boxDL: "╗",
          boxdr: "┌",
          boxdR: "╒",
          boxDr: "╓",
          boxDR: "╔",
          boxh: "─",
          boxH: "═",
          boxhd: "┬",
          boxHd: "╤",
          boxhD: "╥",
          boxHD: "╦",
          boxhu: "┴",
          boxHu: "╧",
          boxhU: "╨",
          boxHU: "╩",
          boxminus: "⊟",
          boxplus: "⊞",
          boxtimes: "⊠",
          boxul: "┘",
          boxuL: "╛",
          boxUl: "╜",
          boxUL: "╝",
          boxur: "└",
          boxuR: "╘",
          boxUr: "╙",
          boxUR: "╚",
          boxv: "│",
          boxV: "║",
          boxvh: "┼",
          boxvH: "╪",
          boxVh: "╫",
          boxVH: "╬",
          boxvl: "┤",
          boxvL: "╡",
          boxVl: "╢",
          boxVL: "╣",
          boxvr: "├",
          boxvR: "╞",
          boxVr: "╟",
          boxVR: "╠",
          bprime: "‵",
          breve: "˘",
          Breve: "˘",
          brvbar: "¦",
          bscr: "𝒷",
          Bscr: "ℬ",
          bsemi: "⁏",
          bsim: "∽",
          bsime: "⋍",
          bsolb: "⧅",
          bsol: "\\",
          bsolhsub: "⟈",
          bull: "•",
          bullet: "•",
          bump: "≎",
          bumpE: "⪮",
          bumpe: "≏",
          Bumpeq: "≎",
          bumpeq: "≏",
          Cacute: "Ć",
          cacute: "ć",
          capand: "⩄",
          capbrcup: "⩉",
          capcap: "⩋",
          cap: "∩",
          Cap: "⋒",
          capcup: "⩇",
          capdot: "⩀",
          CapitalDifferentialD: "ⅅ",
          caps: "∩︀",
          caret: "⁁",
          caron: "ˇ",
          Cayleys: "ℭ",
          ccaps: "⩍",
          Ccaron: "Č",
          ccaron: "č",
          Ccedil: "Ç",
          ccedil: "ç",
          Ccirc: "Ĉ",
          ccirc: "ĉ",
          Cconint: "∰",
          ccups: "⩌",
          ccupssm: "⩐",
          Cdot: "Ċ",
          cdot: "ċ",
          cedil: "¸",
          Cedilla: "¸",
          cemptyv: "⦲",
          cent: "¢",
          centerdot: "·",
          CenterDot: "·",
          cfr: "𝔠",
          Cfr: "ℭ",
          CHcy: "Ч",
          chcy: "ч",
          check: "✓",
          checkmark: "✓",
          Chi: "Χ",
          chi: "χ",
          circ: "ˆ",
          circeq: "≗",
          circlearrowleft: "↺",
          circlearrowright: "↻",
          circledast: "⊛",
          circledcirc: "⊚",
          circleddash: "⊝",
          CircleDot: "⊙",
          circledR: "®",
          circledS: "Ⓢ",
          CircleMinus: "⊖",
          CirclePlus: "⊕",
          CircleTimes: "⊗",
          cir: "○",
          cirE: "⧃",
          cire: "≗",
          cirfnint: "⨐",
          cirmid: "⫯",
          cirscir: "⧂",
          ClockwiseContourIntegral: "∲",
          CloseCurlyDoubleQuote: "”",
          CloseCurlyQuote: "’",
          clubs: "♣",
          clubsuit: "♣",
          colon: ":",
          Colon: "∷",
          Colone: "⩴",
          colone: "≔",
          coloneq: "≔",
          comma: ",",
          commat: "@",
          comp: "∁",
          compfn: "∘",
          complement: "∁",
          complexes: "ℂ",
          cong: "≅",
          congdot: "⩭",
          Congruent: "≡",
          conint: "∮",
          Conint: "∯",
          ContourIntegral: "∮",
          copf: "𝕔",
          Copf: "ℂ",
          coprod: "∐",
          Coproduct: "∐",
          copy: "©",
          COPY: "©",
          copysr: "℗",
          CounterClockwiseContourIntegral: "∳",
          crarr: "↵",
          cross: "✗",
          Cross: "⨯",
          Cscr: "𝒞",
          cscr: "𝒸",
          csub: "⫏",
          csube: "⫑",
          csup: "⫐",
          csupe: "⫒",
          ctdot: "⋯",
          cudarrl: "⤸",
          cudarrr: "⤵",
          cuepr: "⋞",
          cuesc: "⋟",
          cularr: "↶",
          cularrp: "⤽",
          cupbrcap: "⩈",
          cupcap: "⩆",
          CupCap: "≍",
          cup: "∪",
          Cup: "⋓",
          cupcup: "⩊",
          cupdot: "⊍",
          cupor: "⩅",
          cups: "∪︀",
          curarr: "↷",
          curarrm: "⤼",
          curlyeqprec: "⋞",
          curlyeqsucc: "⋟",
          curlyvee: "⋎",
          curlywedge: "⋏",
          curren: "¤",
          curvearrowleft: "↶",
          curvearrowright: "↷",
          cuvee: "⋎",
          cuwed: "⋏",
          cwconint: "∲",
          cwint: "∱",
          cylcty: "⌭",
          dagger: "†",
          Dagger: "‡",
          daleth: "ℸ",
          darr: "↓",
          Darr: "↡",
          dArr: "⇓",
          dash: "‐",
          Dashv: "⫤",
          dashv: "⊣",
          dbkarow: "⤏",
          dblac: "˝",
          Dcaron: "Ď",
          dcaron: "ď",
          Dcy: "Д",
          dcy: "д",
          ddagger: "‡",
          ddarr: "⇊",
          DD: "ⅅ",
          dd: "ⅆ",
          DDotrahd: "⤑",
          ddotseq: "⩷",
          deg: "°",
          Del: "∇",
          Delta: "Δ",
          delta: "δ",
          demptyv: "⦱",
          dfisht: "⥿",
          Dfr: "𝔇",
          dfr: "𝔡",
          dHar: "⥥",
          dharl: "⇃",
          dharr: "⇂",
          DiacriticalAcute: "´",
          DiacriticalDot: "˙",
          DiacriticalDoubleAcute: "˝",
          DiacriticalGrave: "`",
          DiacriticalTilde: "˜",
          diam: "⋄",
          diamond: "⋄",
          Diamond: "⋄",
          diamondsuit: "♦",
          diams: "♦",
          die: "¨",
          DifferentialD: "ⅆ",
          digamma: "ϝ",
          disin: "⋲",
          div: "÷",
          divide: "÷",
          divideontimes: "⋇",
          divonx: "⋇",
          DJcy: "Ђ",
          djcy: "ђ",
          dlcorn: "⌞",
          dlcrop: "⌍",
          dollar: "$",
          Dopf: "𝔻",
          dopf: "𝕕",
          Dot: "¨",
          dot: "˙",
          DotDot: "⃜",
          doteq: "≐",
          doteqdot: "≑",
          DotEqual: "≐",
          dotminus: "∸",
          dotplus: "∔",
          dotsquare: "⊡",
          doublebarwedge: "⌆",
          DoubleContourIntegral: "∯",
          DoubleDot: "¨",
          DoubleDownArrow: "⇓",
          DoubleLeftArrow: "⇐",
          DoubleLeftRightArrow: "⇔",
          DoubleLeftTee: "⫤",
          DoubleLongLeftArrow: "⟸",
          DoubleLongLeftRightArrow: "⟺",
          DoubleLongRightArrow: "⟹",
          DoubleRightArrow: "⇒",
          DoubleRightTee: "⊨",
          DoubleUpArrow: "⇑",
          DoubleUpDownArrow: "⇕",
          DoubleVerticalBar: "∥",
          DownArrowBar: "⤓",
          downarrow: "↓",
          DownArrow: "↓",
          Downarrow: "⇓",
          DownArrowUpArrow: "⇵",
          DownBreve: "̑",
          downdownarrows: "⇊",
          downharpoonleft: "⇃",
          downharpoonright: "⇂",
          DownLeftRightVector: "⥐",
          DownLeftTeeVector: "⥞",
          DownLeftVectorBar: "⥖",
          DownLeftVector: "↽",
          DownRightTeeVector: "⥟",
          DownRightVectorBar: "⥗",
          DownRightVector: "⇁",
          DownTeeArrow: "↧",
          DownTee: "⊤",
          drbkarow: "⤐",
          drcorn: "⌟",
          drcrop: "⌌",
          Dscr: "𝒟",
          dscr: "𝒹",
          DScy: "Ѕ",
          dscy: "ѕ",
          dsol: "⧶",
          Dstrok: "Đ",
          dstrok: "đ",
          dtdot: "⋱",
          dtri: "▿",
          dtrif: "▾",
          duarr: "⇵",
          duhar: "⥯",
          dwangle: "⦦",
          DZcy: "Џ",
          dzcy: "џ",
          dzigrarr: "⟿",
          Eacute: "É",
          eacute: "é",
          easter: "⩮",
          Ecaron: "Ě",
          ecaron: "ě",
          Ecirc: "Ê",
          ecirc: "ê",
          ecir: "≖",
          ecolon: "≕",
          Ecy: "Э",
          ecy: "э",
          eDDot: "⩷",
          Edot: "Ė",
          edot: "ė",
          eDot: "≑",
          ee: "ⅇ",
          efDot: "≒",
          Efr: "𝔈",
          efr: "𝔢",
          eg: "⪚",
          Egrave: "È",
          egrave: "è",
          egs: "⪖",
          egsdot: "⪘",
          el: "⪙",
          Element: "∈",
          elinters: "⏧",
          ell: "ℓ",
          els: "⪕",
          elsdot: "⪗",
          Emacr: "Ē",
          emacr: "ē",
          empty: "∅",
          emptyset: "∅",
          EmptySmallSquare: "◻",
          emptyv: "∅",
          EmptyVerySmallSquare: "▫",
          emsp13: " ",
          emsp14: " ",
          emsp: " ",
          ENG: "Ŋ",
          eng: "ŋ",
          ensp: " ",
          Eogon: "Ę",
          eogon: "ę",
          Eopf: "𝔼",
          eopf: "𝕖",
          epar: "⋕",
          eparsl: "⧣",
          eplus: "⩱",
          epsi: "ε",
          Epsilon: "Ε",
          epsilon: "ε",
          epsiv: "ϵ",
          eqcirc: "≖",
          eqcolon: "≕",
          eqsim: "≂",
          eqslantgtr: "⪖",
          eqslantless: "⪕",
          Equal: "⩵",
          equals: "=",
          EqualTilde: "≂",
          equest: "≟",
          Equilibrium: "⇌",
          equiv: "≡",
          equivDD: "⩸",
          eqvparsl: "⧥",
          erarr: "⥱",
          erDot: "≓",
          escr: "ℯ",
          Escr: "ℰ",
          esdot: "≐",
          Esim: "⩳",
          esim: "≂",
          Eta: "Η",
          eta: "η",
          ETH: "Ð",
          eth: "ð",
          Euml: "Ë",
          euml: "ë",
          euro: "€",
          excl: "!",
          exist: "∃",
          Exists: "∃",
          expectation: "ℰ",
          exponentiale: "ⅇ",
          ExponentialE: "ⅇ",
          fallingdotseq: "≒",
          Fcy: "Ф",
          fcy: "ф",
          female: "♀",
          ffilig: "ﬃ",
          fflig: "ﬀ",
          ffllig: "ﬄ",
          Ffr: "𝔉",
          ffr: "𝔣",
          filig: "ﬁ",
          FilledSmallSquare: "◼",
          FilledVerySmallSquare: "▪",
          fjlig: "fj",
          flat: "♭",
          fllig: "ﬂ",
          fltns: "▱",
          fnof: "ƒ",
          Fopf: "𝔽",
          fopf: "𝕗",
          forall: "∀",
          ForAll: "∀",
          fork: "⋔",
          forkv: "⫙",
          Fouriertrf: "ℱ",
          fpartint: "⨍",
          frac12: "½",
          frac13: "⅓",
          frac14: "¼",
          frac15: "⅕",
          frac16: "⅙",
          frac18: "⅛",
          frac23: "⅔",
          frac25: "⅖",
          frac34: "¾",
          frac35: "⅗",
          frac38: "⅜",
          frac45: "⅘",
          frac56: "⅚",
          frac58: "⅝",
          frac78: "⅞",
          frasl: "⁄",
          frown: "⌢",
          fscr: "𝒻",
          Fscr: "ℱ",
          gacute: "ǵ",
          Gamma: "Γ",
          gamma: "γ",
          Gammad: "Ϝ",
          gammad: "ϝ",
          gap: "⪆",
          Gbreve: "Ğ",
          gbreve: "ğ",
          Gcedil: "Ģ",
          Gcirc: "Ĝ",
          gcirc: "ĝ",
          Gcy: "Г",
          gcy: "г",
          Gdot: "Ġ",
          gdot: "ġ",
          ge: "≥",
          gE: "≧",
          gEl: "⪌",
          gel: "⋛",
          geq: "≥",
          geqq: "≧",
          geqslant: "⩾",
          gescc: "⪩",
          ges: "⩾",
          gesdot: "⪀",
          gesdoto: "⪂",
          gesdotol: "⪄",
          gesl: "⋛︀",
          gesles: "⪔",
          Gfr: "𝔊",
          gfr: "𝔤",
          gg: "≫",
          Gg: "⋙",
          ggg: "⋙",
          gimel: "ℷ",
          GJcy: "Ѓ",
          gjcy: "ѓ",
          gla: "⪥",
          gl: "≷",
          glE: "⪒",
          glj: "⪤",
          gnap: "⪊",
          gnapprox: "⪊",
          gne: "⪈",
          gnE: "≩",
          gneq: "⪈",
          gneqq: "≩",
          gnsim: "⋧",
          Gopf: "𝔾",
          gopf: "𝕘",
          grave: "`",
          GreaterEqual: "≥",
          GreaterEqualLess: "⋛",
          GreaterFullEqual: "≧",
          GreaterGreater: "⪢",
          GreaterLess: "≷",
          GreaterSlantEqual: "⩾",
          GreaterTilde: "≳",
          Gscr: "𝒢",
          gscr: "ℊ",
          gsim: "≳",
          gsime: "⪎",
          gsiml: "⪐",
          gtcc: "⪧",
          gtcir: "⩺",
          gt: ">",
          GT: ">",
          Gt: "≫",
          gtdot: "⋗",
          gtlPar: "⦕",
          gtquest: "⩼",
          gtrapprox: "⪆",
          gtrarr: "⥸",
          gtrdot: "⋗",
          gtreqless: "⋛",
          gtreqqless: "⪌",
          gtrless: "≷",
          gtrsim: "≳",
          gvertneqq: "≩︀",
          gvnE: "≩︀",
          Hacek: "ˇ",
          hairsp: " ",
          half: "½",
          hamilt: "ℋ",
          HARDcy: "Ъ",
          hardcy: "ъ",
          harrcir: "⥈",
          harr: "↔",
          hArr: "⇔",
          harrw: "↭",
          Hat: "^",
          hbar: "ℏ",
          Hcirc: "Ĥ",
          hcirc: "ĥ",
          hearts: "♥",
          heartsuit: "♥",
          hellip: "…",
          hercon: "⊹",
          hfr: "𝔥",
          Hfr: "ℌ",
          HilbertSpace: "ℋ",
          hksearow: "⤥",
          hkswarow: "⤦",
          hoarr: "⇿",
          homtht: "∻",
          hookleftarrow: "↩",
          hookrightarrow: "↪",
          hopf: "𝕙",
          Hopf: "ℍ",
          horbar: "―",
          HorizontalLine: "─",
          hscr: "𝒽",
          Hscr: "ℋ",
          hslash: "ℏ",
          Hstrok: "Ħ",
          hstrok: "ħ",
          HumpDownHump: "≎",
          HumpEqual: "≏",
          hybull: "⁃",
          hyphen: "‐",
          Iacute: "Í",
          iacute: "í",
          ic: "⁣",
          Icirc: "Î",
          icirc: "î",
          Icy: "И",
          icy: "и",
          Idot: "İ",
          IEcy: "Е",
          iecy: "е",
          iexcl: "¡",
          iff: "⇔",
          ifr: "𝔦",
          Ifr: "ℑ",
          Igrave: "Ì",
          igrave: "ì",
          ii: "ⅈ",
          iiiint: "⨌",
          iiint: "∭",
          iinfin: "⧜",
          iiota: "℩",
          IJlig: "Ĳ",
          ijlig: "ĳ",
          Imacr: "Ī",
          imacr: "ī",
          image: "ℑ",
          ImaginaryI: "ⅈ",
          imagline: "ℐ",
          imagpart: "ℑ",
          imath: "ı",
          Im: "ℑ",
          imof: "⊷",
          imped: "Ƶ",
          Implies: "⇒",
          incare: "℅",
          in: "∈",
          infin: "∞",
          infintie: "⧝",
          inodot: "ı",
          intcal: "⊺",
          int: "∫",
          Int: "∬",
          integers: "ℤ",
          Integral: "∫",
          intercal: "⊺",
          Intersection: "⋂",
          intlarhk: "⨗",
          intprod: "⨼",
          InvisibleComma: "⁣",
          InvisibleTimes: "⁢",
          IOcy: "Ё",
          iocy: "ё",
          Iogon: "Į",
          iogon: "į",
          Iopf: "𝕀",
          iopf: "𝕚",
          Iota: "Ι",
          iota: "ι",
          iprod: "⨼",
          iquest: "¿",
          iscr: "𝒾",
          Iscr: "ℐ",
          isin: "∈",
          isindot: "⋵",
          isinE: "⋹",
          isins: "⋴",
          isinsv: "⋳",
          isinv: "∈",
          it: "⁢",
          Itilde: "Ĩ",
          itilde: "ĩ",
          Iukcy: "І",
          iukcy: "і",
          Iuml: "Ï",
          iuml: "ï",
          Jcirc: "Ĵ",
          jcirc: "ĵ",
          Jcy: "Й",
          jcy: "й",
          Jfr: "𝔍",
          jfr: "𝔧",
          jmath: "ȷ",
          Jopf: "𝕁",
          jopf: "𝕛",
          Jscr: "𝒥",
          jscr: "𝒿",
          Jsercy: "Ј",
          jsercy: "ј",
          Jukcy: "Є",
          jukcy: "є",
          Kappa: "Κ",
          kappa: "κ",
          kappav: "ϰ",
          Kcedil: "Ķ",
          kcedil: "ķ",
          Kcy: "К",
          kcy: "к",
          Kfr: "𝔎",
          kfr: "𝔨",
          kgreen: "ĸ",
          KHcy: "Х",
          khcy: "х",
          KJcy: "Ќ",
          kjcy: "ќ",
          Kopf: "𝕂",
          kopf: "𝕜",
          Kscr: "𝒦",
          kscr: "𝓀",
          lAarr: "⇚",
          Lacute: "Ĺ",
          lacute: "ĺ",
          laemptyv: "⦴",
          lagran: "ℒ",
          Lambda: "Λ",
          lambda: "λ",
          lang: "⟨",
          Lang: "⟪",
          langd: "⦑",
          langle: "⟨",
          lap: "⪅",
          Laplacetrf: "ℒ",
          laquo: "«",
          larrb: "⇤",
          larrbfs: "⤟",
          larr: "←",
          Larr: "↞",
          lArr: "⇐",
          larrfs: "⤝",
          larrhk: "↩",
          larrlp: "↫",
          larrpl: "⤹",
          larrsim: "⥳",
          larrtl: "↢",
          latail: "⤙",
          lAtail: "⤛",
          lat: "⪫",
          late: "⪭",
          lates: "⪭︀",
          lbarr: "⤌",
          lBarr: "⤎",
          lbbrk: "❲",
          lbrace: "{",
          lbrack: "[",
          lbrke: "⦋",
          lbrksld: "⦏",
          lbrkslu: "⦍",
          Lcaron: "Ľ",
          lcaron: "ľ",
          Lcedil: "Ļ",
          lcedil: "ļ",
          lceil: "⌈",
          lcub: "{",
          Lcy: "Л",
          lcy: "л",
          ldca: "⤶",
          ldquo: "“",
          ldquor: "„",
          ldrdhar: "⥧",
          ldrushar: "⥋",
          ldsh: "↲",
          le: "≤",
          lE: "≦",
          LeftAngleBracket: "⟨",
          LeftArrowBar: "⇤",
          leftarrow: "←",
          LeftArrow: "←",
          Leftarrow: "⇐",
          LeftArrowRightArrow: "⇆",
          leftarrowtail: "↢",
          LeftCeiling: "⌈",
          LeftDoubleBracket: "⟦",
          LeftDownTeeVector: "⥡",
          LeftDownVectorBar: "⥙",
          LeftDownVector: "⇃",
          LeftFloor: "⌊",
          leftharpoondown: "↽",
          leftharpoonup: "↼",
          leftleftarrows: "⇇",
          leftrightarrow: "↔",
          LeftRightArrow: "↔",
          Leftrightarrow: "⇔",
          leftrightarrows: "⇆",
          leftrightharpoons: "⇋",
          leftrightsquigarrow: "↭",
          LeftRightVector: "⥎",
          LeftTeeArrow: "↤",
          LeftTee: "⊣",
          LeftTeeVector: "⥚",
          leftthreetimes: "⋋",
          LeftTriangleBar: "⧏",
          LeftTriangle: "⊲",
          LeftTriangleEqual: "⊴",
          LeftUpDownVector: "⥑",
          LeftUpTeeVector: "⥠",
          LeftUpVectorBar: "⥘",
          LeftUpVector: "↿",
          LeftVectorBar: "⥒",
          LeftVector: "↼",
          lEg: "⪋",
          leg: "⋚",
          leq: "≤",
          leqq: "≦",
          leqslant: "⩽",
          lescc: "⪨",
          les: "⩽",
          lesdot: "⩿",
          lesdoto: "⪁",
          lesdotor: "⪃",
          lesg: "⋚︀",
          lesges: "⪓",
          lessapprox: "⪅",
          lessdot: "⋖",
          lesseqgtr: "⋚",
          lesseqqgtr: "⪋",
          LessEqualGreater: "⋚",
          LessFullEqual: "≦",
          LessGreater: "≶",
          lessgtr: "≶",
          LessLess: "⪡",
          lesssim: "≲",
          LessSlantEqual: "⩽",
          LessTilde: "≲",
          lfisht: "⥼",
          lfloor: "⌊",
          Lfr: "𝔏",
          lfr: "𝔩",
          lg: "≶",
          lgE: "⪑",
          lHar: "⥢",
          lhard: "↽",
          lharu: "↼",
          lharul: "⥪",
          lhblk: "▄",
          LJcy: "Љ",
          ljcy: "љ",
          llarr: "⇇",
          ll: "≪",
          Ll: "⋘",
          llcorner: "⌞",
          Lleftarrow: "⇚",
          llhard: "⥫",
          lltri: "◺",
          Lmidot: "Ŀ",
          lmidot: "ŀ",
          lmoustache: "⎰",
          lmoust: "⎰",
          lnap: "⪉",
          lnapprox: "⪉",
          lne: "⪇",
          lnE: "≨",
          lneq: "⪇",
          lneqq: "≨",
          lnsim: "⋦",
          loang: "⟬",
          loarr: "⇽",
          lobrk: "⟦",
          longleftarrow: "⟵",
          LongLeftArrow: "⟵",
          Longleftarrow: "⟸",
          longleftrightarrow: "⟷",
          LongLeftRightArrow: "⟷",
          Longleftrightarrow: "⟺",
          longmapsto: "⟼",
          longrightarrow: "⟶",
          LongRightArrow: "⟶",
          Longrightarrow: "⟹",
          looparrowleft: "↫",
          looparrowright: "↬",
          lopar: "⦅",
          Lopf: "𝕃",
          lopf: "𝕝",
          loplus: "⨭",
          lotimes: "⨴",
          lowast: "∗",
          lowbar: "_",
          LowerLeftArrow: "↙",
          LowerRightArrow: "↘",
          loz: "◊",
          lozenge: "◊",
          lozf: "⧫",
          lpar: "(",
          lparlt: "⦓",
          lrarr: "⇆",
          lrcorner: "⌟",
          lrhar: "⇋",
          lrhard: "⥭",
          lrm: "‎",
          lrtri: "⊿",
          lsaquo: "‹",
          lscr: "𝓁",
          Lscr: "ℒ",
          lsh: "↰",
          Lsh: "↰",
          lsim: "≲",
          lsime: "⪍",
          lsimg: "⪏",
          lsqb: "[",
          lsquo: "‘",
          lsquor: "‚",
          Lstrok: "Ł",
          lstrok: "ł",
          ltcc: "⪦",
          ltcir: "⩹",
          lt: "<",
          LT: "<",
          Lt: "≪",
          ltdot: "⋖",
          lthree: "⋋",
          ltimes: "⋉",
          ltlarr: "⥶",
          ltquest: "⩻",
          ltri: "◃",
          ltrie: "⊴",
          ltrif: "◂",
          ltrPar: "⦖",
          lurdshar: "⥊",
          luruhar: "⥦",
          lvertneqq: "≨︀",
          lvnE: "≨︀",
          macr: "¯",
          male: "♂",
          malt: "✠",
          maltese: "✠",
          Map: "⤅",
          map: "↦",
          mapsto: "↦",
          mapstodown: "↧",
          mapstoleft: "↤",
          mapstoup: "↥",
          marker: "▮",
          mcomma: "⨩",
          Mcy: "М",
          mcy: "м",
          mdash: "—",
          mDDot: "∺",
          measuredangle: "∡",
          MediumSpace: " ",
          Mellintrf: "ℳ",
          Mfr: "𝔐",
          mfr: "𝔪",
          mho: "℧",
          micro: "µ",
          midast: "*",
          midcir: "⫰",
          mid: "∣",
          middot: "·",
          minusb: "⊟",
          minus: "−",
          minusd: "∸",
          minusdu: "⨪",
          MinusPlus: "∓",
          mlcp: "⫛",
          mldr: "…",
          mnplus: "∓",
          models: "⊧",
          Mopf: "𝕄",
          mopf: "𝕞",
          mp: "∓",
          mscr: "𝓂",
          Mscr: "ℳ",
          mstpos: "∾",
          Mu: "Μ",
          mu: "μ",
          multimap: "⊸",
          mumap: "⊸",
          nabla: "∇",
          Nacute: "Ń",
          nacute: "ń",
          nang: "∠⃒",
          nap: "≉",
          napE: "⩰̸",
          napid: "≋̸",
          napos: "ŉ",
          napprox: "≉",
          natural: "♮",
          naturals: "ℕ",
          natur: "♮",
          nbsp: " ",
          nbump: "≎̸",
          nbumpe: "≏̸",
          ncap: "⩃",
          Ncaron: "Ň",
          ncaron: "ň",
          Ncedil: "Ņ",
          ncedil: "ņ",
          ncong: "≇",
          ncongdot: "⩭̸",
          ncup: "⩂",
          Ncy: "Н",
          ncy: "н",
          ndash: "–",
          nearhk: "⤤",
          nearr: "↗",
          neArr: "⇗",
          nearrow: "↗",
          ne: "≠",
          nedot: "≐̸",
          NegativeMediumSpace: "​",
          NegativeThickSpace: "​",
          NegativeThinSpace: "​",
          NegativeVeryThinSpace: "​",
          nequiv: "≢",
          nesear: "⤨",
          nesim: "≂̸",
          NestedGreaterGreater: "≫",
          NestedLessLess: "≪",
          NewLine: "\n",
          nexist: "∄",
          nexists: "∄",
          Nfr: "𝔑",
          nfr: "𝔫",
          ngE: "≧̸",
          nge: "≱",
          ngeq: "≱",
          ngeqq: "≧̸",
          ngeqslant: "⩾̸",
          nges: "⩾̸",
          nGg: "⋙̸",
          ngsim: "≵",
          nGt: "≫⃒",
          ngt: "≯",
          ngtr: "≯",
          nGtv: "≫̸",
          nharr: "↮",
          nhArr: "⇎",
          nhpar: "⫲",
          ni: "∋",
          nis: "⋼",
          nisd: "⋺",
          niv: "∋",
          NJcy: "Њ",
          njcy: "њ",
          nlarr: "↚",
          nlArr: "⇍",
          nldr: "‥",
          nlE: "≦̸",
          nle: "≰",
          nleftarrow: "↚",
          nLeftarrow: "⇍",
          nleftrightarrow: "↮",
          nLeftrightarrow: "⇎",
          nleq: "≰",
          nleqq: "≦̸",
          nleqslant: "⩽̸",
          nles: "⩽̸",
          nless: "≮",
          nLl: "⋘̸",
          nlsim: "≴",
          nLt: "≪⃒",
          nlt: "≮",
          nltri: "⋪",
          nltrie: "⋬",
          nLtv: "≪̸",
          nmid: "∤",
          NoBreak: "⁠",
          NonBreakingSpace: " ",
          nopf: "𝕟",
          Nopf: "ℕ",
          Not: "⫬",
          not: "¬",
          NotCongruent: "≢",
          NotCupCap: "≭",
          NotDoubleVerticalBar: "∦",
          NotElement: "∉",
          NotEqual: "≠",
          NotEqualTilde: "≂̸",
          NotExists: "∄",
          NotGreater: "≯",
          NotGreaterEqual: "≱",
          NotGreaterFullEqual: "≧̸",
          NotGreaterGreater: "≫̸",
          NotGreaterLess: "≹",
          NotGreaterSlantEqual: "⩾̸",
          NotGreaterTilde: "≵",
          NotHumpDownHump: "≎̸",
          NotHumpEqual: "≏̸",
          notin: "∉",
          notindot: "⋵̸",
          notinE: "⋹̸",
          notinva: "∉",
          notinvb: "⋷",
          notinvc: "⋶",
          NotLeftTriangleBar: "⧏̸",
          NotLeftTriangle: "⋪",
          NotLeftTriangleEqual: "⋬",
          NotLess: "≮",
          NotLessEqual: "≰",
          NotLessGreater: "≸",
          NotLessLess: "≪̸",
          NotLessSlantEqual: "⩽̸",
          NotLessTilde: "≴",
          NotNestedGreaterGreater: "⪢̸",
          NotNestedLessLess: "⪡̸",
          notni: "∌",
          notniva: "∌",
          notnivb: "⋾",
          notnivc: "⋽",
          NotPrecedes: "⊀",
          NotPrecedesEqual: "⪯̸",
          NotPrecedesSlantEqual: "⋠",
          NotReverseElement: "∌",
          NotRightTriangleBar: "⧐̸",
          NotRightTriangle: "⋫",
          NotRightTriangleEqual: "⋭",
          NotSquareSubset: "⊏̸",
          NotSquareSubsetEqual: "⋢",
          NotSquareSuperset: "⊐̸",
          NotSquareSupersetEqual: "⋣",
          NotSubset: "⊂⃒",
          NotSubsetEqual: "⊈",
          NotSucceeds: "⊁",
          NotSucceedsEqual: "⪰̸",
          NotSucceedsSlantEqual: "⋡",
          NotSucceedsTilde: "≿̸",
          NotSuperset: "⊃⃒",
          NotSupersetEqual: "⊉",
          NotTilde: "≁",
          NotTildeEqual: "≄",
          NotTildeFullEqual: "≇",
          NotTildeTilde: "≉",
          NotVerticalBar: "∤",
          nparallel: "∦",
          npar: "∦",
          nparsl: "⫽⃥",
          npart: "∂̸",
          npolint: "⨔",
          npr: "⊀",
          nprcue: "⋠",
          nprec: "⊀",
          npreceq: "⪯̸",
          npre: "⪯̸",
          nrarrc: "⤳̸",
          nrarr: "↛",
          nrArr: "⇏",
          nrarrw: "↝̸",
          nrightarrow: "↛",
          nRightarrow: "⇏",
          nrtri: "⋫",
          nrtrie: "⋭",
          nsc: "⊁",
          nsccue: "⋡",
          nsce: "⪰̸",
          Nscr: "𝒩",
          nscr: "𝓃",
          nshortmid: "∤",
          nshortparallel: "∦",
          nsim: "≁",
          nsime: "≄",
          nsimeq: "≄",
          nsmid: "∤",
          nspar: "∦",
          nsqsube: "⋢",
          nsqsupe: "⋣",
          nsub: "⊄",
          nsubE: "⫅̸",
          nsube: "⊈",
          nsubset: "⊂⃒",
          nsubseteq: "⊈",
          nsubseteqq: "⫅̸",
          nsucc: "⊁",
          nsucceq: "⪰̸",
          nsup: "⊅",
          nsupE: "⫆̸",
          nsupe: "⊉",
          nsupset: "⊃⃒",
          nsupseteq: "⊉",
          nsupseteqq: "⫆̸",
          ntgl: "≹",
          Ntilde: "Ñ",
          ntilde: "ñ",
          ntlg: "≸",
          ntriangleleft: "⋪",
          ntrianglelefteq: "⋬",
          ntriangleright: "⋫",
          ntrianglerighteq: "⋭",
          Nu: "Ν",
          nu: "ν",
          num: "#",
          numero: "№",
          numsp: " ",
          nvap: "≍⃒",
          nvdash: "⊬",
          nvDash: "⊭",
          nVdash: "⊮",
          nVDash: "⊯",
          nvge: "≥⃒",
          nvgt: ">⃒",
          nvHarr: "⤄",
          nvinfin: "⧞",
          nvlArr: "⤂",
          nvle: "≤⃒",
          nvlt: "<⃒",
          nvltrie: "⊴⃒",
          nvrArr: "⤃",
          nvrtrie: "⊵⃒",
          nvsim: "∼⃒",
          nwarhk: "⤣",
          nwarr: "↖",
          nwArr: "⇖",
          nwarrow: "↖",
          nwnear: "⤧",
          Oacute: "Ó",
          oacute: "ó",
          oast: "⊛",
          Ocirc: "Ô",
          ocirc: "ô",
          ocir: "⊚",
          Ocy: "О",
          ocy: "о",
          odash: "⊝",
          Odblac: "Ő",
          odblac: "ő",
          odiv: "⨸",
          odot: "⊙",
          odsold: "⦼",
          OElig: "Œ",
          oelig: "œ",
          ofcir: "⦿",
          Ofr: "𝔒",
          ofr: "𝔬",
          ogon: "˛",
          Ograve: "Ò",
          ograve: "ò",
          ogt: "⧁",
          ohbar: "⦵",
          ohm: "Ω",
          oint: "∮",
          olarr: "↺",
          olcir: "⦾",
          olcross: "⦻",
          oline: "‾",
          olt: "⧀",
          Omacr: "Ō",
          omacr: "ō",
          Omega: "Ω",
          omega: "ω",
          Omicron: "Ο",
          omicron: "ο",
          omid: "⦶",
          ominus: "⊖",
          Oopf: "𝕆",
          oopf: "𝕠",
          opar: "⦷",
          OpenCurlyDoubleQuote: "“",
          OpenCurlyQuote: "‘",
          operp: "⦹",
          oplus: "⊕",
          orarr: "↻",
          Or: "⩔",
          or: "∨",
          ord: "⩝",
          order: "ℴ",
          orderof: "ℴ",
          ordf: "ª",
          ordm: "º",
          origof: "⊶",
          oror: "⩖",
          orslope: "⩗",
          orv: "⩛",
          oS: "Ⓢ",
          Oscr: "𝒪",
          oscr: "ℴ",
          Oslash: "Ø",
          oslash: "ø",
          osol: "⊘",
          Otilde: "Õ",
          otilde: "õ",
          otimesas: "⨶",
          Otimes: "⨷",
          otimes: "⊗",
          Ouml: "Ö",
          ouml: "ö",
          ovbar: "⌽",
          OverBar: "‾",
          OverBrace: "⏞",
          OverBracket: "⎴",
          OverParenthesis: "⏜",
          para: "¶",
          parallel: "∥",
          par: "∥",
          parsim: "⫳",
          parsl: "⫽",
          part: "∂",
          PartialD: "∂",
          Pcy: "П",
          pcy: "п",
          percnt: "%",
          period: ".",
          permil: "‰",
          perp: "⊥",
          pertenk: "‱",
          Pfr: "𝔓",
          pfr: "𝔭",
          Phi: "Φ",
          phi: "φ",
          phiv: "ϕ",
          phmmat: "ℳ",
          phone: "☎",
          Pi: "Π",
          pi: "π",
          pitchfork: "⋔",
          piv: "ϖ",
          planck: "ℏ",
          planckh: "ℎ",
          plankv: "ℏ",
          plusacir: "⨣",
          plusb: "⊞",
          pluscir: "⨢",
          plus: "+",
          plusdo: "∔",
          plusdu: "⨥",
          pluse: "⩲",
          PlusMinus: "±",
          plusmn: "±",
          plussim: "⨦",
          plustwo: "⨧",
          pm: "±",
          Poincareplane: "ℌ",
          pointint: "⨕",
          popf: "𝕡",
          Popf: "ℙ",
          pound: "£",
          prap: "⪷",
          Pr: "⪻",
          pr: "≺",
          prcue: "≼",
          precapprox: "⪷",
          prec: "≺",
          preccurlyeq: "≼",
          Precedes: "≺",
          PrecedesEqual: "⪯",
          PrecedesSlantEqual: "≼",
          PrecedesTilde: "≾",
          preceq: "⪯",
          precnapprox: "⪹",
          precneqq: "⪵",
          precnsim: "⋨",
          pre: "⪯",
          prE: "⪳",
          precsim: "≾",
          prime: "′",
          Prime: "″",
          primes: "ℙ",
          prnap: "⪹",
          prnE: "⪵",
          prnsim: "⋨",
          prod: "∏",
          Product: "∏",
          profalar: "⌮",
          profline: "⌒",
          profsurf: "⌓",
          prop: "∝",
          Proportional: "∝",
          Proportion: "∷",
          propto: "∝",
          prsim: "≾",
          prurel: "⊰",
          Pscr: "𝒫",
          pscr: "𝓅",
          Psi: "Ψ",
          psi: "ψ",
          puncsp: " ",
          Qfr: "𝔔",
          qfr: "𝔮",
          qint: "⨌",
          qopf: "𝕢",
          Qopf: "ℚ",
          qprime: "⁗",
          Qscr: "𝒬",
          qscr: "𝓆",
          quaternions: "ℍ",
          quatint: "⨖",
          quest: "?",
          questeq: "≟",
          quot: '"',
          QUOT: '"',
          rAarr: "⇛",
          race: "∽̱",
          Racute: "Ŕ",
          racute: "ŕ",
          radic: "√",
          raemptyv: "⦳",
          rang: "⟩",
          Rang: "⟫",
          rangd: "⦒",
          range: "⦥",
          rangle: "⟩",
          raquo: "»",
          rarrap: "⥵",
          rarrb: "⇥",
          rarrbfs: "⤠",
          rarrc: "⤳",
          rarr: "→",
          Rarr: "↠",
          rArr: "⇒",
          rarrfs: "⤞",
          rarrhk: "↪",
          rarrlp: "↬",
          rarrpl: "⥅",
          rarrsim: "⥴",
          Rarrtl: "⤖",
          rarrtl: "↣",
          rarrw: "↝",
          ratail: "⤚",
          rAtail: "⤜",
          ratio: "∶",
          rationals: "ℚ",
          rbarr: "⤍",
          rBarr: "⤏",
          RBarr: "⤐",
          rbbrk: "❳",
          rbrace: "}",
          rbrack: "]",
          rbrke: "⦌",
          rbrksld: "⦎",
          rbrkslu: "⦐",
          Rcaron: "Ř",
          rcaron: "ř",
          Rcedil: "Ŗ",
          rcedil: "ŗ",
          rceil: "⌉",
          rcub: "}",
          Rcy: "Р",
          rcy: "р",
          rdca: "⤷",
          rdldhar: "⥩",
          rdquo: "”",
          rdquor: "”",
          rdsh: "↳",
          real: "ℜ",
          realine: "ℛ",
          realpart: "ℜ",
          reals: "ℝ",
          Re: "ℜ",
          rect: "▭",
          reg: "®",
          REG: "®",
          ReverseElement: "∋",
          ReverseEquilibrium: "⇋",
          ReverseUpEquilibrium: "⥯",
          rfisht: "⥽",
          rfloor: "⌋",
          rfr: "𝔯",
          Rfr: "ℜ",
          rHar: "⥤",
          rhard: "⇁",
          rharu: "⇀",
          rharul: "⥬",
          Rho: "Ρ",
          rho: "ρ",
          rhov: "ϱ",
          RightAngleBracket: "⟩",
          RightArrowBar: "⇥",
          rightarrow: "→",
          RightArrow: "→",
          Rightarrow: "⇒",
          RightArrowLeftArrow: "⇄",
          rightarrowtail: "↣",
          RightCeiling: "⌉",
          RightDoubleBracket: "⟧",
          RightDownTeeVector: "⥝",
          RightDownVectorBar: "⥕",
          RightDownVector: "⇂",
          RightFloor: "⌋",
          rightharpoondown: "⇁",
          rightharpoonup: "⇀",
          rightleftarrows: "⇄",
          rightleftharpoons: "⇌",
          rightrightarrows: "⇉",
          rightsquigarrow: "↝",
          RightTeeArrow: "↦",
          RightTee: "⊢",
          RightTeeVector: "⥛",
          rightthreetimes: "⋌",
          RightTriangleBar: "⧐",
          RightTriangle: "⊳",
          RightTriangleEqual: "⊵",
          RightUpDownVector: "⥏",
          RightUpTeeVector: "⥜",
          RightUpVectorBar: "⥔",
          RightUpVector: "↾",
          RightVectorBar: "⥓",
          RightVector: "⇀",
          ring: "˚",
          risingdotseq: "≓",
          rlarr: "⇄",
          rlhar: "⇌",
          rlm: "‏",
          rmoustache: "⎱",
          rmoust: "⎱",
          rnmid: "⫮",
          roang: "⟭",
          roarr: "⇾",
          robrk: "⟧",
          ropar: "⦆",
          ropf: "𝕣",
          Ropf: "ℝ",
          roplus: "⨮",
          rotimes: "⨵",
          RoundImplies: "⥰",
          rpar: ")",
          rpargt: "⦔",
          rppolint: "⨒",
          rrarr: "⇉",
          Rrightarrow: "⇛",
          rsaquo: "›",
          rscr: "𝓇",
          Rscr: "ℛ",
          rsh: "↱",
          Rsh: "↱",
          rsqb: "]",
          rsquo: "’",
          rsquor: "’",
          rthree: "⋌",
          rtimes: "⋊",
          rtri: "▹",
          rtrie: "⊵",
          rtrif: "▸",
          rtriltri: "⧎",
          RuleDelayed: "⧴",
          ruluhar: "⥨",
          rx: "℞",
          Sacute: "Ś",
          sacute: "ś",
          sbquo: "‚",
          scap: "⪸",
          Scaron: "Š",
          scaron: "š",
          Sc: "⪼",
          sc: "≻",
          sccue: "≽",
          sce: "⪰",
          scE: "⪴",
          Scedil: "Ş",
          scedil: "ş",
          Scirc: "Ŝ",
          scirc: "ŝ",
          scnap: "⪺",
          scnE: "⪶",
          scnsim: "⋩",
          scpolint: "⨓",
          scsim: "≿",
          Scy: "С",
          scy: "с",
          sdotb: "⊡",
          sdot: "⋅",
          sdote: "⩦",
          searhk: "⤥",
          searr: "↘",
          seArr: "⇘",
          searrow: "↘",
          sect: "§",
          semi: ";",
          seswar: "⤩",
          setminus: "∖",
          setmn: "∖",
          sext: "✶",
          Sfr: "𝔖",
          sfr: "𝔰",
          sfrown: "⌢",
          sharp: "♯",
          SHCHcy: "Щ",
          shchcy: "щ",
          SHcy: "Ш",
          shcy: "ш",
          ShortDownArrow: "↓",
          ShortLeftArrow: "←",
          shortmid: "∣",
          shortparallel: "∥",
          ShortRightArrow: "→",
          ShortUpArrow: "↑",
          shy: "­",
          Sigma: "Σ",
          sigma: "σ",
          sigmaf: "ς",
          sigmav: "ς",
          sim: "∼",
          simdot: "⩪",
          sime: "≃",
          simeq: "≃",
          simg: "⪞",
          simgE: "⪠",
          siml: "⪝",
          simlE: "⪟",
          simne: "≆",
          simplus: "⨤",
          simrarr: "⥲",
          slarr: "←",
          SmallCircle: "∘",
          smallsetminus: "∖",
          smashp: "⨳",
          smeparsl: "⧤",
          smid: "∣",
          smile: "⌣",
          smt: "⪪",
          smte: "⪬",
          smtes: "⪬︀",
          SOFTcy: "Ь",
          softcy: "ь",
          solbar: "⌿",
          solb: "⧄",
          sol: "/",
          Sopf: "𝕊",
          sopf: "𝕤",
          spades: "♠",
          spadesuit: "♠",
          spar: "∥",
          sqcap: "⊓",
          sqcaps: "⊓︀",
          sqcup: "⊔",
          sqcups: "⊔︀",
          Sqrt: "√",
          sqsub: "⊏",
          sqsube: "⊑",
          sqsubset: "⊏",
          sqsubseteq: "⊑",
          sqsup: "⊐",
          sqsupe: "⊒",
          sqsupset: "⊐",
          sqsupseteq: "⊒",
          square: "□",
          Square: "□",
          SquareIntersection: "⊓",
          SquareSubset: "⊏",
          SquareSubsetEqual: "⊑",
          SquareSuperset: "⊐",
          SquareSupersetEqual: "⊒",
          SquareUnion: "⊔",
          squarf: "▪",
          squ: "□",
          squf: "▪",
          srarr: "→",
          Sscr: "𝒮",
          sscr: "𝓈",
          ssetmn: "∖",
          ssmile: "⌣",
          sstarf: "⋆",
          Star: "⋆",
          star: "☆",
          starf: "★",
          straightepsilon: "ϵ",
          straightphi: "ϕ",
          strns: "¯",
          sub: "⊂",
          Sub: "⋐",
          subdot: "⪽",
          subE: "⫅",
          sube: "⊆",
          subedot: "⫃",
          submult: "⫁",
          subnE: "⫋",
          subne: "⊊",
          subplus: "⪿",
          subrarr: "⥹",
          subset: "⊂",
          Subset: "⋐",
          subseteq: "⊆",
          subseteqq: "⫅",
          SubsetEqual: "⊆",
          subsetneq: "⊊",
          subsetneqq: "⫋",
          subsim: "⫇",
          subsub: "⫕",
          subsup: "⫓",
          succapprox: "⪸",
          succ: "≻",
          succcurlyeq: "≽",
          Succeeds: "≻",
          SucceedsEqual: "⪰",
          SucceedsSlantEqual: "≽",
          SucceedsTilde: "≿",
          succeq: "⪰",
          succnapprox: "⪺",
          succneqq: "⪶",
          succnsim: "⋩",
          succsim: "≿",
          SuchThat: "∋",
          sum: "∑",
          Sum: "∑",
          sung: "♪",
          sup1: "¹",
          sup2: "²",
          sup3: "³",
          sup: "⊃",
          Sup: "⋑",
          supdot: "⪾",
          supdsub: "⫘",
          supE: "⫆",
          supe: "⊇",
          supedot: "⫄",
          Superset: "⊃",
          SupersetEqual: "⊇",
          suphsol: "⟉",
          suphsub: "⫗",
          suplarr: "⥻",
          supmult: "⫂",
          supnE: "⫌",
          supne: "⊋",
          supplus: "⫀",
          supset: "⊃",
          Supset: "⋑",
          supseteq: "⊇",
          supseteqq: "⫆",
          supsetneq: "⊋",
          supsetneqq: "⫌",
          supsim: "⫈",
          supsub: "⫔",
          supsup: "⫖",
          swarhk: "⤦",
          swarr: "↙",
          swArr: "⇙",
          swarrow: "↙",
          swnwar: "⤪",
          szlig: "ß",
          Tab: "\t",
          target: "⌖",
          Tau: "Τ",
          tau: "τ",
          tbrk: "⎴",
          Tcaron: "Ť",
          tcaron: "ť",
          Tcedil: "Ţ",
          tcedil: "ţ",
          Tcy: "Т",
          tcy: "т",
          tdot: "⃛",
          telrec: "⌕",
          Tfr: "𝔗",
          tfr: "𝔱",
          there4: "∴",
          therefore: "∴",
          Therefore: "∴",
          Theta: "Θ",
          theta: "θ",
          thetasym: "ϑ",
          thetav: "ϑ",
          thickapprox: "≈",
          thicksim: "∼",
          ThickSpace: "  ",
          ThinSpace: " ",
          thinsp: " ",
          thkap: "≈",
          thksim: "∼",
          THORN: "Þ",
          thorn: "þ",
          tilde: "˜",
          Tilde: "∼",
          TildeEqual: "≃",
          TildeFullEqual: "≅",
          TildeTilde: "≈",
          timesbar: "⨱",
          timesb: "⊠",
          times: "×",
          timesd: "⨰",
          tint: "∭",
          toea: "⤨",
          topbot: "⌶",
          topcir: "⫱",
          top: "⊤",
          Topf: "𝕋",
          topf: "𝕥",
          topfork: "⫚",
          tosa: "⤩",
          tprime: "‴",
          trade: "™",
          TRADE: "™",
          triangle: "▵",
          triangledown: "▿",
          triangleleft: "◃",
          trianglelefteq: "⊴",
          triangleq: "≜",
          triangleright: "▹",
          trianglerighteq: "⊵",
          tridot: "◬",
          trie: "≜",
          triminus: "⨺",
          TripleDot: "⃛",
          triplus: "⨹",
          trisb: "⧍",
          tritime: "⨻",
          trpezium: "⏢",
          Tscr: "𝒯",
          tscr: "𝓉",
          TScy: "Ц",
          tscy: "ц",
          TSHcy: "Ћ",
          tshcy: "ћ",
          Tstrok: "Ŧ",
          tstrok: "ŧ",
          twixt: "≬",
          twoheadleftarrow: "↞",
          twoheadrightarrow: "↠",
          Uacute: "Ú",
          uacute: "ú",
          uarr: "↑",
          Uarr: "↟",
          uArr: "⇑",
          Uarrocir: "⥉",
          Ubrcy: "Ў",
          ubrcy: "ў",
          Ubreve: "Ŭ",
          ubreve: "ŭ",
          Ucirc: "Û",
          ucirc: "û",
          Ucy: "У",
          ucy: "у",
          udarr: "⇅",
          Udblac: "Ű",
          udblac: "ű",
          udhar: "⥮",
          ufisht: "⥾",
          Ufr: "𝔘",
          ufr: "𝔲",
          Ugrave: "Ù",
          ugrave: "ù",
          uHar: "⥣",
          uharl: "↿",
          uharr: "↾",
          uhblk: "▀",
          ulcorn: "⌜",
          ulcorner: "⌜",
          ulcrop: "⌏",
          ultri: "◸",
          Umacr: "Ū",
          umacr: "ū",
          uml: "¨",
          UnderBar: "_",
          UnderBrace: "⏟",
          UnderBracket: "⎵",
          UnderParenthesis: "⏝",
          Union: "⋃",
          UnionPlus: "⊎",
          Uogon: "Ų",
          uogon: "ų",
          Uopf: "𝕌",
          uopf: "𝕦",
          UpArrowBar: "⤒",
          uparrow: "↑",
          UpArrow: "↑",
          Uparrow: "⇑",
          UpArrowDownArrow: "⇅",
          updownarrow: "↕",
          UpDownArrow: "↕",
          Updownarrow: "⇕",
          UpEquilibrium: "⥮",
          upharpoonleft: "↿",
          upharpoonright: "↾",
          uplus: "⊎",
          UpperLeftArrow: "↖",
          UpperRightArrow: "↗",
          upsi: "υ",
          Upsi: "ϒ",
          upsih: "ϒ",
          Upsilon: "Υ",
          upsilon: "υ",
          UpTeeArrow: "↥",
          UpTee: "⊥",
          upuparrows: "⇈",
          urcorn: "⌝",
          urcorner: "⌝",
          urcrop: "⌎",
          Uring: "Ů",
          uring: "ů",
          urtri: "◹",
          Uscr: "𝒰",
          uscr: "𝓊",
          utdot: "⋰",
          Utilde: "Ũ",
          utilde: "ũ",
          utri: "▵",
          utrif: "▴",
          uuarr: "⇈",
          Uuml: "Ü",
          uuml: "ü",
          uwangle: "⦧",
          vangrt: "⦜",
          varepsilon: "ϵ",
          varkappa: "ϰ",
          varnothing: "∅",
          varphi: "ϕ",
          varpi: "ϖ",
          varpropto: "∝",
          varr: "↕",
          vArr: "⇕",
          varrho: "ϱ",
          varsigma: "ς",
          varsubsetneq: "⊊︀",
          varsubsetneqq: "⫋︀",
          varsupsetneq: "⊋︀",
          varsupsetneqq: "⫌︀",
          vartheta: "ϑ",
          vartriangleleft: "⊲",
          vartriangleright: "⊳",
          vBar: "⫨",
          Vbar: "⫫",
          vBarv: "⫩",
          Vcy: "В",
          vcy: "в",
          vdash: "⊢",
          vDash: "⊨",
          Vdash: "⊩",
          VDash: "⊫",
          Vdashl: "⫦",
          veebar: "⊻",
          vee: "∨",
          Vee: "⋁",
          veeeq: "≚",
          vellip: "⋮",
          verbar: "|",
          Verbar: "‖",
          vert: "|",
          Vert: "‖",
          VerticalBar: "∣",
          VerticalLine: "|",
          VerticalSeparator: "❘",
          VerticalTilde: "≀",
          VeryThinSpace: " ",
          Vfr: "𝔙",
          vfr: "𝔳",
          vltri: "⊲",
          vnsub: "⊂⃒",
          vnsup: "⊃⃒",
          Vopf: "𝕍",
          vopf: "𝕧",
          vprop: "∝",
          vrtri: "⊳",
          Vscr: "𝒱",
          vscr: "𝓋",
          vsubnE: "⫋︀",
          vsubne: "⊊︀",
          vsupnE: "⫌︀",
          vsupne: "⊋︀",
          Vvdash: "⊪",
          vzigzag: "⦚",
          Wcirc: "Ŵ",
          wcirc: "ŵ",
          wedbar: "⩟",
          wedge: "∧",
          Wedge: "⋀",
          wedgeq: "≙",
          weierp: "℘",
          Wfr: "𝔚",
          wfr: "𝔴",
          Wopf: "𝕎",
          wopf: "𝕨",
          wp: "℘",
          wr: "≀",
          wreath: "≀",
          Wscr: "𝒲",
          wscr: "𝓌",
          xcap: "⋂",
          xcirc: "◯",
          xcup: "⋃",
          xdtri: "▽",
          Xfr: "𝔛",
          xfr: "𝔵",
          xharr: "⟷",
          xhArr: "⟺",
          Xi: "Ξ",
          xi: "ξ",
          xlarr: "⟵",
          xlArr: "⟸",
          xmap: "⟼",
          xnis: "⋻",
          xodot: "⨀",
          Xopf: "𝕏",
          xopf: "𝕩",
          xoplus: "⨁",
          xotime: "⨂",
          xrarr: "⟶",
          xrArr: "⟹",
          Xscr: "𝒳",
          xscr: "𝓍",
          xsqcup: "⨆",
          xuplus: "⨄",
          xutri: "△",
          xvee: "⋁",
          xwedge: "⋀",
          Yacute: "Ý",
          yacute: "ý",
          YAcy: "Я",
          yacy: "я",
          Ycirc: "Ŷ",
          ycirc: "ŷ",
          Ycy: "Ы",
          ycy: "ы",
          yen: "¥",
          Yfr: "𝔜",
          yfr: "𝔶",
          YIcy: "Ї",
          yicy: "ї",
          Yopf: "𝕐",
          yopf: "𝕪",
          Yscr: "𝒴",
          yscr: "𝓎",
          YUcy: "Ю",
          yucy: "ю",
          yuml: "ÿ",
          Yuml: "Ÿ",
          Zacute: "Ź",
          zacute: "ź",
          Zcaron: "Ž",
          zcaron: "ž",
          Zcy: "З",
          zcy: "з",
          Zdot: "Ż",
          zdot: "ż",
          zeetrf: "ℨ",
          ZeroWidthSpace: "​",
          Zeta: "Ζ",
          zeta: "ζ",
          zfr: "𝔷",
          Zfr: "ℨ",
          ZHcy: "Ж",
          zhcy: "ж",
          zigrarr: "⇝",
          zopf: "𝕫",
          Zopf: "ℤ",
          Zscr: "𝒵",
          zscr: "𝓏",
          zwj: "‍",
          zwnj: "‌",
        };
      },
      {},
    ],
    8: [
      function (require, module, exports) {
        module.exports = {
          Aacute: "Á",
          aacute: "á",
          Acirc: "Â",
          acirc: "â",
          acute: "´",
          AElig: "Æ",
          aelig: "æ",
          Agrave: "À",
          agrave: "à",
          amp: "&",
          AMP: "&",
          Aring: "Å",
          aring: "å",
          Atilde: "Ã",
          atilde: "ã",
          Auml: "Ä",
          auml: "ä",
          brvbar: "¦",
          Ccedil: "Ç",
          ccedil: "ç",
          cedil: "¸",
          cent: "¢",
          copy: "©",
          COPY: "©",
          curren: "¤",
          deg: "°",
          divide: "÷",
          Eacute: "É",
          eacute: "é",
          Ecirc: "Ê",
          ecirc: "ê",
          Egrave: "È",
          egrave: "è",
          ETH: "Ð",
          eth: "ð",
          Euml: "Ë",
          euml: "ë",
          frac12: "½",
          frac14: "¼",
          frac34: "¾",
          gt: ">",
          GT: ">",
          Iacute: "Í",
          iacute: "í",
          Icirc: "Î",
          icirc: "î",
          iexcl: "¡",
          Igrave: "Ì",
          igrave: "ì",
          iquest: "¿",
          Iuml: "Ï",
          iuml: "ï",
          laquo: "«",
          lt: "<",
          LT: "<",
          macr: "¯",
          micro: "µ",
          middot: "·",
          nbsp: " ",
          not: "¬",
          Ntilde: "Ñ",
          ntilde: "ñ",
          Oacute: "Ó",
          oacute: "ó",
          Ocirc: "Ô",
          ocirc: "ô",
          Ograve: "Ò",
          ograve: "ò",
          ordf: "ª",
          ordm: "º",
          Oslash: "Ø",
          oslash: "ø",
          Otilde: "Õ",
          otilde: "õ",
          Ouml: "Ö",
          ouml: "ö",
          para: "¶",
          plusmn: "±",
          pound: "£",
          quot: '"',
          QUOT: '"',
          raquo: "»",
          reg: "®",
          REG: "®",
          sect: "§",
          shy: "­",
          sup1: "¹",
          sup2: "²",
          sup3: "³",
          szlig: "ß",
          THORN: "Þ",
          thorn: "þ",
          times: "×",
          Uacute: "Ú",
          uacute: "ú",
          Ucirc: "Û",
          ucirc: "û",
          Ugrave: "Ù",
          ugrave: "ù",
          uml: "¨",
          Uuml: "Ü",
          uuml: "ü",
          Yacute: "Ý",
          yacute: "ý",
          yen: "¥",
          yuml: "ÿ",
        };
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        module.exports = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
      },
      {},
    ],
  },
  {},
  [1]
);

/*
 * @Date: 2022-05-12 17:59:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-31 14:41:01
 * @FilePath: /browser-reload-error-overlay-wepback-plugin/lib/client.js
 * @Description: 
 */ 
(function () {
	if (window.__browserReloadPlugin) {
		return;
	}

	const getStyle = (ele, attr) => {
        var style = null;
        if (window.getComputedStyle) {
          style = window.getComputedStyle(ele, null);
        } else {
          style = ele.currentStyle;
        }
        return attr ? style[attr] : style;
      };

      function getParentNode(el, callback = () => {}) {
        while (el && el.tagName !== "HTML") {
          callback(el);
          el = el.parentNode;
        }
      }

      function getElOffset(el) {
        var left = 0;
        var top = 0;
        var marginTop = 0;
        var marginLeft = 0;
        var paddingLeft = 0;
        var paddingTop = 0;
        getParentNode(el, ($el) => {
          left +=
            getStyle($el, "left") === "auto"
              ? 0
              : parseInt(getStyle($el, "left"));

          top +=
            getStyle($el, "top") === "auto"
              ? 0
              : parseInt(getStyle($el, "top"));
          marginTop +=
            getStyle($el, "marginTop") === "auto"
              ? 0
              : parseInt(getStyle($el, "marginTop"));
          marginLeft +=
            getStyle($el, "marginLeft") === "auto"
              ? 0
              : parseInt(getStyle($el, "marginLeft"));
          paddingLeft +=
            getStyle($el, "paddingLeft") === "auto"
              ? 0
              : parseInt(getStyle($el, "paddingLeft"));
          paddingTop +=
            getStyle($el, "paddingTop") === "auto"
              ? 0
              : parseInt(getStyle($el, "paddingTop"));
        });

        return {
          left,
          top,
          marginTop,
          marginLeft,
          paddingLeft,
          paddingTop,
        };
      }
      
      
      
	function guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16); 
		});
	}
	let id = guid()

	var config = window.__browserReloadPlugin = {
		enabled: true,
		retryWait: 5000,
		wsServer: 'ws://localhost:8081',
		delay: 0
	};

	function log(message) {
		console.info('%c browser-reload-error-overlay-wepback-plugin ' + (config.enabled ? '' : '(Disabled) '), 'background:#CB5C0D; padding:2px; border-radius:3px; color:#fff', message);
	}

	(function connect() {
		var socket = new WebSocket(config.wsServer);

		socket.addEventListener('open', function () {
			log('Connected. Waiting for changes.');
		});

		socket.addEventListener('error', function () {
			socket.close();
		});

		socket.addEventListener('close', function () {
			log('Connection closed. Retrying in ' + Math.ceil(config.retryWait / 1000) + 's');

			if (config.retryWait) {
				setTimeout(connect, config.retryWait);
			}
		});

		socket.addEventListener('message', function ({data}) {
			// console.log('data=',data)
			const {cmd,message}  =  JSON.parse(data)
			if (cmd === 'cmd:reload') {
				if (config.enabled) {
					log('Build completed. Reloading...');
					setTimeout(()=>{
						window.location.reload();
					},config.delay)
				} else {
					//   log('Build completed.');
				}
			}

			if(cmd ==="cmd:buildError"){
				log('buildError...');
			//    console.log('message===',message.split('\n'))
                console.error(message)
				let bodyOffset = getElOffset(document.querySelector("body"));
				let $left =bodyOffset.left+bodyOffset.marginLeft+ bodyOffset.paddingLeft
				let $top =bodyOffset.top+bodyOffset.marginTop+ bodyOffset.paddingTop
                let hasIframe =  document.getElementById(id)
                let filter = new ansiToHtml();
                let iframe=hasIframe?hasIframe: document.createElement("iframe");
                iframe.id = id;
                title = "buildError...";
			    iframe.style.cssText = `
						width:calc(100vw + ${$left}px);
						height:calc(100vh + ${$top}px);
						z-Index : 999999999;
						position:fixed;
						border:medium none;
						padding:0px;
						margin :0px;
						top :-${$top}px;
						left :-${$left}px;
				`;


                let html = message.split('\n').reduce((acc, item) => {
                    return (acc += `<div >${filter.toHtml(item)}<div>`);
                }, "");
				html=html.replace(/color\:\#FFF/ig,'')
				iframe.srcdoc = `
							<style>
								* {
											margin: 0;
											padding: 0;
									}
									.ansi-html-box {
										    background: #fff;
											width:calc(100%);
											height:auto;
											min-height: calc(100vh);
											padding-top:${$top+40}px;
											padding-left:${$left+40}px;
											padding-bottom: 40px;
											padding-right: 40px;
											box-sizing: border-box;
											overflow-y: auto;
									}
									.failed-to-compile{
											color:rgb(200, 15, 47);
											font-size: 20px;
									}
							</style>
							<div  class="ansi-html-box">
								<div  class="failed-to-compile">Failed to compile :</div>
								${html}
							<div>;
			             	`;

                if(!hasIframe){
                    document.body.appendChild(iframe);
                }
			}

			if (cmd === 'cmd:rebuilding') {
				log('Rebuilding...');
			}
		});
	})();
})();

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../modules/fast-deep-equal/index.js":
/*!*******************************************!*\
  !*** ../modules/fast-deep-equal/index.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";

module.exports = function equal(a, b) {
  if (a === b)
    return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor)
      return false;
    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (!equal(a[i], b[i]))
          return false;
      return true;
    }
    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length)
      return false;
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
        return false;
    for (i = length; i-- !== 0; ) {
      var key = keys[i];
      if (!equal(a[key], b[key]))
        return false;
    }
    return true;
  }
  return a !== a && b !== b;
};


/***/ }),

/***/ "../modules/hat/index.js":
/*!*******************************!*\
  !*** ../modules/hat/index.js ***!
  \*******************************/
/***/ ((module) => {

var hat = module.exports = function(bits, base) {
  if (!base)
    base = 16;
  if (bits === void 0)
    bits = 128;
  if (bits <= 0)
    return "0";
  var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
  for (var i = 2; digits === Infinity; i *= 2) {
    digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
  }
  var rem = digits - Math.floor(digits);
  var res = "";
  for (var i = 0; i < Math.floor(digits); i++) {
    var x = Math.floor(Math.random() * base).toString(base);
    res = x + res;
  }
  if (rem) {
    var b = Math.pow(base, rem);
    var x = Math.floor(Math.random() * b).toString(base);
    res = x + res;
  }
  var parsed = parseInt(res, base);
  if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
    return hat(bits, base);
  } else
    return res;
};
hat.rack = function(bits, base, expandBy) {
  var fn = function(data) {
    var iters = 0;
    do {
      if (iters++ > 10) {
        if (expandBy)
          bits += expandBy;
        else
          throw new Error("too many ID collisions, use more bits");
      }
      var id = hat(bits, base);
    } while (Object.hasOwnProperty.call(hats, id));
    hats[id] = data;
    return id;
  };
  var hats = fn.hats = {};
  fn.get = function(id) {
    return fn.hats[id];
  };
  fn.set = function(id, value) {
    fn.hats[id] = value;
    return fn;
  };
  fn.bits = bits || 128;
  fn.base = base || 16;
  return fn;
};


/***/ }),

/***/ "../modules/ot-json0/lib/bootstrapTransform.js":
/*!*****************************************************!*\
  !*** ../modules/ot-json0/lib/bootstrapTransform.js ***!
  \*****************************************************/
/***/ ((module) => {

function bootstrapTransform(type, transformComponent, checkValidOp, append) {
  var transformComponentX = function(left, right, destLeft, destRight) {
    transformComponent(destLeft, left, right, "left");
    transformComponent(destRight, right, left, "right");
  };
  var transformX = type.transformX = function(leftOp, rightOp) {
    checkValidOp(leftOp);
    checkValidOp(rightOp);
    var newRightOp = [];
    for (var i = 0; i < rightOp.length; i++) {
      var rightComponent = rightOp[i];
      var newLeftOp = [];
      var k = 0;
      while (k < leftOp.length) {
        var nextC = [];
        transformComponentX(leftOp[k], rightComponent, newLeftOp, nextC);
        k++;
        if (nextC.length === 1) {
          rightComponent = nextC[0];
        } else if (nextC.length === 0) {
          for (var j = k; j < leftOp.length; j++) {
            append(newLeftOp, leftOp[j]);
          }
          rightComponent = null;
          break;
        } else {
          var pair = transformX(leftOp.slice(k), nextC);
          for (var l = 0; l < pair[0].length; l++) {
            append(newLeftOp, pair[0][l]);
          }
          for (var r = 0; r < pair[1].length; r++) {
            append(newRightOp, pair[1][r]);
          }
          rightComponent = null;
          break;
        }
      }
      if (rightComponent != null) {
        append(newRightOp, rightComponent);
      }
      leftOp = newLeftOp;
    }
    return [leftOp, newRightOp];
  };
  type.transform = function(op, otherOp, type2) {
    if (!(type2 === "left" || type2 === "right"))
      throw new Error("type must be 'left' or 'right'");
    if (otherOp.length === 0)
      return op;
    if (op.length === 1 && otherOp.length === 1)
      return transformComponent([], op[0], otherOp[0], type2);
    if (type2 === "left")
      return transformX(op, otherOp)[0];
    else
      return transformX(otherOp, op)[1];
  };
}
;
module.exports = bootstrapTransform;


/***/ }),

/***/ "../modules/ot-json0/lib/index.js":
/*!****************************************!*\
  !*** ../modules/ot-json0/lib/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  type: __webpack_require__(/*! ./json0 */ "../modules/ot-json0/lib/json0.js")
};


/***/ }),

/***/ "../modules/ot-json0/lib/json0.js":
/*!****************************************!*\
  !*** ../modules/ot-json0/lib/json0.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = function(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
};
var isObject = function(obj) {
  return !!obj && obj.constructor === Object;
};
var clone = function(o) {
  return JSON.parse(JSON.stringify(o));
};
var json = {
  name: "json0",
  uri: "http://sharejs.org/types/JSONv0"
};
var subtypes = {};
json.registerSubtype = function(subtype) {
  subtypes[subtype.name] = subtype;
};
json.create = function(data) {
  return data === void 0 ? null : clone(data);
};
json.invertComponent = function(c) {
  var c_ = { p: c.p };
  if (c.t && subtypes[c.t]) {
    c_.t = c.t;
    c_.o = subtypes[c.t].invert(c.o);
  }
  if (c.si !== void 0)
    c_.sd = c.si;
  if (c.sd !== void 0)
    c_.si = c.sd;
  if (c.oi !== void 0)
    c_.od = c.oi;
  if (c.od !== void 0)
    c_.oi = c.od;
  if (c.li !== void 0)
    c_.ld = c.li;
  if (c.ld !== void 0)
    c_.li = c.ld;
  if (c.na !== void 0)
    c_.na = -c.na;
  if (c.lm !== void 0) {
    c_.lm = c.p[c.p.length - 1];
    c_.p = c.p.slice(0, c.p.length - 1).concat([c.lm]);
  }
  return c_;
};
json.invert = function(op) {
  var op_ = op.slice().reverse();
  var iop = [];
  for (var i = 0; i < op_.length; i++) {
    iop.push(json.invertComponent(op_[i]));
  }
  return iop;
};
json.checkValidOp = function(op) {
  for (var i = 0; i < op.length; i++) {
    if (!isArray(op[i].p))
      throw new Error("Missing path");
  }
};
json.checkList = function(elem) {
  if (!isArray(elem))
    throw new Error("Referenced element not a list");
};
json.checkObj = function(elem) {
  if (!isObject(elem)) {
    throw new Error("Referenced element not an object (it was " + JSON.stringify(elem) + ")");
  }
};
function convertFromText(c) {
  c.t = "text0";
  var o = {
    p: c.p.pop()
  };
  if (c.si != null) {
    o.i = c.si;
  }
  if (c.sd != null) {
    o.d = c.sd;
  }
  c.o = [o];
}
function convertToText(c) {
  c.p.push(c.o[0].p);
  if (c.o[0].i != null) {
    c.si = c.o[0].i;
  }
  if (c.o[0].d != null) {
    c.sd = c.o[0].d;
  }
  delete c.t;
  delete c.o;
}
json.apply = function(snapshot, op) {
  console.log("snapshot=======", snapshot);
  console.log("op=======", op);
  json.checkValidOp(op);
  op = clone(op);
  var container = {
    data: snapshot
  };
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.si != null || c.sd != null)
      convertFromText(c);
    var parent = null;
    var parentKey = null;
    var elem = container;
    var key = "data";
    for (var j = 0; j < c.p.length; j++) {
      var p = c.p[j];
      parent = elem;
      parentKey = key;
      elem = elem[key];
      key = p;
      if (parent == null) {
        throw new Error("Path invalid");
      }
    }
    if (c.t && c.o !== void 0 && subtypes[c.t]) {
      elem[key] = subtypes[c.t].apply(elem[key], c.o);
    } else if (c.na !== void 0) {
      if (typeof elem[key] != "number") {
        throw new Error("Referenced element not a number");
      }
      elem[key] += c.na;
    } else if (c.li !== void 0 && c.ld !== void 0) {
      json.checkList(elem);
      elem[key] = c.li;
    } else if (c.li !== void 0) {
      json.checkList(elem);
      elem.splice(key, 0, c.li);
    } else if (c.ld !== void 0) {
      json.checkList(elem);
      elem.splice(key, 1);
    } else if (c.lm !== void 0) {
      json.checkList(elem);
      if (c.lm != key) {
        var e = elem[key];
        elem.splice(key, 1);
        elem.splice(c.lm, 0, e);
      }
    } else if (c.oi !== void 0) {
      json.checkObj(elem);
      elem[key] = c.oi;
    } else if (c.od !== void 0) {
      json.checkObj(elem);
      delete elem[key];
    } else {
      throw new Error("invalid / missing instruction in op");
    }
  }
  return container.data;
};
json.shatter = function(op) {
  var results = [];
  for (var i = 0; i < op.length; i++) {
    results.push([op[i]]);
  }
  return results;
};
json.incrementalApply = function(snapshot, op, _yield) {
  for (var i = 0; i < op.length; i++) {
    var smallOp = [op[i]];
    snapshot = json.apply(snapshot, smallOp);
    _yield(smallOp, snapshot);
  }
  return snapshot;
};
var pathMatches = json.pathMatches = function(p1, p2, ignoreLast) {
  if (p1.length != p2.length)
    return false;
  for (var i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i] && (!ignoreLast || i !== p1.length - 1))
      return false;
  }
  return true;
};
json.append = function(dest, c) {
  console.log("c=", c);
  c = clone(c);
  if (dest.length === 0) {
    dest.push(c);
    return;
  }
  var last = dest[dest.length - 1];
  if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
    convertFromText(c);
    convertFromText(last);
  }
  if (pathMatches(c.p, last.p)) {
    if (c.t && last.t && c.t === last.t && subtypes[c.t]) {
      last.o = subtypes[c.t].compose(last.o, c.o);
      if (c.si != null || c.sd != null) {
        var p = c.p;
        for (var i = 0; i < last.o.length - 1; i++) {
          c.o = [last.o.pop()];
          c.p = p.slice();
          convertToText(c);
          dest.push(c);
        }
        convertToText(last);
      }
    } else if (last.na != null && c.na != null) {
      dest[dest.length - 1] = { p: last.p, na: last.na + c.na };
    } else if (last.li !== void 0 && c.li === void 0 && c.ld === last.li) {
      if (last.ld !== void 0) {
        delete last.li;
      } else {
        dest.pop();
      }
    } else if (last.od !== void 0 && last.oi === void 0 && c.oi !== void 0 && c.od === void 0) {
      last.oi = c.oi;
    } else if (last.oi !== void 0 && c.od !== void 0) {
      if (c.oi !== void 0) {
        last.oi = c.oi;
      } else if (last.od !== void 0) {
        delete last.oi;
      } else {
        dest.pop();
      }
    } else if (c.lm !== void 0 && c.p[c.p.length - 1] === c.lm) {
    } else {
      dest.push(c);
    }
  } else {
    if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
      convertToText(c);
      convertToText(last);
    }
    dest.push(c);
  }
};
json.compose = function(op1, op2) {
  json.checkValidOp(op1);
  json.checkValidOp(op2);
  var newOp = clone(op1);
  for (var i = 0; i < op2.length; i++) {
    json.append(newOp, op2[i]);
  }
  return newOp;
};
json.normalize = function(op) {
  console.log("normalize=", op);
  var newOp = [];
  op = isArray(op) ? op : [op];
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.p == null) {
      c.p = [];
    }
    json.append(newOp, c);
  }
  return newOp;
};
json.commonLengthForOps = function(a, b) {
  var alen = a.p.length;
  var blen = b.p.length;
  if (a.na != null || a.t)
    alen++;
  if (b.na != null || b.t)
    blen++;
  if (alen === 0) {
    return -1;
  }
  if (blen === 0) {
    return null;
  }
  alen--;
  blen--;
  for (var i = 0; i < alen; i++) {
    var p = a.p[i];
    if (i >= blen || p !== b.p[i]) {
      return null;
    }
  }
  return alen;
};
json.canOpAffectPath = function(op, path) {
  return json.commonLengthForOps({ p: path }, op) != null;
};
json.transformComponent = function(dest, c, otherC, type) {
  c = clone(c);
  var common = json.commonLengthForOps(otherC, c);
  var common2 = json.commonLengthForOps(c, otherC);
  var cplength = c.p.length;
  var otherCplength = otherC.p.length;
  if (c.na != null || c.t) {
    cplength++;
  }
  if (otherC.na != null || otherC.t) {
    otherCplength++;
  }
  if (common2 != null && otherCplength > cplength && c.p[common2] == otherC.p[common2]) {
    if (c.ld !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.ld = json.apply(clone(c.ld), [oc]);
    } else if (c.od !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.od = json.apply(clone(c.od), [oc]);
    }
  }
  if (common != null) {
    var commonOperand = cplength == otherCplength;
    var oc = otherC;
    if ((c.si != null || c.sd != null) && (otherC.si != null || otherC.sd != null)) {
      convertFromText(c);
      oc = clone(otherC);
      convertFromText(oc);
    }
    if (oc.t && subtypes[oc.t]) {
      if (c.t && c.t === oc.t) {
        var res = subtypes[c.t].transform(c.o, oc.o, type);
        if (c.si != null || c.sd != null) {
          var p = c.p;
          for (var i = 0; i < res.length; i++) {
            c.o = [res[i]];
            c.p = p.slice();
            convertToText(c);
            json.append(dest, c);
          }
        } else if (!isArray(res) || res.length > 0) {
          c.o = res;
          json.append(dest, c);
        }
        return dest;
      }
    } else if (otherC.na !== void 0) {
    } else if (otherC.li !== void 0 && otherC.ld !== void 0) {
      if (otherC.p[common] === c.p[common]) {
        if (!commonOperand) {
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0 && type === "left") {
            c.ld = clone(otherC.li);
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.li !== void 0) {
      if (c.li !== void 0 && c.ld === void 0 && commonOperand && c.p[common] === otherC.p[common]) {
        if (type === "right")
          c.p[common]++;
      } else if (otherC.p[common] <= c.p[common]) {
        c.p[common]++;
      }
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] <= c.lm)
            c.lm++;
        }
      }
    } else if (otherC.ld !== void 0) {
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] === c.p[common]) {
            return dest;
          }
          var p = otherC.p[common];
          var from = c.p[common];
          var to = c.lm;
          if (p < to || p === to && from < to) {
            c.lm--;
          }
        }
      }
      if (otherC.p[common] < c.p[common]) {
        c.p[common]--;
      } else if (otherC.p[common] === c.p[common]) {
        if (otherCplength < cplength) {
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0) {
            delete c.ld;
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.lm !== void 0) {
      if (c.lm !== void 0 && cplength === otherCplength) {
        var from = c.p[common];
        var to = c.lm;
        var otherFrom = otherC.p[common];
        var otherTo = otherC.lm;
        if (otherFrom !== otherTo) {
          if (from === otherFrom) {
            if (type === "left") {
              c.p[common] = otherTo;
              if (from === to)
                c.lm = otherTo;
            } else {
              return dest;
            }
          } else {
            if (from > otherFrom)
              c.p[common]--;
            if (from > otherTo)
              c.p[common]++;
            else if (from === otherTo) {
              if (otherFrom > otherTo) {
                c.p[common]++;
                if (from === to)
                  c.lm++;
              }
            }
            if (to > otherFrom) {
              c.lm--;
            } else if (to === otherFrom) {
              if (to > from)
                c.lm--;
            }
            if (to > otherTo) {
              c.lm++;
            } else if (to === otherTo) {
              if (otherTo > otherFrom && to > from || otherTo < otherFrom && to < from) {
                if (type === "right")
                  c.lm++;
              } else {
                if (to > from)
                  c.lm++;
                else if (to === otherFrom)
                  c.lm--;
              }
            }
          }
        }
      } else if (c.li !== void 0 && c.ld === void 0 && commonOperand) {
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p > from)
          c.p[common]--;
        if (p > to)
          c.p[common]++;
      } else {
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p === from) {
          c.p[common] = to;
        } else {
          if (p > from)
            c.p[common]--;
          if (p > to)
            c.p[common]++;
          else if (p === to && from > to)
            c.p[common]++;
        }
      }
    } else if (otherC.oi !== void 0 && otherC.od !== void 0) {
      if (c.p[common] === otherC.p[common]) {
        if (c.oi !== void 0 && commonOperand) {
          if (type === "right") {
            return dest;
          } else {
            c.od = otherC.oi;
          }
        } else {
          return dest;
        }
      }
    } else if (otherC.oi !== void 0) {
      if (c.oi !== void 0 && c.p[common] === otherC.p[common]) {
        if (type === "left") {
          json.append(dest, { p: c.p, od: otherC.oi });
        } else {
          return dest;
        }
      }
    } else if (otherC.od !== void 0) {
      if (c.p[common] == otherC.p[common]) {
        if (!commonOperand)
          return dest;
        if (c.oi !== void 0) {
          delete c.od;
        } else {
          return dest;
        }
      }
    }
  }
  json.append(dest, c);
  return dest;
};
__webpack_require__(/*! ./bootstrapTransform */ "../modules/ot-json0/lib/bootstrapTransform.js")(json, json.transformComponent, json.checkValidOp, json.append);
var text = __webpack_require__(/*! ./text0 */ "../modules/ot-json0/lib/text0.js");
json.registerSubtype(text);
module.exports = json;


/***/ }),

/***/ "../modules/ot-json0/lib/text0.js":
/*!****************************************!*\
  !*** ../modules/ot-json0/lib/text0.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var text = module.exports = {
  name: "text0",
  uri: "http://sharejs.org/types/textv0",
  create: function(initial) {
    if (initial != null && typeof initial !== "string") {
      throw new Error("Initial data must be a string");
    }
    return initial || "";
  }
};
var strInject = function(s1, pos, s2) {
  return s1.slice(0, pos) + s2 + s1.slice(pos);
};
var checkValidComponent = function(c) {
  if (typeof c.p !== "number")
    throw new Error("component missing position field");
  if (typeof c.i === "string" === (typeof c.d === "string"))
    throw new Error("component needs an i or d field");
  if (c.p < 0)
    throw new Error("position cannot be negative");
};
var checkValidOp = function(op) {
  for (var i = 0; i < op.length; i++) {
    checkValidComponent(op[i]);
  }
};
text.apply = function(snapshot, op) {
  var deleted;
  checkValidOp(op);
  for (var i = 0; i < op.length; i++) {
    var component = op[i];
    if (component.i != null) {
      snapshot = strInject(snapshot, component.p, component.i);
    } else {
      deleted = snapshot.slice(component.p, component.p + component.d.length);
      if (component.d !== deleted)
        throw new Error("Delete component '" + component.d + "' does not match deleted text '" + deleted + "'");
      snapshot = snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
    }
  }
  return snapshot;
};
var append = text._append = function(newOp, c) {
  if (c.i === "" || c.d === "")
    return;
  if (newOp.length === 0) {
    newOp.push(c);
  } else {
    var last = newOp[newOp.length - 1];
    if (last.i != null && c.i != null && last.p <= c.p && c.p <= last.p + last.i.length) {
      newOp[newOp.length - 1] = {
        i: strInject(last.i, c.p - last.p, c.i),
        p: last.p
      };
    } else if (last.d != null && c.d != null && c.p <= last.p && last.p <= c.p + c.d.length) {
      newOp[newOp.length - 1] = {
        d: strInject(c.d, last.p - c.p, last.d),
        p: c.p
      };
    } else {
      newOp.push(c);
    }
  }
};
text.compose = function(op1, op2) {
  checkValidOp(op1);
  checkValidOp(op2);
  var newOp = op1.slice();
  for (var i = 0; i < op2.length; i++) {
    append(newOp, op2[i]);
  }
  return newOp;
};
text.normalize = function(op) {
  var newOp = [];
  if (op.i != null || op.p != null)
    op = [op];
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.p == null)
      c.p = 0;
    append(newOp, c);
  }
  return newOp;
};
var transformPosition = function(pos, c, insertAfter) {
  if (c.i != null) {
    if (c.p < pos || c.p === pos && insertAfter) {
      return pos + c.i.length;
    } else {
      return pos;
    }
  } else {
    if (pos <= c.p) {
      return pos;
    } else if (pos <= c.p + c.d.length) {
      return c.p;
    } else {
      return pos - c.d.length;
    }
  }
};
text.transformCursor = function(position, op, side) {
  var insertAfter = side === "right";
  for (var i = 0; i < op.length; i++) {
    position = transformPosition(position, op[i], insertAfter);
  }
  return position;
};
var transformComponent = text._tc = function(dest, c, otherC, side) {
  checkValidComponent(c);
  checkValidComponent(otherC);
  if (c.i != null) {
    append(dest, {
      i: c.i,
      p: transformPosition(c.p, otherC, side === "right")
    });
  } else {
    if (otherC.i != null) {
      var s = c.d;
      if (c.p < otherC.p) {
        append(dest, { d: s.slice(0, otherC.p - c.p), p: c.p });
        s = s.slice(otherC.p - c.p);
      }
      if (s !== "")
        append(dest, { d: s, p: c.p + otherC.i.length });
    } else {
      if (c.p >= otherC.p + otherC.d.length)
        append(dest, { d: c.d, p: c.p - otherC.d.length });
      else if (c.p + c.d.length <= otherC.p)
        append(dest, c);
      else {
        var newC = { d: "", p: c.p };
        if (c.p < otherC.p)
          newC.d = c.d.slice(0, otherC.p - c.p);
        if (c.p + c.d.length > otherC.p + otherC.d.length)
          newC.d += c.d.slice(otherC.p + otherC.d.length - c.p);
        var intersectStart = Math.max(c.p, otherC.p);
        var intersectEnd = Math.min(c.p + c.d.length, otherC.p + otherC.d.length);
        var cIntersect = c.d.slice(intersectStart - c.p, intersectEnd - c.p);
        var otherIntersect = otherC.d.slice(intersectStart - otherC.p, intersectEnd - otherC.p);
        if (cIntersect !== otherIntersect)
          throw new Error("Delete ops delete different text in the same region of the document");
        if (newC.d !== "") {
          newC.p = transformPosition(newC.p, otherC);
          append(dest, newC);
        }
      }
    }
  }
  return dest;
};
var invertComponent = function(c) {
  return c.i != null ? { d: c.i, p: c.p } : { i: c.d, p: c.p };
};
text.invert = function(op) {
  op = op.slice().reverse();
  for (var i = 0; i < op.length; i++) {
    op[i] = invertComponent(op[i]);
  }
  return op;
};
__webpack_require__(/*! ./bootstrapTransform */ "../modules/ot-json0/lib/bootstrapTransform.js")(text, transformComponent, checkValidOp, append);


/***/ }),

/***/ "../modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js":
/*!****************************************************************************!*\
  !*** ../modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (b2.hasOwnProperty(p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
  if (m)
    return m.call(o);
  return {
    next: function() {
      if (o && i >= o.length)
        o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
var Event = function() {
  function Event2(type, target) {
    this.target = target;
    this.type = type;
  }
  return Event2;
}();
var ErrorEvent = function(_super) {
  __extends(ErrorEvent2, _super);
  function ErrorEvent2(error, target) {
    var _this = _super.call(this, "error", target) || this;
    _this.message = error.message;
    _this.error = error;
    return _this;
  }
  return ErrorEvent2;
}(Event);
var CloseEvent = function(_super) {
  __extends(CloseEvent2, _super);
  function CloseEvent2(code, reason, target) {
    if (code === void 0) {
      code = 1e3;
    }
    if (reason === void 0) {
      reason = "";
    }
    var _this = _super.call(this, "close", target) || this;
    _this.wasClean = true;
    _this.code = code;
    _this.reason = reason;
    return _this;
  }
  return CloseEvent2;
}(Event);
/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
var getGlobalWebSocket = function() {
  if (typeof WebSocket !== "undefined") {
    return WebSocket;
  }
};
var isWebSocket = function(w) {
  return typeof w !== "undefined" && !!w && w.CLOSING === 2;
};
var DEFAULT = {
  maxReconnectionDelay: 1e4,
  minReconnectionDelay: 1e3 + Math.random() * 4e3,
  minUptime: 5e3,
  reconnectionDelayGrowFactor: 1.3,
  connectionTimeout: 4e3,
  maxRetries: Infinity,
  maxEnqueuedMessages: Infinity,
  startClosed: false,
  debug: false
};
var ReconnectingWebSocket = function() {
  function ReconnectingWebSocket2(url, protocols, options) {
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    this._listeners = {
      error: [],
      message: [],
      open: [],
      close: []
    };
    this._retryCount = -1;
    this._shouldReconnect = true;
    this._connectLock = false;
    this._binaryType = "blob";
    this._closeCalled = false;
    this._messageQueue = [];
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    this.onopen = null;
    this._handleOpen = function(event) {
      _this._debug("open event");
      var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
      clearTimeout(_this._connectTimeout);
      _this._uptimeTimeout = setTimeout(function() {
        return _this._acceptOpen();
      }, minUptime);
      _this._ws.binaryType = _this._binaryType;
      _this._messageQueue.forEach(function(message) {
        return _this._ws.send(message);
      });
      _this._messageQueue = [];
      if (_this.onopen) {
        _this.onopen(event);
      }
      _this._listeners.open.forEach(function(listener) {
        return _this._callEventListener(event, listener);
      });
    };
    this._handleMessage = function(event) {
      _this._debug("message event");
      if (_this.onmessage) {
        _this.onmessage(event);
      }
      _this._listeners.message.forEach(function(listener) {
        return _this._callEventListener(event, listener);
      });
    };
    this._handleError = function(event) {
      _this._debug("error event", event.message);
      _this._disconnect(void 0, event.message === "TIMEOUT" ? "timeout" : void 0);
      if (_this.onerror) {
        _this.onerror(event);
      }
      _this._debug("exec error listeners");
      _this._listeners.error.forEach(function(listener) {
        return _this._callEventListener(event, listener);
      });
      _this._connect();
    };
    this._handleClose = function(event) {
      _this._debug("close event");
      _this._clearTimeouts();
      if (_this._shouldReconnect) {
        _this._connect();
      }
      if (_this.onclose) {
        _this.onclose(event);
      }
      _this._listeners.close.forEach(function(listener) {
        return _this._callEventListener(event, listener);
      });
    };
    this._url = url;
    this._protocols = protocols;
    this._options = options;
    if (this._options.startClosed) {
      this._shouldReconnect = false;
    }
    this._connect();
  }
  Object.defineProperty(ReconnectingWebSocket2, "CONNECTING", {
    get: function() {
      return 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2, "OPEN", {
    get: function() {
      return 1;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2, "CLOSING", {
    get: function() {
      return 2;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2, "CLOSED", {
    get: function() {
      return 3;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "CONNECTING", {
    get: function() {
      return ReconnectingWebSocket2.CONNECTING;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "OPEN", {
    get: function() {
      return ReconnectingWebSocket2.OPEN;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "CLOSING", {
    get: function() {
      return ReconnectingWebSocket2.CLOSING;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "CLOSED", {
    get: function() {
      return ReconnectingWebSocket2.CLOSED;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "binaryType", {
    get: function() {
      return this._ws ? this._ws.binaryType : this._binaryType;
    },
    set: function(value) {
      this._binaryType = value;
      if (this._ws) {
        this._ws.binaryType = value;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "retryCount", {
    get: function() {
      return Math.max(this._retryCount, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "bufferedAmount", {
    get: function() {
      var bytes = this._messageQueue.reduce(function(acc, message) {
        if (typeof message === "string") {
          acc += message.length;
        } else if (message instanceof Blob) {
          acc += message.size;
        } else {
          acc += message.byteLength;
        }
        return acc;
      }, 0);
      return bytes + (this._ws ? this._ws.bufferedAmount : 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "extensions", {
    get: function() {
      return this._ws ? this._ws.extensions : "";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "protocol", {
    get: function() {
      return this._ws ? this._ws.protocol : "";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "readyState", {
    get: function() {
      if (this._ws) {
        return this._ws.readyState;
      }
      return this._options.startClosed ? ReconnectingWebSocket2.CLOSED : ReconnectingWebSocket2.CONNECTING;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ReconnectingWebSocket2.prototype, "url", {
    get: function() {
      return this._ws ? this._ws.url : "";
    },
    enumerable: true,
    configurable: true
  });
  ReconnectingWebSocket2.prototype.close = function(code, reason) {
    if (code === void 0) {
      code = 1e3;
    }
    this._closeCalled = true;
    this._shouldReconnect = false;
    this._clearTimeouts();
    if (!this._ws) {
      this._debug("close enqueued: no ws instance");
      return;
    }
    if (this._ws.readyState === this.CLOSED) {
      this._debug("close: already closed");
      return;
    }
    this._ws.close(code, reason);
  };
  ReconnectingWebSocket2.prototype.reconnect = function(code, reason) {
    this._shouldReconnect = true;
    this._closeCalled = false;
    this._retryCount = -1;
    if (!this._ws || this._ws.readyState === this.CLOSED) {
      this._connect();
    } else {
      this._disconnect(code, reason);
      this._connect();
    }
  };
  ReconnectingWebSocket2.prototype.send = function(data) {
    if (this._ws && this._ws.readyState === this.OPEN) {
      this._debug("send", data);
      this._ws.send(data);
    } else {
      var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
      if (this._messageQueue.length < maxEnqueuedMessages) {
        this._debug("enqueue", data);
        this._messageQueue.push(data);
      }
    }
  };
  ReconnectingWebSocket2.prototype.addEventListener = function(type, listener) {
    if (this._listeners[type]) {
      this._listeners[type].push(listener);
    }
  };
  ReconnectingWebSocket2.prototype.dispatchEvent = function(event) {
    var e_1, _a;
    var listeners = this._listeners[event.type];
    if (listeners) {
      try {
        for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
          var listener = listeners_1_1.value;
          this._callEventListener(event, listener);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return))
            _a.call(listeners_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
    }
    return true;
  };
  ReconnectingWebSocket2.prototype.removeEventListener = function(type, listener) {
    if (this._listeners[type]) {
      this._listeners[type] = this._listeners[type].filter(function(l) {
        return l !== listener;
      });
    }
  };
  ReconnectingWebSocket2.prototype._debug = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (this._options.debug) {
      console.log.apply(console, __spread(["RWS>"], args));
    }
  };
  ReconnectingWebSocket2.prototype._getNextDelay = function() {
    var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
    var delay = 0;
    if (this._retryCount > 0) {
      delay = minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
      if (delay > maxReconnectionDelay) {
        delay = maxReconnectionDelay;
      }
    }
    this._debug("next delay", delay);
    return delay;
  };
  ReconnectingWebSocket2.prototype._wait = function() {
    var _this = this;
    return new Promise(function(resolve) {
      setTimeout(resolve, _this._getNextDelay());
    });
  };
  ReconnectingWebSocket2.prototype._getNextUrl = function(urlProvider) {
    if (typeof urlProvider === "string") {
      return Promise.resolve(urlProvider);
    }
    if (typeof urlProvider === "function") {
      var url = urlProvider();
      if (typeof url === "string") {
        return Promise.resolve(url);
      }
      if (!!url.then) {
        return url;
      }
    }
    throw Error("Invalid URL");
  };
  ReconnectingWebSocket2.prototype._connect = function() {
    var _this = this;
    if (this._connectLock || !this._shouldReconnect) {
      return;
    }
    this._connectLock = true;
    var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket2 = _d === void 0 ? getGlobalWebSocket() : _d;
    if (this._retryCount >= maxRetries) {
      this._debug("max retries reached", this._retryCount, ">=", maxRetries);
      return;
    }
    this._retryCount++;
    this._debug("connect", this._retryCount);
    this._removeListeners();
    if (!isWebSocket(WebSocket2)) {
      throw Error("No valid WebSocket class provided");
    }
    this._wait().then(function() {
      return _this._getNextUrl(_this._url);
    }).then(function(url) {
      if (_this._closeCalled) {
        return;
      }
      _this._debug("connect", { url, protocols: _this._protocols });
      _this._ws = _this._protocols ? new WebSocket2(url, _this._protocols) : new WebSocket2(url);
      _this._ws.binaryType = _this._binaryType;
      _this._connectLock = false;
      _this._addListeners();
      _this._connectTimeout = setTimeout(function() {
        return _this._handleTimeout();
      }, connectionTimeout);
    });
  };
  ReconnectingWebSocket2.prototype._handleTimeout = function() {
    this._debug("timeout event");
    this._handleError(new ErrorEvent(Error("TIMEOUT"), this));
  };
  ReconnectingWebSocket2.prototype._disconnect = function(code, reason) {
    if (code === void 0) {
      code = 1e3;
    }
    this._clearTimeouts();
    if (!this._ws) {
      return;
    }
    this._removeListeners();
    try {
      this._ws.close(code, reason);
      this._handleClose(new CloseEvent(code, reason, this));
    } catch (error) {
    }
  };
  ReconnectingWebSocket2.prototype._acceptOpen = function() {
    this._debug("accept open");
    this._retryCount = 0;
  };
  ReconnectingWebSocket2.prototype._callEventListener = function(event, listener) {
    if ("handleEvent" in listener) {
      listener.handleEvent(event);
    } else {
      listener(event);
    }
  };
  ReconnectingWebSocket2.prototype._removeListeners = function() {
    if (!this._ws) {
      return;
    }
    this._debug("removeListeners");
    this._ws.removeEventListener("open", this._handleOpen);
    this._ws.removeEventListener("close", this._handleClose);
    this._ws.removeEventListener("message", this._handleMessage);
    this._ws.removeEventListener("error", this._handleError);
  };
  ReconnectingWebSocket2.prototype._addListeners = function() {
    if (!this._ws) {
      return;
    }
    this._debug("addListeners");
    this._ws.addEventListener("open", this._handleOpen);
    this._ws.addEventListener("close", this._handleClose);
    this._ws.addEventListener("message", this._handleMessage);
    this._ws.addEventListener("error", this._handleError);
  };
  ReconnectingWebSocket2.prototype._clearTimeouts = function() {
    clearTimeout(this._connectTimeout);
    clearTimeout(this._uptimeTimeout);
  };
  return ReconnectingWebSocket2;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReconnectingWebSocket);


/***/ }),

/***/ "../modules/sharedb-string-binding/index.js":
/*!**************************************************!*\
  !*** ../modules/sharedb-string-binding/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TextDiffBinding = __webpack_require__(/*! ../text-diff-binding */ "../modules/text-diff-binding/index.js");
module.exports = StringBinding;
function StringBinding(element, doc, path) {
  console.log("element=", element);
  console.log("doc=", doc);
  console.log("path=", path);
  TextDiffBinding.call(this, element);
  this.doc = doc;
  this.path = path || [];
  this._opListener = null;
  this._inputListener = null;
}
StringBinding.prototype = Object.create(TextDiffBinding.prototype);
StringBinding.prototype.constructor = StringBinding;
StringBinding.prototype.setup = function() {
  this.update();
  this.attachDoc();
  this.attachElement();
};
StringBinding.prototype.destroy = function() {
  this.detachElement();
  this.detachDoc();
};
StringBinding.prototype.attachElement = function() {
  var binding = this;
  this._inputListener = function() {
    binding.onInput();
  };
  this.element.addEventListener("input", this._inputListener, false);
};
StringBinding.prototype.detachElement = function() {
  this.element.removeEventListener("input", this._inputListener, false);
};
StringBinding.prototype.attachDoc = function() {
  var binding = this;
  this._opListener = function(op, source) {
    binding._onOp(op, source);
  };
  this.doc.on("op", this._opListener);
};
StringBinding.prototype.detachDoc = function() {
  this.doc.removeListener("op", this._opListener);
};
StringBinding.prototype._onOp = function(op, source) {
  console.log("op=", op);
  if (source === this) {
    return;
  }
  if (op.length === 0) {
    return;
  }
  if (op.length > 1) {
    throw new Error("Op with multiple components emitted");
  }
  var component = op[0];
  if (isSubpath(this.path, component.p)) {
    this._parseInsertOp(component);
    this._parseRemoveOp(component);
  } else if (isSubpath(component.p, this.path)) {
    this._parseParentOp();
  }
};
StringBinding.prototype._parseInsertOp = function(component) {
  if (!component.si) {
    return;
  }
  var index = component.p[component.p.length - 1];
  var length = component.si.length;
  this.onInsert(index, length);
};
StringBinding.prototype._parseRemoveOp = function(component) {
  if (!component.sd) {
    return;
  }
  var index = component.p[component.p.length - 1];
  var length = component.sd.length;
  this.onRemove(index, length);
};
StringBinding.prototype._parseParentOp = function() {
  this.update();
};
StringBinding.prototype._get = function() {
  var value = this.doc.data;
  for (var i = 0; i < this.path.length; i++) {
    var segment = this.path[i];
    value = value[segment];
  }
  return value;
};
StringBinding.prototype._insert = function(index, text) {
  console.log("this.path.concat=", this.path.concat);
  console.log("this.path=", this.path);
  console.log("index=", index);
  var path = this.path.concat(index);
  console.log("path=", path);
  var op = { p: path, si: text };
  console.log("op=", op);
  console.log("this.doc.submitOp=", this.doc.submitOp);
  this.doc.submitOp(op, { source: this });
};
StringBinding.prototype._remove = function(index, text) {
  var path = this.path.concat(index);
  var op = { p: path, sd: text };
  console.log("op=", op);
  this.doc.submitOp(op, { source: this });
};
function isSubpath(path, testPath) {
  console.log("path=", path);
  console.log("testPath=", testPath);
  for (var i = 0; i < path.length; i++) {
    if (testPath[i] !== path[i])
      return false;
  }
  return true;
}


/***/ }),

/***/ "../modules/sharedb/lib/client/connection.js":
/*!***************************************************!*\
  !*** ../modules/sharedb/lib/client/connection.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Doc = __webpack_require__(/*! ./doc */ "../modules/sharedb/lib/client/doc.js");
var Query = __webpack_require__(/*! ./query */ "../modules/sharedb/lib/client/query.js");
var Presence = __webpack_require__(/*! ./presence/presence */ "../modules/sharedb/lib/client/presence/presence.js");
var DocPresence = __webpack_require__(/*! ./presence/doc-presence */ "../modules/sharedb/lib/client/presence/doc-presence.js");
var SnapshotVersionRequest = __webpack_require__(/*! ./snapshot-request/snapshot-version-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-version-request.js");
var SnapshotTimestampRequest = __webpack_require__(/*! ./snapshot-request/snapshot-timestamp-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-timestamp-request.js");
var emitter = __webpack_require__(/*! ../emitter */ "../modules/sharedb/lib/emitter.js");
var ShareDBError = __webpack_require__(/*! ../error */ "../modules/sharedb/lib/error.js");
var types = __webpack_require__(/*! ../types */ "../modules/sharedb/lib/types.js");
var util = __webpack_require__(/*! ../util */ "../modules/sharedb/lib/util.js");
var logger = __webpack_require__(/*! ../logger */ "../modules/sharedb/lib/logger/index.js");
var ERROR_CODE = ShareDBError.CODES;
function connectionState(socket) {
  if (socket.readyState === 0 || socket.readyState === 1)
    return "connecting";
  return "disconnected";
}
module.exports = Connection;
function Connection(socket) {
  emitter.EventEmitter.call(this);
  this.collections = {};
  this.nextQueryId = 1;
  this.nextSnapshotRequestId = 1;
  this.queries = {};
  this._presences = {};
  this._snapshotRequests = {};
  this.seq = 1;
  this._presenceSeq = 1;
  this.id = null;
  this.agent = null;
  this.debug = false;
  this.state = connectionState(socket);
  this.bindToSocket(socket);
}
emitter.mixin(Connection);
Connection.prototype.bindToSocket = function(socket) {
  if (this.socket) {
    this.socket.close();
    this.socket.onmessage = null;
    this.socket.onopen = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
  }
  this.socket = socket;
  var newState = connectionState(socket);
  this._setState(newState);
  this.canSend = false;
  var connection = this;
  socket.onmessage = function(event) {
    try {
      var data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch (err) {
      logger.warn("Failed to parse message", event);
      return;
    }
    if (connection.debug) {
      logger.info("RECV", JSON.stringify(data));
    }
    var request = { data };
    connection.emit("receive", request);
    if (!request.data)
      return;
    try {
      console.log("\u63A5\u6536\u5230\u540E\u53F0\u670D\u52A1\u5668\u6D88\u606F:", request.data);
      connection.handleMessage(request.data);
    } catch (err) {
      util.nextTick(function() {
        connection.emit("error", err);
      });
    }
  };
  if (socket.readyState === 1) {
    debugger;
    connection._initializeHandshake();
  }
  socket.onopen = function() {
    connection._setState("connecting");
    connection._initializeHandshake();
  };
  socket.onerror = function(err) {
    connection.emit("connection error", err);
  };
  socket.onclose = function(reason) {
    if (reason === "closed" || reason === "Closed") {
      connection._setState("closed", reason);
    } else if (reason === "stopped" || reason === "Stopped by server") {
      connection._setState("stopped", reason);
    } else {
      connection._setState("disconnected", reason);
    }
  };
};
Connection.prototype.handleMessage = function(message) {
  var err = null;
  if (message.error) {
    err = wrapErrorData(message.error, message);
    delete message.error;
  }
  switch (message.a) {
    case "init":
      return this._handleLegacyInit(message);
    case "hs":
      return this._handleHandshake(err, message);
    case "qf":
      var query = this.queries[message.id];
      if (query)
        query._handleFetch(err, message.data, message.extra);
      return;
    case "qs":
      var query = this.queries[message.id];
      if (query)
        query._handleSubscribe(err, message.data, message.extra);
      return;
    case "qu":
      return;
    case "q":
      var query = this.queries[message.id];
      if (!query)
        return;
      if (err)
        return query._handleError(err);
      if (message.diff)
        query._handleDiff(message.diff);
      if (message.hasOwnProperty("extra"))
        query._handleExtra(message.extra);
      return;
    case "bf":
      return this._handleBulkMessage(err, message, "_handleFetch");
    case "bs":
    case "bu":
      return this._handleBulkMessage(err, message, "_handleSubscribe");
    case "nf":
    case "nt":
      return this._handleSnapshotFetch(err, message);
    case "f":
      var doc = this.getExisting(message.c, message.d);
      if (doc)
        doc._handleFetch(err, message.data);
      return;
    case "s":
    case "u":
      var doc = this.getExisting(message.c, message.d);
      if (doc)
        doc._handleSubscribe(err, message.data);
      return;
    case "op":
      var doc = this.getExisting(message.c, message.d);
      if (doc)
        doc._handleOp(err, message);
      return;
    case "p":
      return this._handlePresence(err, message);
    case "ps":
      return this._handlePresenceSubscribe(err, message);
    case "pu":
      return this._handlePresenceUnsubscribe(err, message);
    case "pr":
      return this._handlePresenceRequest(err, message);
    default:
      logger.warn("Ignoring unrecognized message", message);
  }
};
function wrapErrorData(errorData, fullMessage) {
  var err = new Error(errorData.message);
  err.code = errorData.code;
  if (fullMessage) {
    err.data = fullMessage;
  }
  return err;
}
Connection.prototype._handleBulkMessage = function(err, message, method) {
  if (message.data) {
    for (var id in message.data) {
      var dataForId = message.data[id];
      var doc = this.getExisting(message.c, id);
      if (doc) {
        if (err) {
          doc[method](err);
        } else if (dataForId.error) {
          doc[method](wrapErrorData(dataForId.error));
        } else {
          doc[method](null, dataForId);
        }
      }
    }
  } else if (Array.isArray(message.b)) {
    for (var i = 0; i < message.b.length; i++) {
      var id = message.b[i];
      var doc = this.getExisting(message.c, id);
      if (doc)
        doc[method](err);
    }
  } else if (message.b) {
    for (var id in message.b) {
      var doc = this.getExisting(message.c, id);
      if (doc)
        doc[method](err);
    }
  } else {
    logger.error("Invalid bulk message", message);
  }
};
Connection.prototype._reset = function() {
  this.agent = null;
};
Connection.prototype._setState = function(newState, reason) {
  if (this.state === newState)
    return;
  if (newState === "connecting" && this.state !== "disconnected" && this.state !== "stopped" && this.state !== "closed" || newState === "connected" && this.state !== "connecting") {
    var err = new ShareDBError(ERROR_CODE.ERR_CONNECTION_STATE_TRANSITION_INVALID, "Cannot transition directly from " + this.state + " to " + newState);
    return this.emit("error", err);
  }
  this.state = newState;
  this.canSend = newState === "connected";
  if (newState === "disconnected" || newState === "stopped" || newState === "closed") {
    this._reset();
  }
  this.startBulk();
  for (var id in this.queries) {
    var query = this.queries[id];
    query._onConnectionStateChanged();
  }
  for (var collection in this.collections) {
    var docs = this.collections[collection];
    for (var id in docs) {
      docs[id]._onConnectionStateChanged();
    }
  }
  for (var channel in this._presences) {
    this._presences[channel]._onConnectionStateChanged();
  }
  for (var id in this._snapshotRequests) {
    var snapshotRequest = this._snapshotRequests[id];
    snapshotRequest._onConnectionStateChanged();
  }
  this.endBulk();
  this.emit(newState, reason);
  this.emit("state", newState, reason);
};
Connection.prototype.startBulk = function() {
  if (!this.bulk) {
    this.bulk = {};
  }
};
Connection.prototype.endBulk = function() {
  debugger;
  if (this.bulk) {
    for (var collection in this.bulk) {
      var actions = this.bulk[collection];
      this._sendBulk("f", collection, actions.f);
      debugger;
      this._sendBulk("s", collection, actions.s);
      this._sendBulk("u", collection, actions.u);
    }
  }
  this.bulk = null;
};
Connection.prototype._sendBulk = function(action, collection, values) {
  if (!values)
    return;
  var ids = [];
  var versions = {};
  var versionsCount = 0;
  var versionId;
  for (var id in values) {
    var value = values[id];
    if (value == null) {
      ids.push(id);
    } else {
      versions[id] = value;
      versionId = id;
      versionsCount++;
    }
  }
  if (ids.length === 1) {
    var id = ids[0];
    debugger;
    this.send({ a: action, c: collection, d: id });
  } else if (ids.length) {
    debugger;
    this.send({ a: "b" + action, c: collection, b: ids });
  }
  if (versionsCount === 1) {
    var version = versions[versionId];
    debugger;
    this.send({ a: action, c: collection, d: versionId, v: version });
  } else if (versionsCount) {
    debugger;
    this.send({ a: "b" + action, c: collection, b: versions });
  }
};
Connection.prototype._sendAction = function(action, doc, version) {
  this._addDoc(doc);
  if (this.bulk) {
    var actions = this.bulk[doc.collection] || (this.bulk[doc.collection] = {});
    var versions = actions[action] || (actions[action] = {});
    var isDuplicate = versions.hasOwnProperty(doc.id);
    versions[doc.id] = version;
    return isDuplicate;
  } else {
    var message = { a: action, c: doc.collection, d: doc.id, v: version };
    console.log("message======", message);
    this.send(message);
  }
};
Connection.prototype.sendFetch = function(doc) {
  debugger;
  return this._sendAction("f", doc, doc.version);
};
Connection.prototype.sendSubscribe = function(doc) {
  debugger;
  return this._sendAction("s", doc, doc.version);
};
Connection.prototype.sendUnsubscribe = function(doc) {
  return this._sendAction("u", doc);
};
Connection.prototype.sendOp = function(doc, op) {
  this._addDoc(doc);
  var message = {
    a: "op",
    c: doc.collection,
    d: doc.id,
    v: doc.version,
    src: op.src,
    seq: op.seq,
    x: {}
  };
  if ("op" in op) {
    message.op = op.op;
  }
  if (op.create) {
    message.create = op.create;
  }
  if (op.del) {
    message.del = op.del;
  }
  if (doc.submitSource) {
    message.x.source = op.source;
  }
  this.send(message);
};
Connection.prototype.send = function(message) {
  console.log("\u53D1\u9001\u6D88\u606F\u7ED9\u540E\u53F0\u670D\u52A1\u5668=", message);
  if (this.debug) {
    logger.info("SEND", JSON.stringify(message));
  }
  this.emit("send", message);
  this.socket.send(JSON.stringify(message));
};
Connection.prototype.close = function() {
  this.socket.close();
};
Connection.prototype.getExisting = function(collection, id) {
  if (this.collections[collection])
    return this.collections[collection][id];
};
Connection.prototype.get = function(collection, id) {
  var docs = this.collections[collection] || (this.collections[collection] = {});
  var doc = docs[id];
  if (!doc) {
    doc = docs[id] = new Doc(this, collection, id);
    this.emit("doc", doc);
  }
  return doc;
};
Connection.prototype._destroyDoc = function(doc) {
  util.digAndRemove(this.collections, doc.collection, doc.id);
};
Connection.prototype._addDoc = function(doc) {
  var docs = this.collections[doc.collection];
  if (!docs) {
    docs = this.collections[doc.collection] = {};
  }
  if (docs[doc.id] !== doc) {
    docs[doc.id] = doc;
  }
};
Connection.prototype._createQuery = function(action, collection, q, options, callback) {
  var id = this.nextQueryId++;
  var query = new Query(action, this, id, collection, q, options, callback);
  this.queries[id] = query;
  query.send();
  return query;
};
Connection.prototype._destroyQuery = function(query) {
  delete this.queries[query.id];
};
Connection.prototype.createFetchQuery = function(collection, q, options, callback) {
  return this._createQuery("qf", collection, q, options, callback);
};
Connection.prototype.createSubscribeQuery = function(collection, q, options, callback) {
  return this._createQuery("qs", collection, q, options, callback);
};
Connection.prototype.hasPending = function() {
  return !!(this._firstDoc(hasPending) || this._firstQuery(hasPending) || this._firstSnapshotRequest());
};
function hasPending(object) {
  return object.hasPending();
}
Connection.prototype.hasWritePending = function() {
  return !!this._firstDoc(hasWritePending);
};
function hasWritePending(object) {
  return object.hasWritePending();
}
Connection.prototype.whenNothingPending = function(callback) {
  var doc = this._firstDoc(hasPending);
  if (doc) {
    doc.once("nothing pending", this._nothingPendingRetry(callback));
    return;
  }
  var query = this._firstQuery(hasPending);
  if (query) {
    query.once("ready", this._nothingPendingRetry(callback));
    return;
  }
  var snapshotRequest = this._firstSnapshotRequest();
  if (snapshotRequest) {
    snapshotRequest.once("ready", this._nothingPendingRetry(callback));
    return;
  }
  util.nextTick(callback);
};
Connection.prototype._nothingPendingRetry = function(callback) {
  var connection = this;
  return function() {
    util.nextTick(function() {
      connection.whenNothingPending(callback);
    });
  };
};
Connection.prototype._firstDoc = function(fn) {
  for (var collection in this.collections) {
    var docs = this.collections[collection];
    for (var id in docs) {
      var doc = docs[id];
      if (fn(doc)) {
        return doc;
      }
    }
  }
};
Connection.prototype._firstQuery = function(fn) {
  for (var id in this.queries) {
    var query = this.queries[id];
    if (fn(query)) {
      return query;
    }
  }
};
Connection.prototype._firstSnapshotRequest = function() {
  for (var id in this._snapshotRequests) {
    return this._snapshotRequests[id];
  }
};
Connection.prototype.fetchSnapshot = function(collection, id, version, callback) {
  if (typeof version === "function") {
    callback = version;
    version = null;
  }
  var requestId = this.nextSnapshotRequestId++;
  var snapshotRequest = new SnapshotVersionRequest(this, requestId, collection, id, version, callback);
  this._snapshotRequests[snapshotRequest.requestId] = snapshotRequest;
  snapshotRequest.send();
};
Connection.prototype.fetchSnapshotByTimestamp = function(collection, id, timestamp, callback) {
  if (typeof timestamp === "function") {
    callback = timestamp;
    timestamp = null;
  }
  var requestId = this.nextSnapshotRequestId++;
  var snapshotRequest = new SnapshotTimestampRequest(this, requestId, collection, id, timestamp, callback);
  this._snapshotRequests[snapshotRequest.requestId] = snapshotRequest;
  snapshotRequest.send();
};
Connection.prototype._handleSnapshotFetch = function(error, message) {
  var snapshotRequest = this._snapshotRequests[message.id];
  if (!snapshotRequest)
    return;
  delete this._snapshotRequests[message.id];
  snapshotRequest._handleResponse(error, message);
};
Connection.prototype._handleLegacyInit = function(message) {
  if (message.protocolMinor) {
    debugger;
    return this._initializeHandshake();
  }
  this._initialize(message);
};
Connection.prototype._initializeHandshake = function() {
  debugger;
  this.send({ a: "hs", id: this.id });
};
Connection.prototype._handleHandshake = function(error, message) {
  if (error)
    return this.emit("error", error);
  this._initialize(message);
};
Connection.prototype._initialize = function(message) {
  if (this.state !== "connecting")
    return;
  if (message.protocol !== 1) {
    return this.emit("error", new ShareDBError(ERROR_CODE.ERR_PROTOCOL_VERSION_NOT_SUPPORTED, "Unsupported protocol version: " + message.protocol));
  }
  if (types.map[message.type] !== types.defaultType) {
    return this.emit("error", new ShareDBError(ERROR_CODE.ERR_DEFAULT_TYPE_MISMATCH, message.type + " does not match the server default type"));
  }
  if (typeof message.id !== "string") {
    return this.emit("error", new ShareDBError(ERROR_CODE.ERR_CLIENT_ID_BADLY_FORMED, "Client id must be a string"));
  }
  this.id = message.id;
  this._setState("connected");
};
Connection.prototype.getPresence = function(channel) {
  var connection = this;
  return util.digOrCreate(this._presences, channel, function() {
    return new Presence(connection, channel);
  });
};
Connection.prototype.getDocPresence = function(collection, id) {
  var channel = DocPresence.channel(collection, id);
  var connection = this;
  return util.digOrCreate(this._presences, channel, function() {
    return new DocPresence(connection, collection, id);
  });
};
Connection.prototype._sendPresenceAction = function(action, seq, presence) {
  this._addPresence(presence);
  var message = { a: action, ch: presence.channel, seq };
  debugger;
  this.send(message);
  return message.seq;
};
Connection.prototype._addPresence = function(presence) {
  util.digOrCreate(this._presences, presence.channel, function() {
    return presence;
  });
};
Connection.prototype._handlePresenceSubscribe = function(error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence)
    presence._handleSubscribe(error, message.seq);
};
Connection.prototype._handlePresenceUnsubscribe = function(error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence)
    presence._handleUnsubscribe(error, message.seq);
};
Connection.prototype._handlePresence = function(error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence)
    presence._receiveUpdate(error, message);
};
Connection.prototype._handlePresenceRequest = function(error, message) {
  var presence = util.dig(this._presences, message.ch);
  if (presence)
    presence._broadcastAllLocalPresence(error, message);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/doc.js":
/*!********************************************!*\
  !*** ../modules/sharedb/lib/client/doc.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../emitter */ "../modules/sharedb/lib/emitter.js");
var logger = __webpack_require__(/*! ../logger */ "../modules/sharedb/lib/logger/index.js");
var ShareDBError = __webpack_require__(/*! ../error */ "../modules/sharedb/lib/error.js");
var types = __webpack_require__(/*! ../types */ "../modules/sharedb/lib/types.js");
var util = __webpack_require__(/*! ../util */ "../modules/sharedb/lib/util.js");
var clone = util.clone;
var deepEqual = __webpack_require__(/*! ../../../fast-deep-equal */ "../modules/fast-deep-equal/index.js");
var ERROR_CODE = ShareDBError.CODES;
module.exports = Doc;
function Doc(connection, collection, id) {
  emitter.EventEmitter.call(this);
  this.connection = connection;
  this.collection = collection;
  this.id = id;
  this.version = null;
  this.type = null;
  this.data = void 0;
  this.inflightFetch = [];
  this.inflightSubscribe = null;
  this.pendingFetch = [];
  this.pendingSubscribe = [];
  this.subscribed = false;
  this.wantSubscribe = false;
  this.inflightOp = null;
  this.pendingOps = [];
  this.type = null;
  this.applyStack = null;
  this.preventCompose = false;
  this.submitSource = false;
  this.paused = false;
  this._dataStateVersion = 0;
}
emitter.mixin(Doc);
Doc.prototype.destroy = function(callback) {
  var doc = this;
  doc.whenNothingPending(function() {
    if (doc.wantSubscribe) {
      doc.unsubscribe(function(err) {
        if (err) {
          if (callback) {
            return callback(err);
          }
          return doc.emit("error", err);
        }
        doc.connection._destroyDoc(doc);
        doc.emit("destroy");
        if (callback) {
          callback();
        }
      });
    } else {
      doc.connection._destroyDoc(doc);
      doc.emit("destroy");
      if (callback) {
        callback();
      }
    }
  });
};
Doc.prototype._setType = function(newType) {
  if (typeof newType === "string") {
    newType = types.map[newType];
  }
  if (newType) {
    this.type = newType;
  } else if (newType === null) {
    this.type = newType;
    this._setData(void 0);
  } else {
    var err = new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, "Missing type " + newType);
    return this.emit("error", err);
  }
};
Doc.prototype._setData = function(data) {
  this.data = data;
  this._dataStateVersion++;
};
Doc.prototype.ingestSnapshot = function(snapshot, callback) {
  if (!snapshot)
    return callback && callback();
  if (typeof snapshot.v !== "number") {
    var err = new ShareDBError(ERROR_CODE.ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION, "Missing version in ingested snapshot. " + this.collection + "." + this.id);
    if (callback)
      return callback(err);
    return this.emit("error", err);
  }
  if (this.type || this.hasWritePending()) {
    if (this.version == null) {
      if (this.hasWritePending()) {
        return callback && this.once("no write pending", callback);
      }
      var err = new ShareDBError(ERROR_CODE.ERR_DOC_MISSING_VERSION, "Cannot ingest snapshot in doc with null version. " + this.collection + "." + this.id);
      if (callback)
        return callback(err);
      return this.emit("error", err);
    }
    if (snapshot.v > this.version)
      return this.fetch(callback);
    return callback && callback();
  }
  if (this.version > snapshot.v)
    return callback && callback();
  this.version = snapshot.v;
  var type = snapshot.type === void 0 ? types.defaultType : snapshot.type;
  this._setType(type);
  this._setData(this.type && this.type.deserialize ? this.type.deserialize(snapshot.data) : snapshot.data);
  this.emit("load");
  callback && callback();
};
Doc.prototype.whenNothingPending = function(callback) {
  var doc = this;
  util.nextTick(function() {
    if (doc.hasPending()) {
      doc.once("nothing pending", callback);
      return;
    }
    callback();
  });
};
Doc.prototype.hasPending = function() {
  return !!(this.inflightOp || this.pendingOps.length || this.inflightFetch.length || this.inflightSubscribe || this.pendingFetch.length || this.pendingSubscribe.length);
};
Doc.prototype.hasWritePending = function() {
  return !!(this.inflightOp || this.pendingOps.length);
};
Doc.prototype._emitNothingPending = function() {
  if (this.hasWritePending())
    return;
  this.emit("no write pending");
  if (this.hasPending())
    return;
  this.emit("nothing pending");
};
Doc.prototype._emitResponseError = function(err, callback) {
  if (err && err.code === ERROR_CODE.ERR_SNAPSHOT_READ_SILENT_REJECTION) {
    this.wantSubscribe = false;
    if (callback) {
      callback();
    }
    this._emitNothingPending();
    return;
  }
  if (callback) {
    callback(err);
    this._emitNothingPending();
    return;
  }
  this._emitNothingPending();
  this.emit("error", err);
};
Doc.prototype._handleFetch = function(error, snapshot) {
  var callbacks = this.pendingFetch;
  this.pendingFetch = [];
  var callback = this.inflightFetch.shift();
  if (callback)
    callbacks.push(callback);
  if (callbacks.length) {
    callback = function(error2) {
      util.callEach(callbacks, error2);
    };
  }
  if (error)
    return this._emitResponseError(error, callback);
  this.ingestSnapshot(snapshot, callback);
  this._emitNothingPending();
};
Doc.prototype._handleSubscribe = function(error, snapshot) {
  var request = this.inflightSubscribe;
  this.inflightSubscribe = null;
  var callbacks = this.pendingFetch;
  this.pendingFetch = [];
  if (request.callback) {
    callbacks.push(request.callback);
  }
  var callback;
  if (callbacks.length) {
    callback = function(error2) {
      util.callEach(callbacks, error2);
    };
  }
  if (error) {
    return this._emitResponseError(error, callback);
  }
  this.subscribed = request.wantSubscribe;
  if (this.subscribed) {
    this.ingestSnapshot(snapshot, callback);
  } else if (callback) {
    callback();
  }
  this._emitNothingPending();
  this._flushSubscribe();
};
Doc.prototype._handleOp = function(err, message) {
  if (err) {
    if (this.inflightOp) {
      if (err.code === ERROR_CODE.ERR_OP_SUBMIT_REJECTED)
        err = null;
      return this._rollback(err);
    }
    return this.emit("error", err);
  }
  if (this.inflightOp && message.src === this.inflightOp.src && message.seq === this.inflightOp.seq) {
    this._opAcknowledged(message);
    return;
  }
  if (this.version == null || message.v > this.version) {
    this.fetch();
    return;
  }
  if (message.v < this.version) {
    return;
  }
  if (this.inflightOp) {
    var transformErr = transformX(this.inflightOp, message);
    if (transformErr)
      return this._hardRollback(transformErr);
  }
  for (var i = 0; i < this.pendingOps.length; i++) {
    var transformErr = transformX(this.pendingOps[i], message);
    if (transformErr)
      return this._hardRollback(transformErr);
  }
  this.version++;
  try {
    console.log("\u6709op\u64CD\u4F5C _handleOp");
    debugger;
    this._otApply(message, false);
  } catch (error) {
    return this._hardRollback(error);
  }
};
Doc.prototype._onConnectionStateChanged = function() {
  if (this.connection.canSend) {
    debugger;
    this.flush();
    debugger;
    this._resubscribe();
  } else {
    debugger;
    if (this.inflightOp) {
      this.pendingOps.unshift(this.inflightOp);
      this.inflightOp = null;
    }
    this.subscribed = false;
    if (this.inflightSubscribe) {
      if (this.inflightSubscribe.wantSubscribe) {
        this.pendingSubscribe.unshift(this.inflightSubscribe);
        this.inflightSubscribe = null;
      } else {
        this._handleSubscribe();
      }
    }
    if (this.inflightFetch.length) {
      this.pendingFetch = this.pendingFetch.concat(this.inflightFetch);
      this.inflightFetch.length = 0;
    }
  }
};
Doc.prototype._resubscribe = function() {
  if (!this.pendingSubscribe.length && this.wantSubscribe) {
    debugger;
    return this.subscribe();
  }
  var willFetch = this.pendingSubscribe.some(function(request) {
    return request.wantSubscribe;
  });
  if (!willFetch && this.pendingFetch.length) {
    debugger;
    this.fetch();
  }
  debugger;
  this._flushSubscribe();
};
Doc.prototype.fetch = function(callback) {
  if (this.connection.canSend) {
    var isDuplicate = this.connection.sendFetch(this);
    pushActionCallback(this.inflightFetch, isDuplicate, callback);
    return;
  }
  debugger;
  this.pendingFetch.push(callback);
};
Doc.prototype.subscribe = function(callback) {
  var wantSubscribe = true;
  this._queueSubscribe(wantSubscribe, callback);
};
Doc.prototype.unsubscribe = function(callback) {
  var wantSubscribe = false;
  this._queueSubscribe(wantSubscribe, callback);
};
Doc.prototype._queueSubscribe = function(wantSubscribe, callback) {
  var lastRequest = this.pendingSubscribe[this.pendingSubscribe.length - 1] || this.inflightSubscribe;
  var isDuplicateRequest = lastRequest && lastRequest.wantSubscribe === wantSubscribe;
  if (isDuplicateRequest) {
    lastRequest.callback = combineCallbacks([lastRequest.callback, callback]);
    return;
  }
  this.pendingSubscribe.push({
    wantSubscribe: !!wantSubscribe,
    callback
  });
  debugger;
  this._flushSubscribe();
};
Doc.prototype._flushSubscribe = function() {
  if (this.inflightSubscribe || !this.pendingSubscribe.length)
    return;
  if (this.connection.canSend) {
    this.inflightSubscribe = this.pendingSubscribe.shift();
    this.wantSubscribe = this.inflightSubscribe.wantSubscribe;
    if (this.wantSubscribe) {
      debugger;
      debugger;
      this.connection.sendSubscribe(this);
    } else {
      debugger;
      this.subscribed = false;
      this.connection.sendUnsubscribe(this);
    }
    return;
  }
  if (!this.pendingSubscribe[0].wantSubscribe) {
    this.inflightSubscribe = this.pendingSubscribe.shift();
    var doc = this;
    util.nextTick(function() {
      doc._handleSubscribe();
    });
  }
};
function pushActionCallback(inflight, isDuplicate, callback) {
  if (isDuplicate) {
    var lastCallback = inflight.pop();
    inflight.push(function(err) {
      lastCallback && lastCallback(err);
      callback && callback(err);
    });
  } else {
    inflight.push(callback);
  }
}
function combineCallbacks(callbacks) {
  callbacks = callbacks.filter(util.truthy);
  if (!callbacks.length)
    return null;
  return function(error) {
    util.callEach(callbacks, error);
  };
}
Doc.prototype.flush = function() {
  if (!this.connection.canSend || this.inflightOp)
    return;
  debugger;
  if (!this.paused && this.pendingOps.length) {
    debugger;
    this._sendOp();
  }
};
function setNoOp(op) {
  delete op.op;
  delete op.create;
  delete op.del;
}
function transformX(client, server) {
  if (client.del)
    return setNoOp(server);
  if (server.del) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_WAS_DELETED, "Document was deleted");
  }
  if (server.create) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already created");
  }
  if (!("op" in server))
    return;
  if (client.create) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already created");
  }
  if (client.type.transformX) {
    var result = client.type.transformX(client.op, server.op);
    client.op = result[0];
    server.op = result[1];
  } else {
    var clientOp = client.type.transform(client.op, server.op, "left");
    var serverOp = client.type.transform(server.op, client.op, "right");
    client.op = clientOp;
    server.op = serverOp;
  }
}
Doc.prototype._otApply = function(op, source) {
  if ("op" in op) {
    if (!this.type) {
      throw new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Cannot apply op to uncreated document. " + this.collection + "." + this.id);
    }
    this.emit("before op batch", op.op, source);
    if (!source && this.type === types.defaultType && op.op.length > 1) {
      if (!this.applyStack) {
        this.applyStack = [];
      }
      var stackLength = this.applyStack.length;
      for (var i = 0; i < op.op.length; i++) {
        var component = op.op[i];
        var componentOp = { op: [component] };
        this.emit("before op", componentOp.op, source, op.src);
        for (var j = stackLength; j < this.applyStack.length; j++) {
          var transformErr = transformX(this.applyStack[j], componentOp);
          if (transformErr)
            return this._hardRollback(transformErr);
        }
        this._setData(this.type.apply(this.data, componentOp.op));
        this.emit("op", componentOp.op, source, op.src);
      }
      this.emit("op batch", op.op, source);
      this._popApplyStack(stackLength);
      return;
    }
    this.emit("before op", op.op, source, op.src);
    console.log("this.type.apply");
    debugger;
    this._setData(this.type.apply(this.data, op.op));
    this.emit("op", op.op, source, op.src);
    this.emit("op batch", op.op, source);
    return;
  }
  if (op.create) {
    this._setType(op.create.type);
    if (this.type.deserialize) {
      if (this.type.createDeserialized) {
        this._setData(this.type.createDeserialized(op.create.data));
      } else {
        this._setData(this.type.deserialize(this.type.create(op.create.data)));
      }
    } else {
      this._setData(this.type.create(op.create.data));
    }
    this.emit("create", source);
    return;
  }
  if (op.del) {
    var oldData = this.data;
    this._setType(null);
    this.emit("del", oldData, source);
    return;
  }
};
Doc.prototype._sendOp = function() {
  if (!this.connection.canSend)
    return;
  var src = this.connection.id;
  if (!this.inflightOp) {
    this.inflightOp = this.pendingOps.shift();
  }
  var op = this.inflightOp;
  if (!op) {
    var err = new ShareDBError(ERROR_CODE.ERR_INFLIGHT_OP_MISSING, "No op to send on call to _sendOp");
    return this.emit("error", err);
  }
  op.sentAt = Date.now();
  op.retries = op.retries == null ? 0 : op.retries + 1;
  if (op.seq == null) {
    if (this.connection.seq >= util.MAX_SAFE_INTEGER) {
      return this.emit("error", new ShareDBError(ERROR_CODE.ERR_CONNECTION_SEQ_INTEGER_OVERFLOW, "Connection seq has exceeded the max safe integer, maybe from being open for too long"));
    }
    op.seq = this.connection.seq++;
  }
  this.connection.sendOp(this, op);
  if (op.src == null)
    op.src = src;
};
Doc.prototype._submit = function(op, source, callback) {
  if (!source) {
    source = true;
  }
  if ("op" in op) {
    if (!this.type) {
      var err = new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Cannot submit op. Document has not been created. " + this.collection + "." + this.id);
      if (callback) {
        return callback(err);
      }
      return this.emit("error", err);
    }
    if (this.type.normalize) {
      op.op = this.type.normalize(op.op);
    }
  }
  try {
    this._pushOp(op, source, callback);
    this._otApply(op, source);
  } catch (error) {
    return this._hardRollback(error);
  }
  var doc = this;
  util.nextTick(function() {
    doc.flush();
  });
};
Doc.prototype._pushOp = function(op, source, callback) {
  op.source = source;
  if (this.applyStack) {
    this.applyStack.push(op);
  } else {
    var composed = this._tryCompose(op);
    if (composed) {
      composed.callbacks.push(callback);
      return;
    }
  }
  op.type = this.type;
  op.callbacks = [callback];
  this.pendingOps.push(op);
};
Doc.prototype._popApplyStack = function(to) {
  if (to > 0) {
    this.applyStack.length = to;
    return;
  }
  var op = this.applyStack[0];
  this.applyStack = null;
  if (!op)
    return;
  var i = this.pendingOps.indexOf(op);
  if (i === -1)
    return;
  var ops = this.pendingOps.splice(i);
  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    var composed = this._tryCompose(op);
    if (composed) {
      composed.callbacks = composed.callbacks.concat(op.callbacks);
    } else {
      this.pendingOps.push(op);
    }
  }
};
Doc.prototype._tryCompose = function(op) {
  if (this.preventCompose) {
    return;
  }
  var last = this.pendingOps[this.pendingOps.length - 1];
  if (!last || last.sentAt) {
    return;
  }
  if (this.submitSource && !deepEqual(op.source, last.source)) {
    return;
  }
  if (last.create && "op" in op) {
    console.log("last.create");
    debugger;
    last.create.data = this.type.apply(last.create.data, op.op);
    return last;
  }
  if ("op" in last && "op" in op && this.type.compose) {
    last.op = this.type.compose(last.op, op.op);
    return last;
  }
};
Doc.prototype.submitOp = function(component, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  var op = { op: component };
  var source = options && options.source;
  this._submit(op, source, callback);
};
Doc.prototype.create = function(data, type, options, callback) {
  if (typeof type === "function") {
    callback = type;
    options = null;
    type = null;
  } else if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (!type) {
    type = types.defaultType.uri;
  }
  if (this.type) {
    var err = new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already exists");
    if (callback)
      return callback(err);
    return this.emit("error", err);
  }
  var op = { create: { type, data } };
  var source = options && options.source;
  this._submit(op, source, callback);
};
Doc.prototype.del = function(options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (!this.type) {
    var err = new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Document does not exist");
    if (callback)
      return callback(err);
    return this.emit("error", err);
  }
  var op = { del: true };
  var source = options && options.source;
  this._submit(op, source, callback);
};
Doc.prototype.pause = function() {
  this.paused = true;
};
Doc.prototype.resume = function() {
  this.paused = false;
  this.flush();
};
Doc.prototype.toSnapshot = function() {
  return {
    v: this.version,
    data: clone(this.data),
    type: this.type.uri
  };
};
Doc.prototype._opAcknowledged = function(message) {
  if (this.inflightOp.create) {
    this.version = message.v;
  } else if (message.v !== this.version) {
    logger.warn("Invalid version from server. Expected: " + this.version + " Received: " + message.v, message);
    return this.fetch();
  }
  this.version++;
  this._clearInflightOp();
};
Doc.prototype._rollback = function(err) {
  var op = this.inflightOp;
  if ("op" in op && op.type.invert) {
    try {
      op.op = op.type.invert(op.op);
    } catch (error) {
      return this._hardRollback(err);
    }
    for (var i = 0; i < this.pendingOps.length; i++) {
      var transformErr = transformX(this.pendingOps[i], op);
      if (transformErr)
        return this._hardRollback(transformErr);
    }
    try {
      this._otApply(op, false);
    } catch (error) {
      return this._hardRollback(error);
    }
    this._clearInflightOp(err);
    return;
  }
  this._hardRollback(err);
};
Doc.prototype._hardRollback = function(err) {
  var pendingOps = [];
  if (this.inflightOp)
    pendingOps.push(this.inflightOp);
  pendingOps = pendingOps.concat(this.pendingOps);
  this._setType(null);
  this.version = null;
  this.inflightOp = null;
  this.pendingOps = [];
  var doc = this;
  this.fetch(function() {
    var allOpsHadCallbacks = !!pendingOps.length;
    for (var i = 0; i < pendingOps.length; i++) {
      allOpsHadCallbacks = util.callEach(pendingOps[i].callbacks, err) && allOpsHadCallbacks;
    }
    if (err && !allOpsHadCallbacks)
      return doc.emit("error", err);
  });
};
Doc.prototype._clearInflightOp = function(err) {
  var inflightOp = this.inflightOp;
  this.inflightOp = null;
  var called = util.callEach(inflightOp.callbacks, err);
  this.flush();
  this._emitNothingPending();
  if (err && !called)
    return this.emit("error", err);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/index.js":
/*!**********************************************!*\
  !*** ../modules/sharedb/lib/client/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.Connection = __webpack_require__(/*! ./connection */ "../modules/sharedb/lib/client/connection.js");
exports.Doc = __webpack_require__(/*! ./doc */ "../modules/sharedb/lib/client/doc.js");
exports.Error = __webpack_require__(/*! ../error */ "../modules/sharedb/lib/error.js");
exports.Query = __webpack_require__(/*! ./query */ "../modules/sharedb/lib/client/query.js");
exports.types = __webpack_require__(/*! ../types */ "../modules/sharedb/lib/types.js");
exports.logger = __webpack_require__(/*! ../logger */ "../modules/sharedb/lib/logger/index.js");


/***/ }),

/***/ "../modules/sharedb/lib/client/presence/doc-presence.js":
/*!**************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/doc-presence.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Presence = __webpack_require__(/*! ./presence */ "../modules/sharedb/lib/client/presence/presence.js");
var LocalDocPresence = __webpack_require__(/*! ./local-doc-presence */ "../modules/sharedb/lib/client/presence/local-doc-presence.js");
var RemoteDocPresence = __webpack_require__(/*! ./remote-doc-presence */ "../modules/sharedb/lib/client/presence/remote-doc-presence.js");
function DocPresence(connection, collection, id) {
  var channel = DocPresence.channel(collection, id);
  Presence.call(this, connection, channel);
  this.collection = collection;
  this.id = id;
}
module.exports = DocPresence;
DocPresence.prototype = Object.create(Presence.prototype);
DocPresence.channel = function(collection, id) {
  return collection + "." + id;
};
DocPresence.prototype._createLocalPresence = function(id) {
  return new LocalDocPresence(this, id);
};
DocPresence.prototype._createRemotePresence = function(id) {
  return new RemoteDocPresence(this, id);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/presence/local-doc-presence.js":
/*!********************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/local-doc-presence.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var LocalPresence = __webpack_require__(/*! ./local-presence */ "../modules/sharedb/lib/client/presence/local-presence.js");
var ShareDBError = __webpack_require__(/*! ../../error */ "../modules/sharedb/lib/error.js");
var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");
var ERROR_CODE = ShareDBError.CODES;
module.exports = LocalDocPresence;
function LocalDocPresence(presence, presenceId) {
  LocalPresence.call(this, presence, presenceId);
  this.collection = this.presence.collection;
  this.id = this.presence.id;
  this._doc = this.connection.get(this.collection, this.id);
  this._isSending = false;
  this._docDataVersionByPresenceVersion = {};
  this._opHandler = this._transformAgainstOp.bind(this);
  this._createOrDelHandler = this._handleCreateOrDel.bind(this);
  this._loadHandler = this._handleLoad.bind(this);
  this._destroyHandler = this.destroy.bind(this);
  this._registerWithDoc();
}
LocalDocPresence.prototype = Object.create(LocalPresence.prototype);
LocalDocPresence.prototype.submit = function(value, callback) {
  if (!this._doc.type) {
    if (value === null)
      return this._callbackOrEmit(null, callback);
    var error = {
      code: ERROR_CODE.ERR_DOC_DOES_NOT_EXIST,
      message: "Cannot submit presence. Document has not been created"
    };
    return this._callbackOrEmit(error, callback);
  }
  ;
  this._docDataVersionByPresenceVersion[this.presenceVersion] = this._doc._dataStateVersion;
  LocalPresence.prototype.submit.call(this, value, callback);
};
LocalDocPresence.prototype.destroy = function(callback) {
  this._doc.removeListener("op", this._opHandler);
  this._doc.removeListener("create", this._createOrDelHandler);
  this._doc.removeListener("del", this._createOrDelHandler);
  this._doc.removeListener("load", this._loadHandler);
  this._doc.removeListener("destroy", this._destroyHandler);
  LocalPresence.prototype.destroy.call(this, callback);
};
LocalDocPresence.prototype._sendPending = function() {
  if (this._isSending)
    return;
  this._isSending = true;
  var presence = this;
  this._doc.whenNothingPending(function() {
    presence._isSending = false;
    if (!presence.connection.canSend)
      return;
    presence._pendingMessages.forEach(function(message) {
      message.t = presence._doc.type.uri;
      message.v = presence._doc.version;
      presence.connection.send(message);
    });
    presence._pendingMessages = [];
    presence._docDataVersionByPresenceVersion = {};
  });
};
LocalDocPresence.prototype._registerWithDoc = function() {
  this._doc.on("op", this._opHandler);
  this._doc.on("create", this._createOrDelHandler);
  this._doc.on("del", this._createOrDelHandler);
  this._doc.on("load", this._loadHandler);
  this._doc.on("destroy", this._destroyHandler);
};
LocalDocPresence.prototype._transformAgainstOp = function(op, source) {
  var presence = this;
  var docDataVersion = this._doc._dataStateVersion;
  this._pendingMessages.forEach(function(message) {
    var messageDocDataVersion = presence._docDataVersionByPresenceVersion[message.pv];
    if (messageDocDataVersion >= docDataVersion)
      return;
    try {
      message.p = presence._transformPresence(message.p, op, source);
      presence._docDataVersionByPresenceVersion[message.pv] = docDataVersion;
    } catch (error) {
      var callback = presence._getCallback(message.pv);
      presence._callbackOrEmit(error, callback);
    }
  });
  try {
    this.value = this._transformPresence(this.value, op, source);
  } catch (error) {
    this.emit("error", error);
  }
};
LocalDocPresence.prototype._handleCreateOrDel = function() {
  this._pendingMessages.forEach(function(message) {
    message.p = null;
  });
  this.value = null;
};
LocalDocPresence.prototype._handleLoad = function() {
  this.value = null;
  this._pendingMessages = [];
  this._docDataVersionByPresenceVersion = {};
};
LocalDocPresence.prototype._message = function() {
  var message = LocalPresence.prototype._message.call(this);
  message.c = this.collection, message.d = this.id, message.v = null;
  message.t = null;
  return message;
};
LocalDocPresence.prototype._transformPresence = function(value, op, source) {
  var type = this._doc.type;
  if (!util.supportsPresence(type)) {
    throw new ShareDBError(ERROR_CODE.ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE, "Type does not support presence: " + type.name);
  }
  return type.transformPresence(value, op, source);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/presence/local-presence.js":
/*!****************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/local-presence.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../../emitter */ "../modules/sharedb/lib/emitter.js");
var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");
module.exports = LocalPresence;
function LocalPresence(presence, presenceId) {
  emitter.EventEmitter.call(this);
  if (!presenceId || typeof presenceId !== "string") {
    throw new Error("LocalPresence presenceId must be a string");
  }
  this.presence = presence;
  this.presenceId = presenceId;
  this.connection = presence.connection;
  this.presenceVersion = 0;
  this.value = null;
  this._pendingMessages = [];
  this._callbacksByPresenceVersion = {};
}
emitter.mixin(LocalPresence);
LocalPresence.prototype.submit = function(value, callback) {
  this.value = value;
  this.send(callback);
};
LocalPresence.prototype.send = function(callback) {
  var message = this._message();
  this._pendingMessages.push(message);
  this._callbacksByPresenceVersion[message.pv] = callback;
  this._sendPending();
};
LocalPresence.prototype.destroy = function(callback) {
  var presence = this;
  this.submit(null, function(error) {
    if (error)
      return presence._callbackOrEmit(error, callback);
    delete presence.presence.localPresences[presence.presenceId];
    if (callback)
      callback();
  });
};
LocalPresence.prototype._sendPending = function() {
  if (!this.connection.canSend)
    return;
  var presence = this;
  this._pendingMessages.forEach(function(message) {
    presence.connection.send(message);
  });
  this._pendingMessages = [];
};
LocalPresence.prototype._ack = function(error, presenceVersion) {
  var callback = this._getCallback(presenceVersion);
  this._callbackOrEmit(error, callback);
};
LocalPresence.prototype._message = function() {
  return {
    a: "p",
    ch: this.presence.channel,
    id: this.presenceId,
    p: this.value,
    pv: this.presenceVersion++
  };
};
LocalPresence.prototype._getCallback = function(presenceVersion) {
  var callback = this._callbacksByPresenceVersion[presenceVersion];
  delete this._callbacksByPresenceVersion[presenceVersion];
  return callback;
};
LocalPresence.prototype._callbackOrEmit = function(error, callback) {
  if (callback)
    return util.nextTick(callback, error);
  if (error)
    this.emit("error", error);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/presence/presence.js":
/*!**********************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/presence.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../../emitter */ "../modules/sharedb/lib/emitter.js");
var LocalPresence = __webpack_require__(/*! ./local-presence */ "../modules/sharedb/lib/client/presence/local-presence.js");
var RemotePresence = __webpack_require__(/*! ./remote-presence */ "../modules/sharedb/lib/client/presence/remote-presence.js");
var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");
var async = __webpack_require__(/*! ../../../../async */ "../modules/async/dist/async.mjs");
var hat = __webpack_require__(/*! ../../../../hat */ "../modules/hat/index.js");
module.exports = Presence;
function Presence(connection, channel) {
  emitter.EventEmitter.call(this);
  if (!channel || typeof channel !== "string") {
    throw new Error("Presence channel must be provided");
  }
  this.connection = connection;
  this.channel = channel;
  this.wantSubscribe = false;
  this.subscribed = false;
  this.remotePresences = {};
  this.localPresences = {};
  this._remotePresenceInstances = {};
  this._subscriptionCallbacksBySeq = {};
}
emitter.mixin(Presence);
Presence.prototype.subscribe = function(callback) {
  this._sendSubscriptionAction(true, callback);
};
Presence.prototype.unsubscribe = function(callback) {
  this._sendSubscriptionAction(false, callback);
};
Presence.prototype.create = function(id) {
  id = id || hat();
  var localPresence = this._createLocalPresence(id);
  this.localPresences[id] = localPresence;
  return localPresence;
};
Presence.prototype.destroy = function(callback) {
  var presence = this;
  this.unsubscribe(function(error) {
    if (error)
      return presence._callbackOrEmit(error, callback);
    var localIds = Object.keys(presence.localPresences);
    var remoteIds = Object.keys(presence._remotePresenceInstances);
    async.parallel([
      function(next) {
        async.each(localIds, function(presenceId, next2) {
          presence.localPresences[presenceId].destroy(next2);
        }, next);
      },
      function(next) {
        async.each(remoteIds, function(presenceId, next2) {
          presence._remotePresenceInstances[presenceId].destroy(next2);
        }, next);
      }
    ], function(error2) {
      delete presence.connection._presences[presence.channel];
      presence._callbackOrEmit(error2, callback);
    });
  });
};
Presence.prototype._sendSubscriptionAction = function(wantSubscribe, callback) {
  this.wantSubscribe = !!wantSubscribe;
  var action = this.wantSubscribe ? "ps" : "pu";
  var seq = this.connection._presenceSeq++;
  this._subscriptionCallbacksBySeq[seq] = callback;
  if (this.connection.canSend) {
    this.connection._sendPresenceAction(action, seq, this);
  }
};
Presence.prototype._handleSubscribe = function(error, seq) {
  if (this.wantSubscribe)
    this.subscribed = true;
  var callback = this._subscriptionCallback(seq);
  this._callbackOrEmit(error, callback);
};
Presence.prototype._handleUnsubscribe = function(error, seq) {
  this.subscribed = false;
  var callback = this._subscriptionCallback(seq);
  this._callbackOrEmit(error, callback);
};
Presence.prototype._receiveUpdate = function(error, message) {
  var localPresence = util.dig(this.localPresences, message.id);
  if (localPresence)
    return localPresence._ack(error, message.pv);
  if (error)
    return this.emit("error", error);
  var presence = this;
  var remotePresence = util.digOrCreate(this._remotePresenceInstances, message.id, function() {
    return presence._createRemotePresence(message.id);
  });
  remotePresence.receiveUpdate(message);
};
Presence.prototype._updateRemotePresence = function(remotePresence) {
  this.remotePresences[remotePresence.presenceId] = remotePresence.value;
  if (remotePresence.value === null)
    this._removeRemotePresence(remotePresence.presenceId);
  this.emit("receive", remotePresence.presenceId, remotePresence.value);
};
Presence.prototype._broadcastAllLocalPresence = function(error) {
  if (error)
    return this.emit("error", error);
  for (var id in this.localPresences) {
    var localPresence = this.localPresences[id];
    if (localPresence.value !== null)
      localPresence.send();
  }
};
Presence.prototype._removeRemotePresence = function(id) {
  this._remotePresenceInstances[id].destroy();
  delete this._remotePresenceInstances[id];
  delete this.remotePresences[id];
};
Presence.prototype._onConnectionStateChanged = function() {
  if (!this.connection.canSend)
    return;
  this._resubscribe();
  for (var id in this.localPresences) {
    this.localPresences[id]._sendPending();
  }
};
Presence.prototype._resubscribe = function() {
  var callbacks = [];
  for (var seq in this._subscriptionCallbacksBySeq) {
    var callback = this._subscriptionCallback(seq);
    callbacks.push(callback);
  }
  if (!this.wantSubscribe)
    return this._callEachOrEmit(callbacks);
  var presence = this;
  this.subscribe(function(error) {
    presence._callEachOrEmit(callbacks, error);
  });
};
Presence.prototype._subscriptionCallback = function(seq) {
  var callback = this._subscriptionCallbacksBySeq[seq];
  delete this._subscriptionCallbacksBySeq[seq];
  return callback;
};
Presence.prototype._callbackOrEmit = function(error, callback) {
  if (callback)
    return util.nextTick(callback, error);
  if (error)
    this.emit("error", error);
};
Presence.prototype._createLocalPresence = function(id) {
  return new LocalPresence(this, id);
};
Presence.prototype._createRemotePresence = function(id) {
  return new RemotePresence(this, id);
};
Presence.prototype._callEachOrEmit = function(callbacks, error) {
  var called = util.callEach(callbacks, error);
  if (!called && error)
    this.emit("error", error);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/presence/remote-doc-presence.js":
/*!*********************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/remote-doc-presence.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var RemotePresence = __webpack_require__(/*! ./remote-presence */ "../modules/sharedb/lib/client/presence/remote-presence.js");
var ot = __webpack_require__(/*! ../../ot */ "../modules/sharedb/lib/ot.js");
module.exports = RemoteDocPresence;
function RemoteDocPresence(presence, presenceId) {
  RemotePresence.call(this, presence, presenceId);
  this.collection = this.presence.collection;
  this.id = this.presence.id;
  this.src = null;
  this.presenceVersion = null;
  this._doc = this.connection.get(this.collection, this.id);
  this._pending = null;
  this._opCache = null;
  this._pendingSetPending = false;
  this._opHandler = this._handleOp.bind(this);
  this._createDelHandler = this._handleCreateDel.bind(this);
  this._loadHandler = this._handleLoad.bind(this);
  this._registerWithDoc();
}
RemoteDocPresence.prototype = Object.create(RemotePresence.prototype);
RemoteDocPresence.prototype.receiveUpdate = function(message) {
  if (this._pending && message.pv < this._pending.pv)
    return;
  this.src = message.src;
  this._pending = message;
  this._setPendingPresence();
};
RemoteDocPresence.prototype.destroy = function(callback) {
  this._doc.removeListener("op", this._opHandler);
  this._doc.removeListener("create", this._createDelHandler);
  this._doc.removeListener("del", this._createDelHandler);
  this._doc.removeListener("load", this._loadHandler);
  RemotePresence.prototype.destroy.call(this, callback);
};
RemoteDocPresence.prototype._registerWithDoc = function() {
  this._doc.on("op", this._opHandler);
  this._doc.on("create", this._createDelHandler);
  this._doc.on("del", this._createDelHandler);
  this._doc.on("load", this._loadHandler);
};
RemoteDocPresence.prototype._setPendingPresence = function() {
  if (this._pendingSetPending)
    return;
  this._pendingSetPending = true;
  var presence = this;
  this._doc.whenNothingPending(function() {
    presence._pendingSetPending = false;
    if (!presence._pending)
      return;
    if (presence._pending.pv < presence.presenceVersion)
      return presence._pending = null;
    if (presence._pending.v > presence._doc.version) {
      return presence._doc.fetch();
    }
    if (!presence._catchUpStalePresence())
      return;
    presence.value = presence._pending.p;
    presence.presenceVersion = presence._pending.pv;
    presence._pending = null;
    presence.presence._updateRemotePresence(presence);
  });
};
RemoteDocPresence.prototype._handleOp = function(op, source, connectionId) {
  var isOwnOp = connectionId === this.src;
  this._transformAgainstOp(op, isOwnOp);
  this._cacheOp(op, isOwnOp);
  this._setPendingPresence();
};
RemotePresence.prototype._handleCreateDel = function() {
  this._cacheOp(null);
  this._setPendingPresence();
};
RemotePresence.prototype._handleLoad = function() {
  this.value = null;
  this._pending = null;
  this._opCache = null;
  this.presence._updateRemotePresence(this);
};
RemoteDocPresence.prototype._transformAgainstOp = function(op, isOwnOp) {
  if (!this.value)
    return;
  try {
    this.value = this._doc.type.transformPresence(this.value, op, isOwnOp);
  } catch (error) {
    return this.presence.emit("error", error);
  }
  this.presence._updateRemotePresence(this);
};
RemoteDocPresence.prototype._catchUpStalePresence = function() {
  if (this._pending.v >= this._doc.version)
    return true;
  if (!this._opCache) {
    this._startCachingOps();
    this._doc.fetch();
    this.presence.subscribe();
    return false;
  }
  while (this._opCache[this._pending.v]) {
    var item = this._opCache[this._pending.v];
    var op = item.op;
    var isOwnOp = item.isOwnOp;
    if (op === null) {
      this._pending.p = null;
      this._pending.v++;
    } else {
      ot.transformPresence(this._pending, op, isOwnOp);
    }
  }
  var hasCaughtUp = this._pending.v >= this._doc.version;
  if (hasCaughtUp) {
    this._stopCachingOps();
  }
  return hasCaughtUp;
};
RemoteDocPresence.prototype._startCachingOps = function() {
  this._opCache = [];
};
RemoteDocPresence.prototype._stopCachingOps = function() {
  this._opCache = null;
};
RemoteDocPresence.prototype._cacheOp = function(op, isOwnOp) {
  if (this._opCache) {
    op = op ? { op } : null;
    this._opCache[this._doc.version - 1] = { op, isOwnOp };
  }
};


/***/ }),

/***/ "../modules/sharedb/lib/client/presence/remote-presence.js":
/*!*****************************************************************!*\
  !*** ../modules/sharedb/lib/client/presence/remote-presence.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");
module.exports = RemotePresence;
function RemotePresence(presence, presenceId) {
  this.presence = presence;
  this.presenceId = presenceId;
  this.connection = this.presence.connection;
  this.value = null;
  this.presenceVersion = 0;
}
RemotePresence.prototype.receiveUpdate = function(message) {
  if (message.pv < this.presenceVersion)
    return;
  this.value = message.p;
  this.presenceVersion = message.pv;
  this.presence._updateRemotePresence(this);
};
RemotePresence.prototype.destroy = function(callback) {
  delete this.presence._remotePresenceInstances[this.presenceId];
  delete this.presence.remotePresences[this.presenceId];
  if (callback)
    util.nextTick(callback);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/query.js":
/*!**********************************************!*\
  !*** ../modules/sharedb/lib/client/query.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var emitter = __webpack_require__(/*! ../emitter */ "../modules/sharedb/lib/emitter.js");
var util = __webpack_require__(/*! ../util */ "../modules/sharedb/lib/util.js");
module.exports = Query;
function Query(action, connection, id, collection, query, options, callback) {
  emitter.EventEmitter.call(this);
  this.action = action;
  this.connection = connection;
  this.id = id;
  this.collection = collection;
  this.query = query;
  this.results = null;
  if (options && options.results) {
    this.results = options.results;
    delete options.results;
  }
  this.extra = void 0;
  this.options = options;
  this.callback = callback;
  this.ready = false;
  this.sent = false;
}
emitter.mixin(Query);
Query.prototype.hasPending = function() {
  return !this.ready;
};
Query.prototype.send = function() {
  if (!this.connection.canSend)
    return;
  var message = {
    a: this.action,
    id: this.id,
    c: this.collection,
    q: this.query
  };
  if (this.options) {
    message.o = this.options;
  }
  if (this.results) {
    var results = [];
    for (var i = 0; i < this.results.length; i++) {
      var doc = this.results[i];
      results.push([doc.id, doc.version]);
    }
    message.r = results;
  }
  this.connection.send(message);
  this.sent = true;
};
Query.prototype.destroy = function(callback) {
  if (this.connection.canSend && this.action === "qs") {
    this.connection.send({ a: "qu", id: this.id });
  }
  this.connection._destroyQuery(this);
  if (callback)
    util.nextTick(callback);
};
Query.prototype._onConnectionStateChanged = function() {
  if (this.connection.canSend && !this.sent) {
    this.send();
  } else {
    this.sent = false;
  }
};
Query.prototype._handleFetch = function(err, data, extra) {
  this.connection._destroyQuery(this);
  this._handleResponse(err, data, extra);
};
Query.prototype._handleSubscribe = function(err, data, extra) {
  this._handleResponse(err, data, extra);
};
Query.prototype._handleResponse = function(err, data, extra) {
  var callback = this.callback;
  this.callback = null;
  if (err)
    return this._finishResponse(err, callback);
  if (!data)
    return this._finishResponse(null, callback);
  var query = this;
  var wait = 1;
  var finish = function(err2) {
    if (err2)
      return query._finishResponse(err2, callback);
    if (--wait)
      return;
    query._finishResponse(null, callback);
  };
  if (Array.isArray(data)) {
    wait += data.length;
    this.results = this._ingestSnapshots(data, finish);
    this.extra = extra;
  } else {
    for (var id in data) {
      wait++;
      var snapshot = data[id];
      var doc = this.connection.get(snapshot.c || this.collection, id);
      doc.ingestSnapshot(snapshot, finish);
    }
  }
  finish();
};
Query.prototype._ingestSnapshots = function(snapshots, finish) {
  var results = [];
  for (var i = 0; i < snapshots.length; i++) {
    var snapshot = snapshots[i];
    var doc = this.connection.get(snapshot.c || this.collection, snapshot.d);
    doc.ingestSnapshot(snapshot, finish);
    results.push(doc);
  }
  return results;
};
Query.prototype._finishResponse = function(err, callback) {
  this.emit("ready");
  this.ready = true;
  if (err) {
    this.connection._destroyQuery(this);
    if (callback)
      return callback(err);
    return this.emit("error", err);
  }
  if (callback)
    callback(null, this.results, this.extra);
};
Query.prototype._handleError = function(err) {
  this.emit("error", err);
};
Query.prototype._handleDiff = function(diff) {
  for (var i = 0; i < diff.length; i++) {
    var d = diff[i];
    if (d.type === "insert")
      d.values = this._ingestSnapshots(d.values);
  }
  for (var i = 0; i < diff.length; i++) {
    var d = diff[i];
    switch (d.type) {
      case "insert":
        var newDocs = d.values;
        Array.prototype.splice.apply(this.results, [d.index, 0].concat(newDocs));
        this.emit("insert", newDocs, d.index);
        break;
      case "remove":
        var howMany = d.howMany || 1;
        var removed = this.results.splice(d.index, howMany);
        this.emit("remove", removed, d.index);
        break;
      case "move":
        var howMany = d.howMany || 1;
        var docs = this.results.splice(d.from, howMany);
        Array.prototype.splice.apply(this.results, [d.to, 0].concat(docs));
        this.emit("move", docs, d.from, d.to);
        break;
    }
  }
  this.emit("changed", this.results);
};
Query.prototype._handleExtra = function(extra) {
  this.extra = extra;
  this.emit("extra", extra);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/snapshot-request/snapshot-request.js":
/*!**************************************************************************!*\
  !*** ../modules/sharedb/lib/client/snapshot-request/snapshot-request.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Snapshot = __webpack_require__(/*! ../../snapshot */ "../modules/sharedb/lib/snapshot.js");
var emitter = __webpack_require__(/*! ../../emitter */ "../modules/sharedb/lib/emitter.js");
module.exports = SnapshotRequest;
function SnapshotRequest(connection, requestId, collection, id, callback) {
  emitter.EventEmitter.call(this);
  if (typeof callback !== "function") {
    throw new Error("Callback is required for SnapshotRequest");
  }
  this.requestId = requestId;
  this.connection = connection;
  this.id = id;
  this.collection = collection;
  this.callback = callback;
  this.sent = false;
}
emitter.mixin(SnapshotRequest);
SnapshotRequest.prototype.send = function() {
  if (!this.connection.canSend) {
    return;
  }
  this.connection.send(this._message());
  this.sent = true;
};
SnapshotRequest.prototype._onConnectionStateChanged = function() {
  if (this.connection.canSend) {
    if (!this.sent)
      this.send();
  } else {
    this.sent = false;
  }
};
SnapshotRequest.prototype._handleResponse = function(error, message) {
  this.emit("ready");
  if (error) {
    return this.callback(error);
  }
  var metadata = message.meta ? message.meta : null;
  var snapshot = new Snapshot(this.id, message.v, message.type, message.data, metadata);
  this.callback(null, snapshot);
};


/***/ }),

/***/ "../modules/sharedb/lib/client/snapshot-request/snapshot-timestamp-request.js":
/*!************************************************************************************!*\
  !*** ../modules/sharedb/lib/client/snapshot-request/snapshot-timestamp-request.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SnapshotRequest = __webpack_require__(/*! ./snapshot-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-request.js");
var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");
module.exports = SnapshotTimestampRequest;
function SnapshotTimestampRequest(connection, requestId, collection, id, timestamp, callback) {
  SnapshotRequest.call(this, connection, requestId, collection, id, callback);
  if (!util.isValidTimestamp(timestamp)) {
    throw new Error("Snapshot timestamp must be a positive integer or null");
  }
  this.timestamp = timestamp;
}
SnapshotTimestampRequest.prototype = Object.create(SnapshotRequest.prototype);
SnapshotTimestampRequest.prototype._message = function() {
  return {
    a: "nt",
    id: this.requestId,
    c: this.collection,
    d: this.id,
    ts: this.timestamp
  };
};


/***/ }),

/***/ "../modules/sharedb/lib/client/snapshot-request/snapshot-version-request.js":
/*!**********************************************************************************!*\
  !*** ../modules/sharedb/lib/client/snapshot-request/snapshot-version-request.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SnapshotRequest = __webpack_require__(/*! ./snapshot-request */ "../modules/sharedb/lib/client/snapshot-request/snapshot-request.js");
var util = __webpack_require__(/*! ../../util */ "../modules/sharedb/lib/util.js");
module.exports = SnapshotVersionRequest;
function SnapshotVersionRequest(connection, requestId, collection, id, version, callback) {
  SnapshotRequest.call(this, connection, requestId, collection, id, callback);
  if (!util.isValidVersion(version)) {
    throw new Error("Snapshot version must be a positive integer or null");
  }
  this.version = version;
}
SnapshotVersionRequest.prototype = Object.create(SnapshotRequest.prototype);
SnapshotVersionRequest.prototype._message = function() {
  return {
    a: "nf",
    id: this.requestId,
    c: this.collection,
    d: this.id,
    v: this.version
  };
};


/***/ }),

/***/ "../modules/sharedb/lib/emitter.js":
/*!*****************************************!*\
  !*** ../modules/sharedb/lib/emitter.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var EventEmitter = (__webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter);
exports.EventEmitter = EventEmitter;
exports.mixin = mixin;
function mixin(Constructor) {
  for (var key in EventEmitter.prototype) {
    Constructor.prototype[key] = EventEmitter.prototype[key];
  }
}


/***/ }),

/***/ "../modules/sharedb/lib/error.js":
/*!***************************************!*\
  !*** ../modules/sharedb/lib/error.js ***!
  \***************************************/
/***/ ((module) => {

function ShareDBError(code, message) {
  this.code = code;
  this.message = message || "";
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ShareDBError);
  } else {
    this.stack = new Error().stack;
  }
}
ShareDBError.prototype = Object.create(Error.prototype);
ShareDBError.prototype.constructor = ShareDBError;
ShareDBError.prototype.name = "ShareDBError";
ShareDBError.CODES = {
  ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT: "ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT",
  ERR_APPLY_SNAPSHOT_NOT_PROVIDED: "ERR_APPLY_SNAPSHOT_NOT_PROVIDED",
  ERR_CLIENT_ID_BADLY_FORMED: "ERR_CLIENT_ID_BADLY_FORMED",
  ERR_CONNECTION_SEQ_INTEGER_OVERFLOW: "ERR_CONNECTION_SEQ_INTEGER_OVERFLOW",
  ERR_CONNECTION_STATE_TRANSITION_INVALID: "ERR_CONNECTION_STATE_TRANSITION_INVALID",
  ERR_DATABASE_ADAPTER_NOT_FOUND: "ERR_DATABASE_ADAPTER_NOT_FOUND",
  ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE: "ERR_DATABASE_DOES_NOT_SUPPORT_SUBSCRIBE",
  ERR_DATABASE_METHOD_NOT_IMPLEMENTED: "ERR_DATABASE_METHOD_NOT_IMPLEMENTED",
  ERR_DEFAULT_TYPE_MISMATCH: "ERR_DEFAULT_TYPE_MISMATCH",
  ERR_DOC_MISSING_VERSION: "ERR_DOC_MISSING_VERSION",
  ERR_DOC_ALREADY_CREATED: "ERR_DOC_ALREADY_CREATED",
  ERR_DOC_DOES_NOT_EXIST: "ERR_DOC_DOES_NOT_EXIST",
  ERR_DOC_TYPE_NOT_RECOGNIZED: "ERR_DOC_TYPE_NOT_RECOGNIZED",
  ERR_DOC_WAS_DELETED: "ERR_DOC_WAS_DELETED",
  ERR_INFLIGHT_OP_MISSING: "ERR_INFLIGHT_OP_MISSING",
  ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION: "ERR_INGESTED_SNAPSHOT_HAS_NO_VERSION",
  ERR_MAX_SUBMIT_RETRIES_EXCEEDED: "ERR_MAX_SUBMIT_RETRIES_EXCEEDED",
  ERR_MESSAGE_BADLY_FORMED: "ERR_MESSAGE_BADLY_FORMED",
  ERR_MILESTONE_ARGUMENT_INVALID: "ERR_MILESTONE_ARGUMENT_INVALID",
  ERR_OP_ALREADY_SUBMITTED: "ERR_OP_ALREADY_SUBMITTED",
  ERR_OP_NOT_ALLOWED_IN_PROJECTION: "ERR_OP_NOT_ALLOWED_IN_PROJECTION",
  ERR_OP_SUBMIT_REJECTED: "ERR_OP_SUBMIT_REJECTED",
  ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM: "ERR_OP_VERSION_MISMATCH_AFTER_TRANSFORM",
  ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM: "ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM",
  ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT: "ERR_OP_VERSION_NEWER_THAN_CURRENT_SNAPSHOT",
  ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED: "ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED",
  ERR_OT_OP_BADLY_FORMED: "ERR_OT_OP_BADLY_FORMED",
  ERR_OT_OP_NOT_APPLIED: "ERR_OT_OP_NOT_APPLIED",
  ERR_OT_OP_NOT_PROVIDED: "ERR_OT_OP_NOT_PROVIDED",
  ERR_PRESENCE_TRANSFORM_FAILED: "ERR_PRESENCE_TRANSFORM_FAILED",
  ERR_PROTOCOL_VERSION_NOT_SUPPORTED: "ERR_PROTOCOL_VERSION_NOT_SUPPORTED",
  ERR_QUERY_EMITTER_LISTENER_NOT_ASSIGNED: "ERR_QUERY_EMITTER_LISTENER_NOT_ASSIGNED",
  ERR_SNAPSHOT_READ_SILENT_REJECTION: "ERR_SNAPSHOT_READ_SILENT_REJECTION",
  ERR_SNAPSHOT_READS_REJECTED: "ERR_SNAPSHOT_READS_REJECTED",
  ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND: "ERR_SUBMIT_TRANSFORM_OPS_NOT_FOUND",
  ERR_TYPE_CANNOT_BE_PROJECTED: "ERR_TYPE_CANNOT_BE_PROJECTED",
  ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE: "ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE",
  ERR_UNKNOWN_ERROR: "ERR_UNKNOWN_ERROR"
};
module.exports = ShareDBError;


/***/ }),

/***/ "../modules/sharedb/lib/logger/index.js":
/*!**********************************************!*\
  !*** ../modules/sharedb/lib/logger/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Logger = __webpack_require__(/*! ./logger */ "../modules/sharedb/lib/logger/logger.js");
var logger = new Logger();
module.exports = logger;


/***/ }),

/***/ "../modules/sharedb/lib/logger/logger.js":
/*!***********************************************!*\
  !*** ../modules/sharedb/lib/logger/logger.js ***!
  \***********************************************/
/***/ ((module) => {

var SUPPORTED_METHODS = ["info", "warn", "error"];
function Logger() {
  var defaultMethods = {};
  SUPPORTED_METHODS.forEach(function(method) {
    defaultMethods[method] = console[method].bind(console);
  });
  this.setMethods(defaultMethods);
}
module.exports = Logger;
Logger.prototype.setMethods = function(overrides) {
  overrides = overrides || {};
  var logger = this;
  SUPPORTED_METHODS.forEach(function(method) {
    if (typeof overrides[method] === "function") {
      logger[method] = overrides[method];
    }
  });
};


/***/ }),

/***/ "../modules/sharedb/lib/ot.js":
/*!************************************!*\
  !*** ../modules/sharedb/lib/ot.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var types = __webpack_require__(/*! ./types */ "../modules/sharedb/lib/types.js");
var ShareDBError = __webpack_require__(/*! ./error */ "../modules/sharedb/lib/error.js");
var util = __webpack_require__(/*! ./util */ "../modules/sharedb/lib/util.js");
var ERROR_CODE = ShareDBError.CODES;
exports.checkOp = function(op) {
  if (op == null || typeof op !== "object") {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "Op must be an object");
  }
  if (op.create != null) {
    if (typeof op.create !== "object") {
      return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "Create data must be an object");
    }
    var typeName = op.create.type;
    if (typeof typeName !== "string") {
      return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "Missing create type");
    }
    var type = types.map[typeName];
    if (type == null || typeof type !== "object") {
      return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, "Unknown type");
    }
  } else if (op.del != null) {
    if (op.del !== true)
      return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "del value must be true");
  } else if (!("op" in op)) {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "Missing op, create, or del");
  }
  if (op.src != null && typeof op.src !== "string") {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "src must be a string");
  }
  if (op.seq != null && typeof op.seq !== "number") {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "seq must be a number");
  }
  if (op.src == null && op.seq != null || op.src != null && op.seq == null) {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "Both src and seq must be set together");
  }
  if (op.m != null && typeof op.m !== "object") {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_BADLY_FORMED, "op.m must be an object or null");
  }
};
exports.normalizeType = function(typeName) {
  return types.map[typeName] && types.map[typeName].uri;
};
exports.apply = function(snapshot, op) {
  if (typeof snapshot !== "object") {
    return new ShareDBError(ERROR_CODE.ERR_APPLY_SNAPSHOT_NOT_PROVIDED, "Missing snapshot");
  }
  if (snapshot.v != null && op.v != null && snapshot.v !== op.v) {
    return new ShareDBError(ERROR_CODE.ERR_APPLY_OP_VERSION_DOES_NOT_MATCH_SNAPSHOT, "Version mismatch");
  }
  if (op.create) {
    if (snapshot.type)
      return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document already exists");
    var create = op.create;
    var type = types.map[create.type];
    if (!type)
      return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, "Unknown type");
    try {
      snapshot.data = type.create(create.data);
      snapshot.type = type.uri;
      snapshot.v++;
    } catch (err2) {
      return err2;
    }
  } else if (op.del) {
    snapshot.data = void 0;
    snapshot.type = null;
    snapshot.v++;
  } else if ("op" in op) {
    var err = applyOpEdit(snapshot, op.op);
    if (err)
      return err;
    snapshot.v++;
  } else {
    snapshot.v++;
  }
};
function applyOpEdit(snapshot, edit) {
  if (!snapshot.type)
    return new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Document does not exist");
  if (edit === void 0)
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_NOT_PROVIDED, "Missing op");
  var type = types.map[snapshot.type];
  if (!type)
    return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, "Unknown type");
  try {
    snapshot.data = type.apply(snapshot.data, edit);
  } catch (err) {
    return new ShareDBError(ERROR_CODE.ERR_OT_OP_NOT_APPLIED, err.message);
  }
}
exports.transform = function(type, op, appliedOp) {
  if (op.v != null && op.v !== appliedOp.v) {
    return new ShareDBError(ERROR_CODE.ERR_OP_VERSION_MISMATCH_DURING_TRANSFORM, "Version mismatch");
  }
  if (appliedOp.del) {
    if (op.create || "op" in op) {
      return new ShareDBError(ERROR_CODE.ERR_DOC_WAS_DELETED, "Document was deleted");
    }
  } else if (appliedOp.create && ("op" in op || op.create || op.del) || "op" in appliedOp && op.create) {
    return new ShareDBError(ERROR_CODE.ERR_DOC_ALREADY_CREATED, "Document was created remotely");
  } else if ("op" in appliedOp && "op" in op) {
    if (!type)
      return new ShareDBError(ERROR_CODE.ERR_DOC_DOES_NOT_EXIST, "Document does not exist");
    if (typeof type === "string") {
      type = types.map[type];
      if (!type)
        return new ShareDBError(ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, "Unknown type");
    }
    try {
      op.op = type.transform(op.op, appliedOp.op, "left");
    } catch (err) {
      return err;
    }
  }
  if (op.v != null)
    op.v++;
};
exports.applyOps = function(snapshot, ops, options) {
  options = options || {};
  for (var index = 0; index < ops.length; index++) {
    var op = ops[index];
    if (options._normalizeLegacyJson0Ops) {
      try {
        normalizeLegacyJson0Ops(snapshot, op);
      } catch (error2) {
        return new ShareDBError(ERROR_CODE.ERR_OT_LEGACY_JSON0_OP_CANNOT_BE_NORMALIZED, "Cannot normalize legacy json0 op");
      }
    }
    snapshot.v = op.v;
    var error = exports.apply(snapshot, op);
    if (error)
      return error;
  }
};
exports.transformPresence = function(presence, op, isOwnOp) {
  var opError = this.checkOp(op);
  if (opError)
    return opError;
  var type = presence.t;
  if (typeof type === "string") {
    type = types.map[type];
  }
  if (!type)
    return { code: ERROR_CODE.ERR_DOC_TYPE_NOT_RECOGNIZED, message: "Unknown type" };
  if (!util.supportsPresence(type)) {
    return { code: ERROR_CODE.ERR_TYPE_DOES_NOT_SUPPORT_PRESENCE, message: "Type does not support presence" };
  }
  if (op.create || op.del) {
    presence.p = null;
    presence.v++;
    return;
  }
  try {
    presence.p = presence.p === null ? null : type.transformPresence(presence.p, op.op, isOwnOp);
  } catch (error) {
    return { code: ERROR_CODE.ERR_PRESENCE_TRANSFORM_FAILED, message: error.message || error };
  }
  presence.v++;
};
function normalizeLegacyJson0Ops(snapshot, json0Op) {
  if (snapshot.type !== types.defaultType.uri)
    return;
  var components = json0Op.op;
  if (!components)
    return;
  var data = snapshot.data;
  if (components.length > 1)
    data = util.clone(data);
  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    if (typeof component.lm === "string")
      component.lm = +component.lm;
    var path = component.p;
    var element = data;
    for (var j = 0; j < path.length; j++) {
      var key = path[j];
      if (Object.prototype.toString.call(element) == "[object Array]")
        path[j] = +key;
      else if (element.constructor === Object)
        path[j] = key.toString();
      element = element[key];
    }
    if (i < components.length - 1)
      data = types.defaultType.apply(data, [component]);
  }
}


/***/ }),

/***/ "../modules/sharedb/lib/snapshot.js":
/*!******************************************!*\
  !*** ../modules/sharedb/lib/snapshot.js ***!
  \******************************************/
/***/ ((module) => {

module.exports = Snapshot;
function Snapshot(id, version, type, data, meta) {
  this.id = id;
  this.v = version;
  this.type = type;
  this.data = data;
  this.m = meta;
}


/***/ }),

/***/ "../modules/sharedb/lib/types.js":
/*!***************************************!*\
  !*** ../modules/sharedb/lib/types.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.defaultType = __webpack_require__(/*! ../../ot-json0 */ "../modules/ot-json0/lib/index.js").type;
exports.map = {};
exports.register = function(type) {
  if (type.name) {
    exports.map[type.name] = type;
  }
  if (type.uri) {
    exports.map[type.uri] = type;
  }
};
exports.register(exports.defaultType);


/***/ }),

/***/ "../modules/sharedb/lib/util.js":
/*!**************************************!*\
  !*** ../modules/sharedb/lib/util.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

exports.doNothing = doNothing;
function doNothing() {
}
exports.hasKeys = function(object) {
  for (var key in object)
    return true;
  return false;
};
exports.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};
exports.isValidVersion = function(version) {
  if (version === null)
    return true;
  return exports.isInteger(version) && version >= 0;
};
exports.isValidTimestamp = function(timestamp) {
  return exports.isValidVersion(timestamp);
};
exports.MAX_SAFE_INTEGER = 9007199254740991;
exports.dig = function() {
  var obj = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var key = arguments[i];
    obj = obj[key] || (i === arguments.length - 1 ? void 0 : {});
  }
  return obj;
};
exports.digOrCreate = function() {
  var obj = arguments[0];
  var createCallback = arguments[arguments.length - 1];
  for (var i = 1; i < arguments.length - 1; i++) {
    var key = arguments[i];
    obj = obj[key] || (obj[key] = i === arguments.length - 2 ? createCallback() : {});
  }
  return obj;
};
exports.digAndRemove = function() {
  var obj = arguments[0];
  var objects = [obj];
  for (var i = 1; i < arguments.length - 1; i++) {
    var key = arguments[i];
    if (!obj.hasOwnProperty(key))
      break;
    obj = obj[key];
    objects.push(obj);
  }
  ;
  for (var i = objects.length - 1; i >= 0; i--) {
    var parent = objects[i];
    var key = arguments[i + 1];
    var child = parent[key];
    if (i === objects.length - 1 || !exports.hasKeys(child))
      delete parent[key];
  }
};
exports.supportsPresence = function(type) {
  return type && typeof type.transformPresence === "function";
};
exports.callEach = function(callbacks, error) {
  var called = false;
  callbacks.forEach(function(callback) {
    if (callback) {
      callback(error);
      called = true;
    }
  });
  return called;
};
exports.truthy = function(arg) {
  return !!arg;
};
exports.nextTick = function(callback) {
  if ( true && ({"env":{"NODE_ENV":"development"}}).nextTick) {
    return ({"env":{"NODE_ENV":"development"}}).nextTick.apply(null, arguments);
  }
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }
  setTimeout(function() {
    callback.apply(null, args);
  });
};
exports.clone = function(obj) {
  return obj === void 0 ? void 0 : JSON.parse(JSON.stringify(obj));
};


/***/ }),

/***/ "../modules/text-diff-binding/index.js":
/*!*********************************************!*\
  !*** ../modules/text-diff-binding/index.js ***!
  \*********************************************/
/***/ ((module) => {

module.exports = TextDiffBinding;
function TextDiffBinding(element) {
  this.element = element;
}
TextDiffBinding.prototype._get = TextDiffBinding.prototype._insert = TextDiffBinding.prototype._remove = function() {
  throw new Error("`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined.");
};
TextDiffBinding.prototype._getElementValue = function() {
  var value = this.element.value;
  return value.replace(/\r\n/g, "\n");
};
TextDiffBinding.prototype._getInputEnd = function(previous, value) {
  if (this.element !== document.activeElement) {
    return null;
  }
  var end = value.length - this.element.selectionStart;
  if (end === 0) {
    return end;
  }
  if (previous.slice(previous.length - end) !== value.slice(value.length - end)) {
    return null;
  }
  return end;
};
TextDiffBinding.prototype.onInput = function() {
  var previous = this._get();
  var value = this._getElementValue();
  console.log("value=", value);
  if (previous === value) {
    return;
  }
  var start = 0;
  var end = this._getInputEnd(previous, value);
  if (end === null) {
    while (previous.charAt(start) === value.charAt(start)) {
      start++;
    }
    end = 0;
    while (previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) && end + start < previous.length && end + start < value.length) {
      end++;
    }
  } else {
    while (previous.charAt(start) === value.charAt(start) && start + end < previous.length && start + end < value.length) {
      start++;
    }
  }
  if (previous.length !== start + end) {
    var removed = previous.slice(start, previous.length - end);
    this._remove(start, removed);
  }
  if (value.length !== start + end) {
    var inserted = value.slice(start, value.length - end);
    this._insert(start, inserted);
  }
};
TextDiffBinding.prototype.onInsert = function(index, length) {
  this._transformSelectionAndUpdate(index, length, insertCursorTransform);
};
function insertCursorTransform(index, length, cursor) {
  return index < cursor ? cursor + length : cursor;
}
TextDiffBinding.prototype.onRemove = function(index, length) {
  this._transformSelectionAndUpdate(index, length, removeCursorTransform);
};
function removeCursorTransform(index, length, cursor) {
  console.log("index=", index);
  console.log("length=", length);
  console.log("cursor=", cursor);
  return index < cursor ? cursor - Math.min(length, cursor - index) : cursor;
}
TextDiffBinding.prototype._transformSelectionAndUpdate = function(index, length, transformCursor) {
  if (document.activeElement === this.element) {
    var selectionStart = transformCursor(index, length, this.element.selectionStart);
    var selectionEnd = transformCursor(index, length, this.element.selectionEnd);
    var selectionDirection = this.element.selectionDirection;
    this.update();
    this.element.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  } else {
    this.update();
  }
};
TextDiffBinding.prototype.update = function() {
  var value = this._get();
  if (this._getElementValue() === value) {
    return;
  }
  this.element.value = value;
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var sharedb = __webpack_require__(/*! ../../modules/sharedb/lib/client */ "../modules/sharedb/lib/client/index.js");
var ReconnectingWebSocket = (__webpack_require__(/*! ../../modules/reconnecting-websocket */ "../modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js")["default"]);
var StringBinding = __webpack_require__(/*! ../../modules/sharedb-string-binding */ "../modules/sharedb-string-binding/index.js");
var socket = new ReconnectingWebSocket("ws://localhost:8099/");
var connection = new sharedb.Connection(socket);
var element = document.querySelector("textarea");
var statusSpan = document.getElementById("status-span");
statusSpan.innerHTML = "Not Connected";
element.style.backgroundColor = "gray";
socket.addEventListener("open", function() {
  statusSpan.innerHTML = "Connected";
  element.style.backgroundColor = "white";
});
socket.addEventListener("close", function() {
  statusSpan.innerHTML = "Closed";
  element.style.backgroundColor = "gray";
});
socket.addEventListener("error", function() {
  statusSpan.innerHTML = "Error";
  element.style.backgroundColor = "red";
});
var doc = connection.get("examples", "textarea");
doc.subscribe(function(err) {
  if (err) {
    throw err;
  }
  var binding = new StringBinding(element, doc, ["content"]);
  binding.setup();
});


/***/ }),

/***/ "../modules/async/dist/async.mjs":
/*!***************************************!*\
  !*** ../modules/async/dist/async.mjs ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "all": () => (/* binding */ every$1),
/* harmony export */   "allLimit": () => (/* binding */ everyLimit$1),
/* harmony export */   "allSeries": () => (/* binding */ everySeries$1),
/* harmony export */   "any": () => (/* binding */ some$1),
/* harmony export */   "anyLimit": () => (/* binding */ someLimit$1),
/* harmony export */   "anySeries": () => (/* binding */ someSeries$1),
/* harmony export */   "apply": () => (/* binding */ apply),
/* harmony export */   "applyEach": () => (/* binding */ applyEach$1),
/* harmony export */   "applyEachSeries": () => (/* binding */ applyEachSeries),
/* harmony export */   "asyncify": () => (/* binding */ asyncify),
/* harmony export */   "auto": () => (/* binding */ auto),
/* harmony export */   "autoInject": () => (/* binding */ autoInject),
/* harmony export */   "cargo": () => (/* binding */ cargo),
/* harmony export */   "cargoQueue": () => (/* binding */ cargo$1),
/* harmony export */   "compose": () => (/* binding */ compose),
/* harmony export */   "concat": () => (/* binding */ concat$1),
/* harmony export */   "concatLimit": () => (/* binding */ concatLimit$1),
/* harmony export */   "concatSeries": () => (/* binding */ concatSeries$1),
/* harmony export */   "constant": () => (/* binding */ constant),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "detect": () => (/* binding */ detect$1),
/* harmony export */   "detectLimit": () => (/* binding */ detectLimit$1),
/* harmony export */   "detectSeries": () => (/* binding */ detectSeries$1),
/* harmony export */   "dir": () => (/* binding */ dir),
/* harmony export */   "doDuring": () => (/* binding */ doWhilst$1),
/* harmony export */   "doUntil": () => (/* binding */ doUntil),
/* harmony export */   "doWhilst": () => (/* binding */ doWhilst$1),
/* harmony export */   "during": () => (/* binding */ whilst$1),
/* harmony export */   "each": () => (/* binding */ each),
/* harmony export */   "eachLimit": () => (/* binding */ eachLimit$2),
/* harmony export */   "eachOf": () => (/* binding */ eachOf$1),
/* harmony export */   "eachOfLimit": () => (/* binding */ eachOfLimit$2),
/* harmony export */   "eachOfSeries": () => (/* binding */ eachOfSeries$1),
/* harmony export */   "eachSeries": () => (/* binding */ eachSeries$1),
/* harmony export */   "ensureAsync": () => (/* binding */ ensureAsync),
/* harmony export */   "every": () => (/* binding */ every$1),
/* harmony export */   "everyLimit": () => (/* binding */ everyLimit$1),
/* harmony export */   "everySeries": () => (/* binding */ everySeries$1),
/* harmony export */   "filter": () => (/* binding */ filter$1),
/* harmony export */   "filterLimit": () => (/* binding */ filterLimit$1),
/* harmony export */   "filterSeries": () => (/* binding */ filterSeries$1),
/* harmony export */   "find": () => (/* binding */ detect$1),
/* harmony export */   "findLimit": () => (/* binding */ detectLimit$1),
/* harmony export */   "findSeries": () => (/* binding */ detectSeries$1),
/* harmony export */   "flatMap": () => (/* binding */ concat$1),
/* harmony export */   "flatMapLimit": () => (/* binding */ concatLimit$1),
/* harmony export */   "flatMapSeries": () => (/* binding */ concatSeries$1),
/* harmony export */   "foldl": () => (/* binding */ reduce$1),
/* harmony export */   "foldr": () => (/* binding */ reduceRight),
/* harmony export */   "forEach": () => (/* binding */ each),
/* harmony export */   "forEachLimit": () => (/* binding */ eachLimit$2),
/* harmony export */   "forEachOf": () => (/* binding */ eachOf$1),
/* harmony export */   "forEachOfLimit": () => (/* binding */ eachOfLimit$2),
/* harmony export */   "forEachOfSeries": () => (/* binding */ eachOfSeries$1),
/* harmony export */   "forEachSeries": () => (/* binding */ eachSeries$1),
/* harmony export */   "forever": () => (/* binding */ forever$1),
/* harmony export */   "groupBy": () => (/* binding */ groupBy),
/* harmony export */   "groupByLimit": () => (/* binding */ groupByLimit$1),
/* harmony export */   "groupBySeries": () => (/* binding */ groupBySeries),
/* harmony export */   "inject": () => (/* binding */ reduce$1),
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "map": () => (/* binding */ map$1),
/* harmony export */   "mapLimit": () => (/* binding */ mapLimit$1),
/* harmony export */   "mapSeries": () => (/* binding */ mapSeries$1),
/* harmony export */   "mapValues": () => (/* binding */ mapValues),
/* harmony export */   "mapValuesLimit": () => (/* binding */ mapValuesLimit$1),
/* harmony export */   "mapValuesSeries": () => (/* binding */ mapValuesSeries),
/* harmony export */   "memoize": () => (/* binding */ memoize),
/* harmony export */   "nextTick": () => (/* binding */ nextTick),
/* harmony export */   "parallel": () => (/* binding */ parallel),
/* harmony export */   "parallelLimit": () => (/* binding */ parallelLimit),
/* harmony export */   "priorityQueue": () => (/* binding */ priorityQueue),
/* harmony export */   "queue": () => (/* binding */ queue$1),
/* harmony export */   "race": () => (/* binding */ race$1),
/* harmony export */   "reduce": () => (/* binding */ reduce$1),
/* harmony export */   "reduceRight": () => (/* binding */ reduceRight),
/* harmony export */   "reflect": () => (/* binding */ reflect),
/* harmony export */   "reflectAll": () => (/* binding */ reflectAll),
/* harmony export */   "reject": () => (/* binding */ reject$2),
/* harmony export */   "rejectLimit": () => (/* binding */ rejectLimit$1),
/* harmony export */   "rejectSeries": () => (/* binding */ rejectSeries$1),
/* harmony export */   "retry": () => (/* binding */ retry),
/* harmony export */   "retryable": () => (/* binding */ retryable),
/* harmony export */   "select": () => (/* binding */ filter$1),
/* harmony export */   "selectLimit": () => (/* binding */ filterLimit$1),
/* harmony export */   "selectSeries": () => (/* binding */ filterSeries$1),
/* harmony export */   "seq": () => (/* binding */ seq),
/* harmony export */   "series": () => (/* binding */ series),
/* harmony export */   "setImmediate": () => (/* binding */ setImmediate$1),
/* harmony export */   "some": () => (/* binding */ some$1),
/* harmony export */   "someLimit": () => (/* binding */ someLimit$1),
/* harmony export */   "someSeries": () => (/* binding */ someSeries$1),
/* harmony export */   "sortBy": () => (/* binding */ sortBy$1),
/* harmony export */   "timeout": () => (/* binding */ timeout),
/* harmony export */   "times": () => (/* binding */ times),
/* harmony export */   "timesLimit": () => (/* binding */ timesLimit),
/* harmony export */   "timesSeries": () => (/* binding */ timesSeries),
/* harmony export */   "transform": () => (/* binding */ transform),
/* harmony export */   "tryEach": () => (/* binding */ tryEach$1),
/* harmony export */   "unmemoize": () => (/* binding */ unmemoize),
/* harmony export */   "until": () => (/* binding */ until),
/* harmony export */   "waterfall": () => (/* binding */ waterfall$1),
/* harmony export */   "whilst": () => (/* binding */ whilst$1),
/* harmony export */   "wrapSync": () => (/* binding */ asyncify)
/* harmony export */ });
function apply(fn, ...args) {
  return (...callArgs) => fn(...args, ...callArgs);
}
function initialParams(fn) {
  return function(...args) {
    var callback = args.pop();
    return fn.call(this, args, callback);
  };
}
var hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
var hasNextTick =  true && typeof ({"env":{"NODE_ENV":"development"}}).nextTick === "function";
function fallback(fn) {
  setTimeout(fn, 0);
}
function wrap(defer) {
  return (fn, ...args) => defer(() => fn(...args));
}
var _defer;
if (hasQueueMicrotask) {
  _defer = queueMicrotask;
} else if (hasSetImmediate) {
  _defer = setImmediate;
} else if (hasNextTick) {
  _defer = ({"env":{"NODE_ENV":"development"}}).nextTick;
} else {
  _defer = fallback;
}
var setImmediate$1 = wrap(_defer);
function asyncify(func) {
  if (isAsync(func)) {
    return function(...args) {
      const callback = args.pop();
      const promise = func.apply(this, args);
      return handlePromise(promise, callback);
    };
  }
  return initialParams(function(args, callback) {
    var result;
    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    if (result && typeof result.then === "function") {
      return handlePromise(result, callback);
    } else {
      callback(null, result);
    }
  });
}
function handlePromise(promise, callback) {
  return promise.then((value) => {
    invokeCallback(callback, null, value);
  }, (err) => {
    invokeCallback(callback, err && err.message ? err : new Error(err));
  });
}
function invokeCallback(callback, error, value) {
  try {
    callback(error, value);
  } catch (err) {
    setImmediate$1((e) => {
      throw e;
    }, err);
  }
}
function isAsync(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
}
function isAsyncGenerator(fn) {
  return fn[Symbol.toStringTag] === "AsyncGenerator";
}
function isAsyncIterable(obj) {
  return typeof obj[Symbol.asyncIterator] === "function";
}
function wrapAsync(asyncFn) {
  if (typeof asyncFn !== "function")
    throw new Error("expected a function");
  return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}
function awaitify(asyncFn, arity = asyncFn.length) {
  if (!arity)
    throw new Error("arity is undefined");
  function awaitable(...args) {
    if (typeof args[arity - 1] === "function") {
      return asyncFn.apply(this, args);
    }
    return new Promise((resolve, reject2) => {
      args[arity - 1] = (err, ...cbArgs) => {
        if (err)
          return reject2(err);
        resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
      };
      asyncFn.apply(this, args);
    });
  }
  return awaitable;
}
function applyEach(eachfn) {
  return function applyEach2(fns, ...callArgs) {
    const go = awaitify(function(callback) {
      var that = this;
      return eachfn(fns, (fn, cb) => {
        wrapAsync(fn).apply(that, callArgs.concat(cb));
      }, callback);
    });
    return go;
  };
}
function _asyncMap(eachfn, arr, iteratee, callback) {
  arr = arr || [];
  var results = [];
  var counter = 0;
  var _iteratee = wrapAsync(iteratee);
  return eachfn(arr, (value, _, iterCb) => {
    var index2 = counter++;
    _iteratee(value, (err, v) => {
      results[index2] = v;
      iterCb(err);
    });
  }, (err) => {
    callback(err, results);
  });
}
function isArrayLike(value) {
  return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
}
const breakLoop = {};
function once(fn) {
  function wrapper(...args) {
    if (fn === null)
      return;
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  }
  Object.assign(wrapper, fn);
  return wrapper;
}
function getIterator(coll) {
  return coll[Symbol.iterator] && coll[Symbol.iterator]();
}
function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? { value: coll[i], key: i } : null;
  };
}
function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done)
      return null;
    i++;
    return { value: item.value, key: i };
  };
}
function createObjectIterator(obj) {
  var okeys = obj ? Object.keys(obj) : [];
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];
    if (key === "__proto__") {
      return next();
    }
    return i < len ? { value: obj[key], key } : null;
  };
}
function createIterator(coll) {
  if (isArrayLike(coll)) {
    return createArrayIterator(coll);
  }
  var iterator = getIterator(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
function onlyOnce(fn) {
  return function(...args) {
    if (fn === null)
      throw new Error("Callback was already called.");
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  };
}
function asyncEachOfLimit(generator, limit, iteratee, callback) {
  let done = false;
  let canceled = false;
  let awaiting = false;
  let running = 0;
  let idx = 0;
  function replenish() {
    if (running >= limit || awaiting || done)
      return;
    awaiting = true;
    generator.next().then(({ value, done: iterDone }) => {
      if (canceled || done)
        return;
      awaiting = false;
      if (iterDone) {
        done = true;
        if (running <= 0) {
          callback(null);
        }
        return;
      }
      running++;
      iteratee(value, idx, iterateeCallback);
      idx++;
      replenish();
    }).catch(handleError);
  }
  function iterateeCallback(err, result) {
    running -= 1;
    if (canceled)
      return;
    if (err)
      return handleError(err);
    if (err === false) {
      done = true;
      canceled = true;
      return;
    }
    if (result === breakLoop || done && running <= 0) {
      done = true;
      return callback(null);
    }
    replenish();
  }
  function handleError(err) {
    if (canceled)
      return;
    awaiting = false;
    done = true;
    callback(err);
  }
  replenish();
}
var eachOfLimit = (limit) => {
  return (obj, iteratee, callback) => {
    callback = once(callback);
    if (limit <= 0) {
      throw new RangeError("concurrency limit cannot be less than 1");
    }
    if (!obj) {
      return callback(null);
    }
    if (isAsyncGenerator(obj)) {
      return asyncEachOfLimit(obj, limit, iteratee, callback);
    }
    if (isAsyncIterable(obj)) {
      return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
    }
    var nextElem = createIterator(obj);
    var done = false;
    var canceled = false;
    var running = 0;
    var looping = false;
    function iterateeCallback(err, value) {
      if (canceled)
        return;
      running -= 1;
      if (err) {
        done = true;
        callback(err);
      } else if (err === false) {
        done = true;
        canceled = true;
      } else if (value === breakLoop || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }
    function replenish() {
      looping = true;
      while (running < limit && !done) {
        var elem = nextElem();
        if (elem === null) {
          done = true;
          if (running <= 0) {
            callback(null);
          }
          return;
        }
        running += 1;
        iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
      }
      looping = false;
    }
    replenish();
  };
};
function eachOfLimit$1(coll, limit, iteratee, callback) {
  return eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
}
var eachOfLimit$2 = awaitify(eachOfLimit$1, 4);
function eachOfArrayLike(coll, iteratee, callback) {
  callback = once(callback);
  var index2 = 0, completed = 0, { length } = coll, canceled = false;
  if (length === 0) {
    callback(null);
  }
  function iteratorCallback(err, value) {
    if (err === false) {
      canceled = true;
    }
    if (canceled === true)
      return;
    if (err) {
      callback(err);
    } else if (++completed === length || value === breakLoop) {
      callback(null);
    }
  }
  for (; index2 < length; index2++) {
    iteratee(coll[index2], index2, onlyOnce(iteratorCallback));
  }
}
function eachOfGeneric(coll, iteratee, callback) {
  return eachOfLimit$2(coll, Infinity, iteratee, callback);
}
function eachOf(coll, iteratee, callback) {
  var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
  return eachOfImplementation(coll, wrapAsync(iteratee), callback);
}
var eachOf$1 = awaitify(eachOf, 3);
function map(coll, iteratee, callback) {
  return _asyncMap(eachOf$1, coll, iteratee, callback);
}
var map$1 = awaitify(map, 3);
var applyEach$1 = applyEach(map$1);
function eachOfSeries(coll, iteratee, callback) {
  return eachOfLimit$2(coll, 1, iteratee, callback);
}
var eachOfSeries$1 = awaitify(eachOfSeries, 3);
function mapSeries(coll, iteratee, callback) {
  return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
}
var mapSeries$1 = awaitify(mapSeries, 3);
var applyEachSeries = applyEach(mapSeries$1);
const PROMISE_SYMBOL = Symbol("promiseCallback");
function promiseCallback() {
  let resolve, reject2;
  function callback(err, ...args) {
    if (err)
      return reject2(err);
    resolve(args.length > 1 ? args : args[0]);
  }
  callback[PROMISE_SYMBOL] = new Promise((res, rej) => {
    resolve = res, reject2 = rej;
  });
  return callback;
}
function auto(tasks, concurrency, callback) {
  if (typeof concurrency !== "number") {
    callback = concurrency;
    concurrency = null;
  }
  callback = once(callback || promiseCallback());
  var numTasks = Object.keys(tasks).length;
  if (!numTasks) {
    return callback(null);
  }
  if (!concurrency) {
    concurrency = numTasks;
  }
  var results = {};
  var runningTasks = 0;
  var canceled = false;
  var hasError = false;
  var listeners = /* @__PURE__ */ Object.create(null);
  var readyTasks = [];
  var readyToCheck = [];
  var uncheckedDependencies = {};
  Object.keys(tasks).forEach((key) => {
    var task = tasks[key];
    if (!Array.isArray(task)) {
      enqueueTask(key, [task]);
      readyToCheck.push(key);
      return;
    }
    var dependencies = task.slice(0, task.length - 1);
    var remainingDependencies = dependencies.length;
    if (remainingDependencies === 0) {
      enqueueTask(key, task);
      readyToCheck.push(key);
      return;
    }
    uncheckedDependencies[key] = remainingDependencies;
    dependencies.forEach((dependencyName) => {
      if (!tasks[dependencyName]) {
        throw new Error("async.auto task `" + key + "` has a non-existent dependency `" + dependencyName + "` in " + dependencies.join(", "));
      }
      addListener(dependencyName, () => {
        remainingDependencies--;
        if (remainingDependencies === 0) {
          enqueueTask(key, task);
        }
      });
    });
  });
  checkForDeadlocks();
  processQueue();
  function enqueueTask(key, task) {
    readyTasks.push(() => runTask(key, task));
  }
  function processQueue() {
    if (canceled)
      return;
    if (readyTasks.length === 0 && runningTasks === 0) {
      return callback(null, results);
    }
    while (readyTasks.length && runningTasks < concurrency) {
      var run = readyTasks.shift();
      run();
    }
  }
  function addListener(taskName, fn) {
    var taskListeners = listeners[taskName];
    if (!taskListeners) {
      taskListeners = listeners[taskName] = [];
    }
    taskListeners.push(fn);
  }
  function taskComplete(taskName) {
    var taskListeners = listeners[taskName] || [];
    taskListeners.forEach((fn) => fn());
    processQueue();
  }
  function runTask(key, task) {
    if (hasError)
      return;
    var taskCallback = onlyOnce((err, ...result) => {
      runningTasks--;
      if (err === false) {
        canceled = true;
        return;
      }
      if (result.length < 2) {
        [result] = result;
      }
      if (err) {
        var safeResults = {};
        Object.keys(results).forEach((rkey) => {
          safeResults[rkey] = results[rkey];
        });
        safeResults[key] = result;
        hasError = true;
        listeners = /* @__PURE__ */ Object.create(null);
        if (canceled)
          return;
        callback(err, safeResults);
      } else {
        results[key] = result;
        taskComplete(key);
      }
    });
    runningTasks++;
    var taskFn = wrapAsync(task[task.length - 1]);
    if (task.length > 1) {
      taskFn(results, taskCallback);
    } else {
      taskFn(taskCallback);
    }
  }
  function checkForDeadlocks() {
    var currentTask;
    var counter = 0;
    while (readyToCheck.length) {
      currentTask = readyToCheck.pop();
      counter++;
      getDependents(currentTask).forEach((dependent) => {
        if (--uncheckedDependencies[dependent] === 0) {
          readyToCheck.push(dependent);
        }
      });
    }
    if (counter !== numTasks) {
      throw new Error("async.auto cannot execute tasks due to a recursive dependency");
    }
  }
  function getDependents(taskName) {
    var result = [];
    Object.keys(tasks).forEach((key) => {
      const task = tasks[key];
      if (Array.isArray(task) && task.indexOf(taskName) >= 0) {
        result.push(key);
      }
    });
    return result;
  }
  return callback[PROMISE_SYMBOL];
}
var FN_ARGS = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;
var ARROW_FN_ARGS = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
function stripComments(string) {
  let stripped = "";
  let index2 = 0;
  let endBlockComment = string.indexOf("*/");
  while (index2 < string.length) {
    if (string[index2] === "/" && string[index2 + 1] === "/") {
      let endIndex = string.indexOf("\n", index2);
      index2 = endIndex === -1 ? string.length : endIndex;
    } else if (endBlockComment !== -1 && string[index2] === "/" && string[index2 + 1] === "*") {
      let endIndex = string.indexOf("*/", index2);
      if (endIndex !== -1) {
        index2 = endIndex + 2;
        endBlockComment = string.indexOf("*/", index2);
      } else {
        stripped += string[index2];
        index2++;
      }
    } else {
      stripped += string[index2];
      index2++;
    }
  }
  return stripped;
}
function parseParams(func) {
  const src = stripComments(func.toString());
  let match = src.match(FN_ARGS);
  if (!match) {
    match = src.match(ARROW_FN_ARGS);
  }
  if (!match)
    throw new Error("could not parse args in autoInject\nSource:\n" + src);
  let [, args] = match;
  return args.replace(/\s/g, "").split(FN_ARG_SPLIT).map((arg) => arg.replace(FN_ARG, "").trim());
}
function autoInject(tasks, callback) {
  var newTasks = {};
  Object.keys(tasks).forEach((key) => {
    var taskFn = tasks[key];
    var params;
    var fnIsAsync = isAsync(taskFn);
    var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;
    if (Array.isArray(taskFn)) {
      params = [...taskFn];
      taskFn = params.pop();
      newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
    } else if (hasNoDeps) {
      newTasks[key] = taskFn;
    } else {
      params = parseParams(taskFn);
      if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
        throw new Error("autoInject task functions require explicit parameters.");
      }
      if (!fnIsAsync)
        params.pop();
      newTasks[key] = params.concat(newTask);
    }
    function newTask(results, taskCb) {
      var newArgs = params.map((name) => results[name]);
      newArgs.push(taskCb);
      wrapAsync(taskFn)(...newArgs);
    }
  });
  return auto(newTasks, callback);
}
class DLL {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }
  removeLink(node) {
    if (node.prev)
      node.prev.next = node.next;
    else
      this.head = node.next;
    if (node.next)
      node.next.prev = node.prev;
    else
      this.tail = node.prev;
    node.prev = node.next = null;
    this.length -= 1;
    return node;
  }
  empty() {
    while (this.head)
      this.shift();
    return this;
  }
  insertAfter(node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next)
      node.next.prev = newNode;
    else
      this.tail = newNode;
    node.next = newNode;
    this.length += 1;
  }
  insertBefore(node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev)
      node.prev.next = newNode;
    else
      this.head = newNode;
    node.prev = newNode;
    this.length += 1;
  }
  unshift(node) {
    if (this.head)
      this.insertBefore(this.head, node);
    else
      setInitial(this, node);
  }
  push(node) {
    if (this.tail)
      this.insertAfter(this.tail, node);
    else
      setInitial(this, node);
  }
  shift() {
    return this.head && this.removeLink(this.head);
  }
  pop() {
    return this.tail && this.removeLink(this.tail);
  }
  toArray() {
    return [...this];
  }
  *[Symbol.iterator]() {
    var cur = this.head;
    while (cur) {
      yield cur.data;
      cur = cur.next;
    }
  }
  remove(testFn) {
    var curr = this.head;
    while (curr) {
      var { next } = curr;
      if (testFn(curr)) {
        this.removeLink(curr);
      }
      curr = next;
    }
    return this;
  }
}
function setInitial(dll, node) {
  dll.length = 1;
  dll.head = dll.tail = node;
}
function queue(worker, concurrency, payload) {
  if (concurrency == null) {
    concurrency = 1;
  } else if (concurrency === 0) {
    throw new RangeError("Concurrency must not be zero");
  }
  var _worker = wrapAsync(worker);
  var numRunning = 0;
  var workersList = [];
  const events = {
    error: [],
    drain: [],
    saturated: [],
    unsaturated: [],
    empty: []
  };
  function on(event, handler) {
    events[event].push(handler);
  }
  function once2(event, handler) {
    const handleAndRemove = (...args) => {
      off(event, handleAndRemove);
      handler(...args);
    };
    events[event].push(handleAndRemove);
  }
  function off(event, handler) {
    if (!event)
      return Object.keys(events).forEach((ev) => events[ev] = []);
    if (!handler)
      return events[event] = [];
    events[event] = events[event].filter((ev) => ev !== handler);
  }
  function trigger(event, ...args) {
    events[event].forEach((handler) => handler(...args));
  }
  var processingScheduled = false;
  function _insert(data, insertAtFront, rejectOnError, callback) {
    if (callback != null && typeof callback !== "function") {
      throw new Error("task callback must be a function");
    }
    q.started = true;
    var res, rej;
    function promiseCallback2(err, ...args) {
      if (err)
        return rejectOnError ? rej(err) : res();
      if (args.length <= 1)
        return res(args[0]);
      res(args);
    }
    var item = {
      data,
      callback: rejectOnError ? promiseCallback2 : callback || promiseCallback2
    };
    if (insertAtFront) {
      q._tasks.unshift(item);
    } else {
      q._tasks.push(item);
    }
    if (!processingScheduled) {
      processingScheduled = true;
      setImmediate$1(() => {
        processingScheduled = false;
        q.process();
      });
    }
    if (rejectOnError || !callback) {
      return new Promise((resolve, reject2) => {
        res = resolve;
        rej = reject2;
      });
    }
  }
  function _createCB(tasks) {
    return function(err, ...args) {
      numRunning -= 1;
      for (var i = 0, l = tasks.length; i < l; i++) {
        var task = tasks[i];
        var index2 = workersList.indexOf(task);
        if (index2 === 0) {
          workersList.shift();
        } else if (index2 > 0) {
          workersList.splice(index2, 1);
        }
        task.callback(err, ...args);
        if (err != null) {
          trigger("error", err, task.data);
        }
      }
      if (numRunning <= q.concurrency - q.buffer) {
        trigger("unsaturated");
      }
      if (q.idle()) {
        trigger("drain");
      }
      q.process();
    };
  }
  function _maybeDrain(data) {
    if (data.length === 0 && q.idle()) {
      setImmediate$1(() => trigger("drain"));
      return true;
    }
    return false;
  }
  const eventMethod = (name) => (handler) => {
    if (!handler) {
      return new Promise((resolve, reject2) => {
        once2(name, (err, data) => {
          if (err)
            return reject2(err);
          resolve(data);
        });
      });
    }
    off(name);
    on(name, handler);
  };
  var isProcessing = false;
  var q = {
    _tasks: new DLL(),
    *[Symbol.iterator]() {
      yield* q._tasks[Symbol.iterator]();
    },
    concurrency,
    payload,
    buffer: concurrency / 4,
    started: false,
    paused: false,
    push(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, false, false, callback));
      }
      return _insert(data, false, false, callback);
    },
    pushAsync(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, false, true, callback));
      }
      return _insert(data, false, true, callback);
    },
    kill() {
      off();
      q._tasks.empty();
    },
    unshift(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, true, false, callback));
      }
      return _insert(data, true, false, callback);
    },
    unshiftAsync(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, true, true, callback));
      }
      return _insert(data, true, true, callback);
    },
    remove(testFn) {
      q._tasks.remove(testFn);
    },
    process() {
      if (isProcessing) {
        return;
      }
      isProcessing = true;
      while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
        var tasks = [], data = [];
        var l = q._tasks.length;
        if (q.payload)
          l = Math.min(l, q.payload);
        for (var i = 0; i < l; i++) {
          var node = q._tasks.shift();
          tasks.push(node);
          workersList.push(node);
          data.push(node.data);
        }
        numRunning += 1;
        if (q._tasks.length === 0) {
          trigger("empty");
        }
        if (numRunning === q.concurrency) {
          trigger("saturated");
        }
        var cb = onlyOnce(_createCB(tasks));
        _worker(data, cb);
      }
      isProcessing = false;
    },
    length() {
      return q._tasks.length;
    },
    running() {
      return numRunning;
    },
    workersList() {
      return workersList;
    },
    idle() {
      return q._tasks.length + numRunning === 0;
    },
    pause() {
      q.paused = true;
    },
    resume() {
      if (q.paused === false) {
        return;
      }
      q.paused = false;
      setImmediate$1(q.process);
    }
  };
  Object.defineProperties(q, {
    saturated: {
      writable: false,
      value: eventMethod("saturated")
    },
    unsaturated: {
      writable: false,
      value: eventMethod("unsaturated")
    },
    empty: {
      writable: false,
      value: eventMethod("empty")
    },
    drain: {
      writable: false,
      value: eventMethod("drain")
    },
    error: {
      writable: false,
      value: eventMethod("error")
    }
  });
  return q;
}
function cargo(worker, payload) {
  return queue(worker, 1, payload);
}
function cargo$1(worker, concurrency, payload) {
  return queue(worker, concurrency, payload);
}
function reduce(coll, memo, iteratee, callback) {
  callback = once(callback);
  var _iteratee = wrapAsync(iteratee);
  return eachOfSeries$1(coll, (x, i, iterCb) => {
    _iteratee(memo, x, (err, v) => {
      memo = v;
      iterCb(err);
    });
  }, (err) => callback(err, memo));
}
var reduce$1 = awaitify(reduce, 4);
function seq(...functions) {
  var _functions = functions.map(wrapAsync);
  return function(...args) {
    var that = this;
    var cb = args[args.length - 1];
    if (typeof cb == "function") {
      args.pop();
    } else {
      cb = promiseCallback();
    }
    reduce$1(_functions, args, (newargs, fn, iterCb) => {
      fn.apply(that, newargs.concat((err, ...nextargs) => {
        iterCb(err, nextargs);
      }));
    }, (err, results) => cb(err, ...results));
    return cb[PROMISE_SYMBOL];
  };
}
function compose(...args) {
  return seq(...args.reverse());
}
function mapLimit(coll, limit, iteratee, callback) {
  return _asyncMap(eachOfLimit(limit), coll, iteratee, callback);
}
var mapLimit$1 = awaitify(mapLimit, 4);
function concatLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, ...args) => {
      if (err)
        return iterCb(err);
      return iterCb(err, args);
    });
  }, (err, mapResults) => {
    var result = [];
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        result = result.concat(...mapResults[i]);
      }
    }
    return callback(err, result);
  });
}
var concatLimit$1 = awaitify(concatLimit, 4);
function concat(coll, iteratee, callback) {
  return concatLimit$1(coll, Infinity, iteratee, callback);
}
var concat$1 = awaitify(concat, 3);
function concatSeries(coll, iteratee, callback) {
  return concatLimit$1(coll, 1, iteratee, callback);
}
var concatSeries$1 = awaitify(concatSeries, 3);
function constant(...args) {
  return function(...ignoredArgs) {
    var callback = ignoredArgs.pop();
    return callback(null, ...args);
  };
}
function _createTester(check, getResult) {
  return (eachfn, arr, _iteratee, cb) => {
    var testPassed = false;
    var testResult;
    const iteratee = wrapAsync(_iteratee);
    eachfn(arr, (value, _, callback) => {
      iteratee(value, (err, result) => {
        if (err || err === false)
          return callback(err);
        if (check(result) && !testResult) {
          testPassed = true;
          testResult = getResult(true, value);
          return callback(null, breakLoop);
        }
        callback();
      });
    }, (err) => {
      if (err)
        return cb(err);
      cb(null, testPassed ? testResult : getResult(false));
    });
  };
}
function detect(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
}
var detect$1 = awaitify(detect, 3);
function detectLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit(limit), coll, iteratee, callback);
}
var detectLimit$1 = awaitify(detectLimit, 4);
function detectSeries(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit(1), coll, iteratee, callback);
}
var detectSeries$1 = awaitify(detectSeries, 3);
function consoleFunc(name) {
  return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
    if (typeof console === "object") {
      if (err) {
        if (console.error) {
          console.error(err);
        }
      } else if (console[name]) {
        resultArgs.forEach((x) => console[name](x));
      }
    }
  });
}
var dir = consoleFunc("dir");
function doWhilst(iteratee, test, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results;
  function next(err, ...args) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    results = args;
    _test(...args, check);
  }
  function check(err, truth) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    if (!truth)
      return callback(null, ...results);
    _fn(next);
  }
  return check(null, true);
}
var doWhilst$1 = awaitify(doWhilst, 3);
function doUntil(iteratee, test, callback) {
  const _test = wrapAsync(test);
  return doWhilst$1(iteratee, (...args) => {
    const cb = args.pop();
    _test(...args, (err, truth) => cb(err, !truth));
  }, callback);
}
function _withoutIndex(iteratee) {
  return (value, index2, callback) => iteratee(value, callback);
}
function eachLimit(coll, iteratee, callback) {
  return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
var each = awaitify(eachLimit, 3);
function eachLimit$1(coll, limit, iteratee, callback) {
  return eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
var eachLimit$2 = awaitify(eachLimit$1, 4);
function eachSeries(coll, iteratee, callback) {
  return eachLimit$2(coll, 1, iteratee, callback);
}
var eachSeries$1 = awaitify(eachSeries, 3);
function ensureAsync(fn) {
  if (isAsync(fn))
    return fn;
  return function(...args) {
    var callback = args.pop();
    var sync = true;
    args.push((...innerArgs) => {
      if (sync) {
        setImmediate$1(() => callback(...innerArgs));
      } else {
        callback(...innerArgs);
      }
    });
    fn.apply(this, args);
    sync = false;
  };
}
function every(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOf$1, coll, iteratee, callback);
}
var every$1 = awaitify(every, 3);
function everyLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfLimit(limit), coll, iteratee, callback);
}
var everyLimit$1 = awaitify(everyLimit, 4);
function everySeries(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfSeries$1, coll, iteratee, callback);
}
var everySeries$1 = awaitify(everySeries, 3);
function filterArray(eachfn, arr, iteratee, callback) {
  var truthValues = new Array(arr.length);
  eachfn(arr, (x, index2, iterCb) => {
    iteratee(x, (err, v) => {
      truthValues[index2] = !!v;
      iterCb(err);
    });
  }, (err) => {
    if (err)
      return callback(err);
    var results = [];
    for (var i = 0; i < arr.length; i++) {
      if (truthValues[i])
        results.push(arr[i]);
    }
    callback(null, results);
  });
}
function filterGeneric(eachfn, coll, iteratee, callback) {
  var results = [];
  eachfn(coll, (x, index2, iterCb) => {
    iteratee(x, (err, v) => {
      if (err)
        return iterCb(err);
      if (v) {
        results.push({ index: index2, value: x });
      }
      iterCb(err);
    });
  }, (err) => {
    if (err)
      return callback(err);
    callback(null, results.sort((a, b) => a.index - b.index).map((v) => v.value));
  });
}
function _filter(eachfn, coll, iteratee, callback) {
  var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
  return filter2(eachfn, coll, wrapAsync(iteratee), callback);
}
function filter(coll, iteratee, callback) {
  return _filter(eachOf$1, coll, iteratee, callback);
}
var filter$1 = awaitify(filter, 3);
function filterLimit(coll, limit, iteratee, callback) {
  return _filter(eachOfLimit(limit), coll, iteratee, callback);
}
var filterLimit$1 = awaitify(filterLimit, 4);
function filterSeries(coll, iteratee, callback) {
  return _filter(eachOfSeries$1, coll, iteratee, callback);
}
var filterSeries$1 = awaitify(filterSeries, 3);
function forever(fn, errback) {
  var done = onlyOnce(errback);
  var task = wrapAsync(ensureAsync(fn));
  function next(err) {
    if (err)
      return done(err);
    if (err === false)
      return;
    task(next);
  }
  return next();
}
var forever$1 = awaitify(forever, 2);
function groupByLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, key) => {
      if (err)
        return iterCb(err);
      return iterCb(err, { key, val });
    });
  }, (err, mapResults) => {
    var result = {};
    var { hasOwnProperty } = Object.prototype;
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        var { key } = mapResults[i];
        var { val } = mapResults[i];
        if (hasOwnProperty.call(result, key)) {
          result[key].push(val);
        } else {
          result[key] = [val];
        }
      }
    }
    return callback(err, result);
  });
}
var groupByLimit$1 = awaitify(groupByLimit, 4);
function groupBy(coll, iteratee, callback) {
  return groupByLimit$1(coll, Infinity, iteratee, callback);
}
function groupBySeries(coll, iteratee, callback) {
  return groupByLimit$1(coll, 1, iteratee, callback);
}
var log = consoleFunc("log");
function mapValuesLimit(obj, limit, iteratee, callback) {
  callback = once(callback);
  var newObj = {};
  var _iteratee = wrapAsync(iteratee);
  return eachOfLimit(limit)(obj, (val, key, next) => {
    _iteratee(val, key, (err, result) => {
      if (err)
        return next(err);
      newObj[key] = result;
      next(err);
    });
  }, (err) => callback(err, newObj));
}
var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);
function mapValues(obj, iteratee, callback) {
  return mapValuesLimit$1(obj, Infinity, iteratee, callback);
}
function mapValuesSeries(obj, iteratee, callback) {
  return mapValuesLimit$1(obj, 1, iteratee, callback);
}
function memoize(fn, hasher = (v) => v) {
  var memo = /* @__PURE__ */ Object.create(null);
  var queues = /* @__PURE__ */ Object.create(null);
  var _fn = wrapAsync(fn);
  var memoized = initialParams((args, callback) => {
    var key = hasher(...args);
    if (key in memo) {
      setImmediate$1(() => callback(null, ...memo[key]));
    } else if (key in queues) {
      queues[key].push(callback);
    } else {
      queues[key] = [callback];
      _fn(...args, (err, ...resultArgs) => {
        if (!err) {
          memo[key] = resultArgs;
        }
        var q = queues[key];
        delete queues[key];
        for (var i = 0, l = q.length; i < l; i++) {
          q[i](err, ...resultArgs);
        }
      });
    }
  });
  memoized.memo = memo;
  memoized.unmemoized = fn;
  return memoized;
}
var _defer$1;
if (hasNextTick) {
  _defer$1 = ({"env":{"NODE_ENV":"development"}}).nextTick;
} else if (hasSetImmediate) {
  _defer$1 = setImmediate;
} else {
  _defer$1 = fallback;
}
var nextTick = wrap(_defer$1);
var _parallel = awaitify((eachfn, tasks, callback) => {
  var results = isArrayLike(tasks) ? [] : {};
  eachfn(tasks, (task, key, taskCb) => {
    wrapAsync(task)((err, ...result) => {
      if (result.length < 2) {
        [result] = result;
      }
      results[key] = result;
      taskCb(err);
    });
  }, (err) => callback(err, results));
}, 3);
function parallel(tasks, callback) {
  return _parallel(eachOf$1, tasks, callback);
}
function parallelLimit(tasks, limit, callback) {
  return _parallel(eachOfLimit(limit), tasks, callback);
}
function queue$1(worker, concurrency) {
  var _worker = wrapAsync(worker);
  return queue((items, cb) => {
    _worker(items[0], cb);
  }, concurrency, 1);
}
class Heap {
  constructor() {
    this.heap = [];
    this.pushCount = Number.MIN_SAFE_INTEGER;
  }
  get length() {
    return this.heap.length;
  }
  empty() {
    this.heap = [];
    return this;
  }
  percUp(index2) {
    let p;
    while (index2 > 0 && smaller(this.heap[index2], this.heap[p = parent(index2)])) {
      let t = this.heap[index2];
      this.heap[index2] = this.heap[p];
      this.heap[p] = t;
      index2 = p;
    }
  }
  percDown(index2) {
    let l;
    while ((l = leftChi(index2)) < this.heap.length) {
      if (l + 1 < this.heap.length && smaller(this.heap[l + 1], this.heap[l])) {
        l = l + 1;
      }
      if (smaller(this.heap[index2], this.heap[l])) {
        break;
      }
      let t = this.heap[index2];
      this.heap[index2] = this.heap[l];
      this.heap[l] = t;
      index2 = l;
    }
  }
  push(node) {
    node.pushCount = ++this.pushCount;
    this.heap.push(node);
    this.percUp(this.heap.length - 1);
  }
  unshift(node) {
    return this.heap.push(node);
  }
  shift() {
    let [top] = this.heap;
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.percDown(0);
    return top;
  }
  toArray() {
    return [...this];
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.heap.length; i++) {
      yield this.heap[i].data;
    }
  }
  remove(testFn) {
    let j = 0;
    for (let i = 0; i < this.heap.length; i++) {
      if (!testFn(this.heap[i])) {
        this.heap[j] = this.heap[i];
        j++;
      }
    }
    this.heap.splice(j);
    for (let i = parent(this.heap.length - 1); i >= 0; i--) {
      this.percDown(i);
    }
    return this;
  }
}
function leftChi(i) {
  return (i << 1) + 1;
}
function parent(i) {
  return (i + 1 >> 1) - 1;
}
function smaller(x, y) {
  if (x.priority !== y.priority) {
    return x.priority < y.priority;
  } else {
    return x.pushCount < y.pushCount;
  }
}
function priorityQueue(worker, concurrency) {
  var q = queue$1(worker, concurrency);
  var processingScheduled = false;
  q._tasks = new Heap();
  q.push = function(data, priority = 0, callback = () => {
  }) {
    if (typeof callback !== "function") {
      throw new Error("task callback must be a function");
    }
    q.started = true;
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (data.length === 0 && q.idle()) {
      return setImmediate$1(() => q.drain());
    }
    for (var i = 0, l = data.length; i < l; i++) {
      var item = {
        data: data[i],
        priority,
        callback
      };
      q._tasks.push(item);
    }
    if (!processingScheduled) {
      processingScheduled = true;
      setImmediate$1(() => {
        processingScheduled = false;
        q.process();
      });
    }
  };
  delete q.unshift;
  return q;
}
function race(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks))
    return callback(new TypeError("First argument to race must be an array of functions"));
  if (!tasks.length)
    return callback();
  for (var i = 0, l = tasks.length; i < l; i++) {
    wrapAsync(tasks[i])(callback);
  }
}
var race$1 = awaitify(race, 2);
function reduceRight(array, memo, iteratee, callback) {
  var reversed = [...array].reverse();
  return reduce$1(reversed, memo, iteratee, callback);
}
function reflect(fn) {
  var _fn = wrapAsync(fn);
  return initialParams(function reflectOn(args, reflectCallback) {
    args.push((error, ...cbArgs) => {
      let retVal = {};
      if (error) {
        retVal.error = error;
      }
      if (cbArgs.length > 0) {
        var value = cbArgs;
        if (cbArgs.length <= 1) {
          [value] = cbArgs;
        }
        retVal.value = value;
      }
      reflectCallback(null, retVal);
    });
    return _fn.apply(this, args);
  });
}
function reflectAll(tasks) {
  var results;
  if (Array.isArray(tasks)) {
    results = tasks.map(reflect);
  } else {
    results = {};
    Object.keys(tasks).forEach((key) => {
      results[key] = reflect.call(this, tasks[key]);
    });
  }
  return results;
}
function reject(eachfn, arr, _iteratee, callback) {
  const iteratee = wrapAsync(_iteratee);
  return _filter(eachfn, arr, (value, cb) => {
    iteratee(value, (err, v) => {
      cb(err, !v);
    });
  }, callback);
}
function reject$1(coll, iteratee, callback) {
  return reject(eachOf$1, coll, iteratee, callback);
}
var reject$2 = awaitify(reject$1, 3);
function rejectLimit(coll, limit, iteratee, callback) {
  return reject(eachOfLimit(limit), coll, iteratee, callback);
}
var rejectLimit$1 = awaitify(rejectLimit, 4);
function rejectSeries(coll, iteratee, callback) {
  return reject(eachOfSeries$1, coll, iteratee, callback);
}
var rejectSeries$1 = awaitify(rejectSeries, 3);
function constant$1(value) {
  return function() {
    return value;
  };
}
const DEFAULT_TIMES = 5;
const DEFAULT_INTERVAL = 0;
function retry(opts, task, callback) {
  var options = {
    times: DEFAULT_TIMES,
    intervalFunc: constant$1(DEFAULT_INTERVAL)
  };
  if (arguments.length < 3 && typeof opts === "function") {
    callback = task || promiseCallback();
    task = opts;
  } else {
    parseTimes(options, opts);
    callback = callback || promiseCallback();
  }
  if (typeof task !== "function") {
    throw new Error("Invalid arguments for async.retry");
  }
  var _task = wrapAsync(task);
  var attempt = 1;
  function retryAttempt() {
    _task((err, ...args) => {
      if (err === false)
        return;
      if (err && attempt++ < options.times && (typeof options.errorFilter != "function" || options.errorFilter(err))) {
        setTimeout(retryAttempt, options.intervalFunc(attempt - 1));
      } else {
        callback(err, ...args);
      }
    });
  }
  retryAttempt();
  return callback[PROMISE_SYMBOL];
}
function parseTimes(acc, t) {
  if (typeof t === "object") {
    acc.times = +t.times || DEFAULT_TIMES;
    acc.intervalFunc = typeof t.interval === "function" ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
    acc.errorFilter = t.errorFilter;
  } else if (typeof t === "number" || typeof t === "string") {
    acc.times = +t || DEFAULT_TIMES;
  } else {
    throw new Error("Invalid arguments for async.retry");
  }
}
function retryable(opts, task) {
  if (!task) {
    task = opts;
    opts = null;
  }
  let arity = opts && opts.arity || task.length;
  if (isAsync(task)) {
    arity += 1;
  }
  var _task = wrapAsync(task);
  return initialParams((args, callback) => {
    if (args.length < arity - 1 || callback == null) {
      args.push(callback);
      callback = promiseCallback();
    }
    function taskFn(cb) {
      _task(...args, cb);
    }
    if (opts)
      retry(opts, taskFn, callback);
    else
      retry(taskFn, callback);
    return callback[PROMISE_SYMBOL];
  });
}
function series(tasks, callback) {
  return _parallel(eachOfSeries$1, tasks, callback);
}
function some(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOf$1, coll, iteratee, callback);
}
var some$1 = awaitify(some, 3);
function someLimit(coll, limit, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfLimit(limit), coll, iteratee, callback);
}
var someLimit$1 = awaitify(someLimit, 4);
function someSeries(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfSeries$1, coll, iteratee, callback);
}
var someSeries$1 = awaitify(someSeries, 3);
function sortBy(coll, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return map$1(coll, (x, iterCb) => {
    _iteratee(x, (err, criteria) => {
      if (err)
        return iterCb(err);
      iterCb(err, { value: x, criteria });
    });
  }, (err, results) => {
    if (err)
      return callback(err);
    callback(null, results.sort(comparator).map((v) => v.value));
  });
  function comparator(left, right) {
    var a = left.criteria, b = right.criteria;
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
var sortBy$1 = awaitify(sortBy, 3);
function timeout(asyncFn, milliseconds, info) {
  var fn = wrapAsync(asyncFn);
  return initialParams((args, callback) => {
    var timedOut = false;
    var timer;
    function timeoutCallback() {
      var name = asyncFn.name || "anonymous";
      var error = new Error('Callback function "' + name + '" timed out.');
      error.code = "ETIMEDOUT";
      if (info) {
        error.info = info;
      }
      timedOut = true;
      callback(error);
    }
    args.push((...cbArgs) => {
      if (!timedOut) {
        callback(...cbArgs);
        clearTimeout(timer);
      }
    });
    timer = setTimeout(timeoutCallback, milliseconds);
    fn(...args);
  });
}
function range(size) {
  var result = Array(size);
  while (size--) {
    result[size] = size;
  }
  return result;
}
function timesLimit(count, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(range(count), limit, _iteratee, callback);
}
function times(n, iteratee, callback) {
  return timesLimit(n, Infinity, iteratee, callback);
}
function timesSeries(n, iteratee, callback) {
  return timesLimit(n, 1, iteratee, callback);
}
function transform(coll, accumulator, iteratee, callback) {
  if (arguments.length <= 3 && typeof accumulator === "function") {
    callback = iteratee;
    iteratee = accumulator;
    accumulator = Array.isArray(coll) ? [] : {};
  }
  callback = once(callback || promiseCallback());
  var _iteratee = wrapAsync(iteratee);
  eachOf$1(coll, (v, k, cb) => {
    _iteratee(accumulator, v, k, cb);
  }, (err) => callback(err, accumulator));
  return callback[PROMISE_SYMBOL];
}
function tryEach(tasks, callback) {
  var error = null;
  var result;
  return eachSeries$1(tasks, (task, taskCb) => {
    wrapAsync(task)((err, ...args) => {
      if (err === false)
        return taskCb(err);
      if (args.length < 2) {
        [result] = args;
      } else {
        result = args;
      }
      error = err;
      taskCb(err ? null : {});
    });
  }, () => callback(error, result));
}
var tryEach$1 = awaitify(tryEach);
function unmemoize(fn) {
  return (...args) => {
    return (fn.unmemoized || fn)(...args);
  };
}
function whilst(test, iteratee, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results = [];
  function next(err, ...rest) {
    if (err)
      return callback(err);
    results = rest;
    if (err === false)
      return;
    _test(check);
  }
  function check(err, truth) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    if (!truth)
      return callback(null, ...results);
    _fn(next);
  }
  return _test(check);
}
var whilst$1 = awaitify(whilst, 3);
function until(test, iteratee, callback) {
  const _test = wrapAsync(test);
  return whilst$1((cb) => _test((err, truth) => cb(err, !truth)), iteratee, callback);
}
function waterfall(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks))
    return callback(new Error("First argument to waterfall must be an array of functions"));
  if (!tasks.length)
    return callback();
  var taskIndex = 0;
  function nextTask(args) {
    var task = wrapAsync(tasks[taskIndex++]);
    task(...args, onlyOnce(next));
  }
  function next(err, ...args) {
    if (err === false)
      return;
    if (err || taskIndex === tasks.length) {
      return callback(err, ...args);
    }
    nextTask(args);
  }
  nextTask([]);
}
var waterfall$1 = awaitify(waterfall);
var index = {
  apply,
  applyEach: applyEach$1,
  applyEachSeries,
  asyncify,
  auto,
  autoInject,
  cargo,
  cargoQueue: cargo$1,
  compose,
  concat: concat$1,
  concatLimit: concatLimit$1,
  concatSeries: concatSeries$1,
  constant,
  detect: detect$1,
  detectLimit: detectLimit$1,
  detectSeries: detectSeries$1,
  dir,
  doUntil,
  doWhilst: doWhilst$1,
  each,
  eachLimit: eachLimit$2,
  eachOf: eachOf$1,
  eachOfLimit: eachOfLimit$2,
  eachOfSeries: eachOfSeries$1,
  eachSeries: eachSeries$1,
  ensureAsync,
  every: every$1,
  everyLimit: everyLimit$1,
  everySeries: everySeries$1,
  filter: filter$1,
  filterLimit: filterLimit$1,
  filterSeries: filterSeries$1,
  forever: forever$1,
  groupBy,
  groupByLimit: groupByLimit$1,
  groupBySeries,
  log,
  map: map$1,
  mapLimit: mapLimit$1,
  mapSeries: mapSeries$1,
  mapValues,
  mapValuesLimit: mapValuesLimit$1,
  mapValuesSeries,
  memoize,
  nextTick,
  parallel,
  parallelLimit,
  priorityQueue,
  queue: queue$1,
  race: race$1,
  reduce: reduce$1,
  reduceRight,
  reflect,
  reflectAll,
  reject: reject$2,
  rejectLimit: rejectLimit$1,
  rejectSeries: rejectSeries$1,
  retry,
  retryable,
  seq,
  series,
  setImmediate: setImmediate$1,
  some: some$1,
  someLimit: someLimit$1,
  someSeries: someSeries$1,
  sortBy: sortBy$1,
  timeout,
  times,
  timesLimit,
  timesSeries,
  transform,
  tryEach: tryEach$1,
  unmemoize,
  until,
  waterfall: waterfall$1,
  whilst: whilst$1,
  all: every$1,
  allLimit: everyLimit$1,
  allSeries: everySeries$1,
  any: some$1,
  anyLimit: someLimit$1,
  anySeries: someSeries$1,
  find: detect$1,
  findLimit: detectLimit$1,
  findSeries: detectSeries$1,
  flatMap: concat$1,
  flatMapLimit: concatLimit$1,
  flatMapSeries: concatSeries$1,
  forEach: each,
  forEachSeries: eachSeries$1,
  forEachLimit: eachLimit$2,
  forEachOf: eachOf$1,
  forEachOfSeries: eachOfSeries$1,
  forEachOfLimit: eachOfLimit$2,
  inject: reduce$1,
  foldl: reduce$1,
  foldr: reduceRight,
  select: filter$1,
  selectLimit: filterLimit$1,
  selectSeries: filterSeries$1,
  wrapSync: asyncify,
  during: whilst$1,
  doDuring: doWhilst$1
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("index." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("4f7289c017d79210eb20")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "sharedb-example-textarea:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatesharedb_example_textarea"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksharedb_example_textarea"] = self["webpackChunksharedb_example_textarea"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__.O(undefined, ["defaultVendors-node_modules_babel_polyfill_lib_index_js-node_modules_events_events_js"], () => (__webpack_require__("./node_modules/@babel/polyfill/lib/index.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["defaultVendors-node_modules_babel_polyfill_lib_index_js-node_modules_events_events_js"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map