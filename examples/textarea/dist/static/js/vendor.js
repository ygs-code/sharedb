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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
}
          var ReactVersion = '18.1.0';

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

// ATTENTION

var REACT_ELEMENT_TYPE =  Symbol.for('react.element');
var REACT_PORTAL_TYPE =  Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE =  Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE =  Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE =  Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE =  Symbol.for('react.provider');
var REACT_CONTEXT_TYPE =  Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE =  Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE =  Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE =  Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE =  Symbol.for('react.memo');
var REACT_LAZY_TYPE =  Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE =  Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL =  Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  transition: null
};

var ReactCurrentActQueue = {
  current: null,
  // Used to reproduce behavior of `batchedUpdates` in legacy mode.
  isBatchingLegacy: false,
  didScheduleLegacyUpdate: false
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var ReactDebugCurrentFrame = {};
var currentExtraStackFrame = null;
function setExtraStackFrame(stack) {
  {
    currentExtraStackFrame = stack;
  }
}

{
  ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
    {
      currentExtraStackFrame = stack;
    }
  }; // Stack implementation injected by the current renderer.


  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = ''; // Add an extra top frame while an element is being validated

    if (currentExtraStackFrame) {
      stack += currentExtraStackFrame;
    } // Delegate to the injected renderer-specific implementation


    var impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner
};

{
  ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
  ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
}

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      printWarning('warn', format, args);
    }
  }
}
function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + "." + callerName;

    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }

    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}
/**
 * This is the abstract API for an update queue.
 */


var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var assign = Object.assign;

var emptyObject = {};

{
  Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */


function Component(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
  if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null) {
    throw new Error('setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };

  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

        return undefined;
      }
    });
  };

  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };

  {
    Object.seal(refObject);
  }

  return refObject;
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    }
  };

  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */

function cloneElement(element, config, children) {
  if (element === null || element === undefined) {
    throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
  }

  var propName; // Original props are copied

  var props = assign({}, element.props); // Reserved names are extracted

  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = key.replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */


var didWarnAboutMaps = false;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return text.replace(userProvidedKeyEscapeRegex, '$&/');
}
/**
 * Generate a key string that identifies a element within a set.
 *
 * @param {*} element A element that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */


