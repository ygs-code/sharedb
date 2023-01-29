module.exports = TextDiffBinding;

// 获取真实dom
function TextDiffBinding(element) {
  this.element = element;
}

// 抽象方法
TextDiffBinding.prototype._get =
  TextDiffBinding.prototype._insert =
  TextDiffBinding.prototype._remove =
    function () {
      throw new Error(
        "`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined."
      );
    };

// 获取dom的value
TextDiffBinding.prototype._getElementValue = function () {
  var value = this.element.value;
  // IE and Opera replace \n with \r\n. Always store strings as \n
  return value.replace(/\r\n/g, "\n");
};

//获取input末尾
/*
  如果是当前Input表单没有获取到光标
  或者当前光标选中不是在末尾
  或者是光标后面的字符串和服务器sharedb的后面内容不相同的时候
  返回false
*/
TextDiffBinding.prototype._getInputEnd = function (
  previous, //sharedb内容，
  value //dom内容
) {
  // 判断是否当前获得焦点的元素:
  if (this.element !== document.activeElement) {
    return null;
  }
  //如果字符串的长度等于光标开始的位置 那么光标就是在尾部
  var end = value.length - this.element.selectionStart;
  if (end === 0) {
    return end;
  }
  // 如果光标后面的字符串不相同
  if (
    previous.slice(previous.length - end) !== value.slice(value.length - end)
  ) {
    return null;
  }

  return end;
};

//为input添加onChange事件 根据用户onChange事件判断是删除还是新增字符串
TextDiffBinding.prototype.onInput = function () {
  //获取sharedb文档内容
  var previous = this._get();
  // 获取表单值
  var value = this._getElementValue();
  console.log('value=',value)
  // debugger
  //如果他们内容相同
  if (previous === value) {
    return;
  }

  var start = 0;
  // Attempt to use the DOM cursor position to find the end
  // 尝试使用DOM光标位置查找结束 获取光标结束位置
  var end = this._getInputEnd(
    previous, //sharedb内容
    value //dom内容
  );
  if (end === null) {
    // If we failed to find the end based on the cursor, do a diff. When
    // ambiguous, prefer to locate ops at the end of the string, since users
    // more frequently add or remove from the end of a text input
    //如果我们没有根据游标找到结束，执行diff
    //二义性，更倾向于在字符串的末尾定位ops，因为用户
    //更频繁地从文本输入的末尾添加或删除
    while (previous.charAt(start) === value.charAt(start)) {
      //找到前面相同的字符
      start++;
    }
    end = 0;
    //找到后面相同的字符串
    while (
      previous.charAt(previous.length - 1 - end) ===
        value.charAt(value.length - 1 - end) &&
      end + start < previous.length &&
      end + start < value.length
    ) {
      end++;
    }
  } else {
    //如果能获取尾部光标 此时 一般是用户在尾部删除字符串 所以我们只需要校验前面字符串相等就行
    while (
      previous.charAt(start) === value.charAt(start) &&
      start + end < previous.length &&
      start + end < value.length
    ) {
      //获取删除开始位置
      start++;
    }
  }

  /*
   假设 previous内容是 abc
       value内容是    ab
       那么  previous.length 等于 3
       start + end  等于 2
        previous内容是 服务器内容是旧的，
        value内容是表单输入内容是新的
        所以得出他删除了内容
  */
  if (previous.length !== start + end) {
    //截取删除的内容
    var removed = previous.slice(start, previous.length - end);
    // 删除字符串方法
    this._remove(start, removed);
    // debugger
  }

  /*
   假设 previous内容是 abc
       value内容是    abcd
       那么    value.length 等于 3
        start + end  等于 2
        previous内容是 服务器内容是旧的，
        value内容是表单输入内容是新的
        所以得出他添加了内容
  */
  if (value.length !== start + end) {
    //截取添加的内容
    var inserted = value.slice(start, value.length - end);
    // 添加字符串方法
    this._insert(
      start, // 插入开始位置
      inserted // 插入内容
    );
    // debugger
  }
};

// 插入文档   //光标判断偏移光标
TextDiffBinding.prototype.onInsert = function (
  index, //插入内容位置
  length //插入内容的长度
) {
  // 更新真实dom文档 并且设置光标偏移
  this._transformSelectionAndUpdate(index, length, insertCursorTransform);
};

//光标判断偏移光标
/*
  比如旧的内容是 abc
  插入         c
  插入位置      在3
  光标在        1
  如果插入位置在光标的后面则光标需要 加上当前插入字符串的长度，
  如果插入位置在光标的后面则不需要偏移贯标
*/
function insertCursorTransform(
  index, //插入位置
  length, // 插入长度
  cursor //光标位置
) {
  return index < cursor ? cursor + length : cursor;
}

// 更新真实dom文档 并且设置光标偏移
TextDiffBinding.prototype.onRemove = function (
  index, //删除位置
  length // 删除长度
) {
  // 更新真实dom文档 并且设置光标偏移
  this._transformSelectionAndUpdate(index, length, removeCursorTransform);
};
/*
 如果删除位置在光标的前面
  那么等于 cursor - Math.min(length, cursor - index) 
  Math.min(length, cursor - index)  是兼容开始和结束光标，
  比如选中的时候 结束光标是在后面的在字符串最后面，此时如果其他用户删除了 后面的所有字符串，那么
  此时的 开始 如果是 开始 cursor-length 那么就等于负数了，
  比如
  字符串为  123456789
  选中 23456789  开始位置为
 index= 1
 length= 8
 start cursor= 1
 end cursor= 9
*/
// 删除文本时候设置光标偏移
function removeCursorTransform(
  index, //删除开始位置
  length, // 删除长度
  cursor // 光标位置
) {
  console.log("index=", index);
  console.log("length=", length);
  console.log("cursor=", cursor);
  return index < cursor ? cursor - Math.min(length, cursor - index) : cursor;
}

// 更新真实dom文档 并且设置光标偏移
TextDiffBinding.prototype._transformSelectionAndUpdate = function (
  index, //插入位置
  length, // 插入内容长度
  transformCursor // 光标偏移
) {
  //如果当前文档获取焦点
  if (document.activeElement === this.element) {
    //偏移光标开始位置
    var selectionStart = transformCursor(
      index, //插入位置
      length, // 插入内容长度
      //光标开始位置
      this.element.selectionStart
    );
    //偏移光标结束位置
    var selectionEnd = transformCursor(
      index, //插入位置
      length, // 插入内容长度
      // 光标结束位置
      this.element.selectionEnd
    );
    /*
      selectionDirection 可选
      一个表示选择方向的字符串，可能的值有：
      "forward"
      "backward"
      "none" 默认值，表示方向未知或不相关。
    */
    var selectionDirection = this.element.selectionDirection;
    //更新文档
    this.update();
    //重新这只光标
    this.element.setSelectionRange(
      selectionStart,
      selectionEnd,
      selectionDirection
    );
  } else {
    //如果当前文档没有获取焦点则直接更新文档
    this.update();
  }
};

// 更新文档到真实dom中
TextDiffBinding.prototype.update = function () {
  var value = this._get();
  // 获取dom的value
  if (this._getElementValue() === value) {
    return;
  }
  this.element.value = value;
};