function getElementKey(element, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof element === 'object' && element !== null && element.key != null) {
    // Explicit key
    {
      checkKeyStringCoercion(element.key);
    }

    return escape('' + element.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}

function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;

      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }

    }
  }

  if (invokeCallback) {
    var _child = children;
    var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows:

    var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

    if (isArray(mappedChild)) {
      var escapedChildKey = '';

      if (childKey != null) {
        escapedChildKey = escapeUserProvidedKey(childKey) + '/';
      }

      mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        {
          // The `if` statement here prevents auto-disabling of the safe
          // coercion ESLint rule, so we must manually disable it below.
          // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
          if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
            checkKeyStringCoercion(mappedChild.key);
          }
        }

        mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
        mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
        // eslint-disable-next-line react-internal/safe-string-coercion
        escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
      }

      array.push(mappedChild);
    }

    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getElementKey(child, i);
      subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
    }
  } else {
    var iteratorFn = getIteratorFn(children);

    if (typeof iteratorFn === 'function') {
      var iterableChildren = children;

      {
        // Warn about using Maps as children
        if (iteratorFn === iterableChildren.entries) {
          if (!didWarnAboutMaps) {
            warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
          }

          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(iterableChildren);
      var step;
      var ii = 0;

      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getElementKey(child, ii++);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else if (type === 'object') {
      // eslint-disable-next-line react-internal/safe-string-coercion
      var childrenString = String(children);
      throw new Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). " + 'If you meant to render a collection of children, use an array ' + 'instead.');
    }
  }

  return subtreeCount;
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  var count = 0;
  mapIntoArray(children, result, '', '', function (child) {
    return func.call(context, child, count++);
  });
  return result;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


function countChildren(children) {
  var n = 0;
  mapChildren(children, function () {
    n++; // Don't return anything
  });
  return n;
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  mapChildren(children, function () {
    forEachFunc.apply(this, arguments); // Don't return anything.
  }, forEachContext);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */


function toArray(children) {
  return mapChildren(children, function (child) {
    return child;
  }) || [];
}
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  if (!isValidElement(children)) {
    throw new Error('React.Children.only expected to receive a single React element child.');
  }

  return children;
}

function createContext(defaultValue) {
  // TODO: Second argument used to be an optional `calculateChangedBits`
  // function. Warn to reserve for future use?
  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null,
    // Add these to use same hidden class in VM as ServerContext
    _defaultValue: null,
    _globalName: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;
  var hasWarnedAboutDisplayNameOnConsumer = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context
    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      },
      displayName: {
        get: function () {
          return context.displayName;
        },
        set: function (displayName) {
          if (!hasWarnedAboutDisplayNameOnConsumer) {
            warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

            hasWarnedAboutDisplayNameOnConsumer = true;
          }
        }
      }
    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

var Uninitialized = -1;
var Pending = 0;
var Resolved = 1;
var Rejected = 2;

function lazyInitializer(payload) {
  if (payload._status === Uninitialized) {
    var ctor = payload._result;
    var thenable = ctor(); // Transition to the next state.
    // This might throw either because it's missing or throws. If so, we treat it
    // as still uninitialized and try again next time. Which is the same as what
    // happens if the ctor or any wrappers processing the ctor throws. This might
    // end up fixing it if the resolution was a concurrency bug.

    thenable.then(function (moduleObject) {
      if (payload._status === Pending || payload._status === Uninitialized) {
        // Transition to the next state.
        var resolved = payload;
        resolved._status = Resolved;
        resolved._result = moduleObject;
      }
    }, function (error) {
      if (payload._status === Pending || payload._status === Uninitialized) {
        // Transition to the next state.
        var rejected = payload;
        rejected._status = Rejected;
        rejected._result = error;
      }
    });

    if (payload._status === Uninitialized) {
      // In case, we're still uninitialized, then we're waiting for the thenable
      // to resolve. Set it as pending in the meantime.
      var pending = payload;
      pending._status = Pending;
      pending._result = thenable;
    }
  }

  if (payload._status === Resolved) {
    var moduleObject = payload._result;

    {
      if (moduleObject === undefined) {
        error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
        'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))\n\n" + 'Did you accidentally put curly braces around the import?', moduleObject);
      }
    }

    {
      if (!('default' in moduleObject)) {
        error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
        'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
      }
    }

    return moduleObject.default;
  } else {
    throw payload._result;
  }
}

function lazy(ctor) {
  var payload = {
    // We use these fields to store the result.
    _status: Uninitialized,
    _result: ctor
  };
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer
  };

  {
    // In production, this would just set it on the object.
    var defaultProps;
    var propTypes; // $FlowFixMe

    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          defaultProps = newDefaultProps; // Match production behavior more closely:
          // $FlowFixMe

          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          propTypes = newPropTypes; // Match production behavior more closely:
          // $FlowFixMe

          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      if (render.length !== 0 && render.length !== 2) {
        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
      }
    }
  }

  var elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };

  {
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name; // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.forwardRef((props, ref) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.

        if (!render.name && !render.displayName) {
          render.displayName = name;
        }
      }
    });
  }

  return elementType;
}

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }

  var elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };

  {
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name; // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.memo((props) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.

        if (!type.name && !type.displayName) {
          type.displayName = name;
        }
      }
    });
  }

  return elementType;
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;

  {
    if (dispatcher === null) {
      error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.');
    }
  } // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.


  return dispatcher;
}
function useContext(Context) {
  var dispatcher = resolveDispatcher();

  {
    // TODO: add a more generic warning for invalid values.
    if (Context._context !== undefined) {
      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.

      if (realContext.Consumer === Context) {
        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }

  return dispatcher.useContext(Context);
}
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
function useEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function useInsertionEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useInsertionEffect(create, deps);
}
function useLayoutEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
function useCallback(callback, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
function useMemo(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
function useImperativeHandle(ref, create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}
function useTransition() {
  var dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
}
function useDeferredValue(value) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useDeferredValue(value);
}
function useId() {
  var dispatcher = resolveDispatcher();
  return dispatcher.useId();
}
function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher$1.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher$1.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var loggedTypeFailures = {};
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      setExtraStackFrame(stack);
    } else {
      setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentNameFromType(ReactCurrentOwner.current.type);

    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }

  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }

  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }

  return '';
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

    if (parentName) {
      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
    }
  }

  return info;
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }

  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.

  var childOwner = '';

  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
  }

  {
    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];

      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);

    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;

        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  if (!validType) {
    var info = '';

    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString;

    if (type === null) {
      typeString = 'null';
    } else if (isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    {
      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }
  }

  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.

  if (element == null) {
    return element;
  } // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)


  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
var didWarnAboutDeprecatedCreateFactory = false;
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;

  {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;

      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
    } // Legacy hook: remove it


    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);

  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }

  validatePropTypes(newElement);
  return newElement;
}

function startTransition(scope, options) {
  var prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = {};
  var currentTransition = ReactCurrentBatchConfig.transition;

  {
    ReactCurrentBatchConfig.transition._updatedFibers = new Set();
  }

  try {
    scope();
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition;

    {
      if (prevTransition === null && currentTransition._updatedFibers) {
        var updatedFibersCount = currentTransition._updatedFibers.size;

        if (updatedFibersCount > 10) {
          warn('Detected a large number of updates inside startTransition. ' + 'If this is due to a subscription please re-write it to use React provided hooks. ' + 'Otherwise concurrent mode guarantees are off the table.');
        }

        currentTransition._updatedFibers.clear();
      }
    }
  }
}

var didWarnAboutMessageChannel = false;
var enqueueTaskImpl = null;
function enqueueTask(task) {
  if (enqueueTaskImpl === null) {
    try {
      // read require off the module object to get around the bundlers.
      // we don't want them to detect a require and bundle a Node polyfill.
      var requireString = ('require' + Math.random()).slice(0, 7);
      var nodeRequire = module && module[requireString]; // assuming we're in node, let's try to get node's
      // version of setImmediate, bypassing fake timers if any.

      enqueueTaskImpl = nodeRequire.call(module, 'timers').setImmediate;
    } catch (_err) {
      // we're in a browser
      // we can't use regular timers because they may still be faked
      // so we try MessageChannel+postMessage instead
      enqueueTaskImpl = function (callback) {
        {
          if (didWarnAboutMessageChannel === false) {
            didWarnAboutMessageChannel = true;

            if (typeof MessageChannel === 'undefined') {
              error('This browser does not have a MessageChannel implementation, ' + 'so enqueuing tasks via await act(async () => ...) will fail. ' + 'Please file an issue at https://github.com/facebook/react/issues ' + 'if you encounter this warning.');
            }
          }
        }

        var channel = new MessageChannel();
        channel.port1.onmessage = callback;
        channel.port2.postMessage(undefined);
      };
    }
  }

  return enqueueTaskImpl(task);
}

var actScopeDepth = 0;
var didWarnNoAwaitAct = false;
function act(callback) {
  {
    // `act` calls can be nested, so we track the depth. This represents the
    // number of `act` scopes on the stack.
    var prevActScopeDepth = actScopeDepth;
    actScopeDepth++;

    if (ReactCurrentActQueue.current === null) {
      // This is the outermost `act` scope. Initialize the queue. The reconciler
      // will detect the queue and use it instead of Scheduler.
      ReactCurrentActQueue.current = [];
    }

    var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
    var result;

    try {
      // Used to reproduce behavior of `batchedUpdates` in legacy mode. Only
      // set to `true` while the given callback is executed, not for updates
      // triggered during an async event, because this is how the legacy
      // implementation of `act` behaved.
      ReactCurrentActQueue.isBatchingLegacy = true;
      result = callback(); // Replicate behavior of original `act` implementation in legacy mode,
      // which flushed updates immediately after the scope function exits, even
      // if it's an async function.

      if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
        var queue = ReactCurrentActQueue.current;

        if (queue !== null) {
          ReactCurrentActQueue.didScheduleLegacyUpdate = false;
          flushActQueue(queue);
        }
      }
    } catch (error) {
      popActScope(prevActScopeDepth);
      throw error;
    } finally {
      ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
    }

    if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
      var thenableResult = result; // The callback is an async function (i.e. returned a promise). Wait
      // for it to resolve before exiting the current scope.

      var wasAwaited = false;
      var thenable = {
        then: function (resolve, reject) {
          wasAwaited = true;
          thenableResult.then(function (returnValue) {
            popActScope(prevActScopeDepth);

            if (actScopeDepth === 0) {
              // We've exited the outermost act scope. Recursively flush the
              // queue until there's no remaining work.
              recursivelyFlushAsyncActWork(returnValue, resolve, reject);
            } else {
              resolve(returnValue);
            }
          }, function (error) {
            // The callback threw an error.
            popActScope(prevActScopeDepth);
            reject(error);
          });
        }
      };

      {
        if (!didWarnNoAwaitAct && typeof Promise !== 'undefined') {
          // eslint-disable-next-line no-undef
          Promise.resolve().then(function () {}).then(function () {
            if (!wasAwaited) {
              didWarnNoAwaitAct = true;

              error('You called act(async () => ...) without await. ' + 'This could lead to unexpected testing behaviour, ' + 'interleaving multiple act calls and mixing their ' + 'scopes. ' + 'You should - await act(async () => ...);');
            }
          });
        }
      }

      return thenable;
    } else {
      var returnValue = result; // The callback is not an async function. Exit the current scope
      // immediately, without awaiting.

      popActScope(prevActScopeDepth);

      if (actScopeDepth === 0) {
        // Exiting the outermost act scope. Flush the queue.
        var _queue = ReactCurrentActQueue.current;

        if (_queue !== null) {
          flushActQueue(_queue);
          ReactCurrentActQueue.current = null;
        } // Return a thenable. If the user awaits it, we'll flush again in
        // case additional work was scheduled by a microtask.


        var _thenable = {
          then: function (resolve, reject) {
            // Confirm we haven't re-entered another `act` scope, in case
            // the user does something weird like await the thenable
            // multiple times.
            if (ReactCurrentActQueue.current === null) {
              // Recursively flush the queue until there's no remaining work.
              ReactCurrentActQueue.current = [];
              recursivelyFlushAsyncActWork(returnValue, resolve, reject);
            } else {
              resolve(returnValue);
            }
          }
        };
        return _thenable;
      } else {
        // Since we're inside a nested `act` scope, the returned thenable
        // immediately resolves. The outer scope will flush the queue.
        var _thenable2 = {
          then: function (resolve, reject) {
            resolve(returnValue);
          }
        };
        return _thenable2;
      }
    }
  }
}

function popActScope(prevActScopeDepth) {
  {
    if (prevActScopeDepth !== actScopeDepth - 1) {
      error('You seem to have overlapping act() calls, this is not supported. ' + 'Be sure to await previous act() calls before making a new one. ');
    }

    actScopeDepth = prevActScopeDepth;
  }
}

function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
  {
    var queue = ReactCurrentActQueue.current;

    if (queue !== null) {
      try {
        flushActQueue(queue);
        enqueueTask(function () {
          if (queue.length === 0) {
            // No additional work was scheduled. Finish.
            ReactCurrentActQueue.current = null;
            resolve(returnValue);
          } else {
            // Keep flushing work until there's none left.
            recursivelyFlushAsyncActWork(returnValue, resolve, reject);
          }
        });
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(returnValue);
    }
  }
}

var isFlushing = false;

function flushActQueue(queue) {
  {
    if (!isFlushing) {
      // Prevent re-entrance.
      isFlushing = true;
      var i = 0;

      try {
        for (; i < queue.length; i++) {
          var callback = queue[i];

          do {
            callback = callback(true);
          } while (callback !== null);
        }

        queue.length = 0;
      } catch (error) {
        // If something throws, leave the remaining callbacks on the queue.
        queue = queue.slice(i + 1);
        throw error;
      } finally {
        isFlushing = false;
      }
    }
  }
}

var createElement$1 =  createElementWithValidation ;
var cloneElement$1 =  cloneElementWithValidation ;
var createFactory =  createFactoryWithValidation ;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray: toArray,
  only: onlyChild
};

exports.Children = Children;
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createFactory = createFactory;
exports.createRef = createRef;
exports.forwardRef = forwardRef;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.startTransition = startTransition;
exports.unstable_act = act;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useDeferredValue = useDeferredValue;
exports.useEffect = useEffect;
exports.useId = useId;
exports.useImperativeHandle = useImperativeHandle;
exports.useInsertionEffect = useInsertionEffect;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.useSyncExternalStore = useSyncExternalStore;
exports.useTransition = useTransition;
exports.version = ReactVersion;
          /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
}
        
  })();
}


/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (false) {} else {
  /* unused reexport */ __webpack_require__(/*! ./cjs/react.development.js */ "./node_modules/react/cjs/react.development.js");
}


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
/******/ 			id: moduleId,
/******/ 			loaded: false,
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
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 		__webpack_require__.hmrF = () => ("vendor." + __webpack_require__.h() + ".hot-update.json");
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
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
/******/ 			"vendor": 0
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
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./node_modules/react/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=vendor.js.map