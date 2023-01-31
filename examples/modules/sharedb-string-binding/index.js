var TextDiffBinding = require("../text-diff-binding");

module.exports = StringBinding;

//构造函数
function StringBinding(element, doc, path) {
  console.log("element=", element);
  console.log("doc=", doc);
  console.log("path=", path);
  // 构造继承
  TextDiffBinding.call(this, element);
  //获取文档对象 用户socket 发送
  this.doc = doc;
  //
  this.path = path || [];
  this._opListener = null;
  this._inputListener = null;
}
// 原型继承 寄生耦合继承
StringBinding.prototype = Object.create(TextDiffBinding.prototype);
StringBinding.prototype.constructor = StringBinding;

// 开始执行
StringBinding.prototype.setup = function () {
  // 更新文档到真实dom中
  this.update();
  //
  this.attachDoc();
  // 添加input事件
  this.attachElement();
};

// 销毁 op 订阅 删除input事件
StringBinding.prototype.destroy = function () {
  // 删除input事件
  this.detachElement();
  // 销毁 op 订阅
  this.detachDoc();
};
// 添加input事件
StringBinding.prototype.attachElement = function () {
  var binding = this;
  //为input添加onChange事件 根据用户onChange事件判断是删除还是新增字符串
  this._inputListener = function () {
    //为input添加onChange事件 根据用户onChange事件判断是删除还是新增字符串
    binding.onInput();
  };
  // 添加input事件
  this.element.addEventListener("input", this._inputListener, false);
};
// 删除input事件
StringBinding.prototype.detachElement = function () {
  // 删除input事件
  this.element.removeEventListener("input", this._inputListener, false);
};
//订阅sharedb响应op事件
StringBinding.prototype.attachDoc = function () {
  var binding = this;

  this._opListener = function (op, source) {
    //订阅sharedb响应op事件
    binding._onOp(op, source);
  };

  // 获取服务器socket
  this.doc.on("op", this._opListener);
};

// 销毁 op 订阅
StringBinding.prototype.detachDoc = function () {
  this.doc.removeListener("op", this._opListener);
};

//订阅sharedb响应op事件
/*
这里的op等于 _insert和_remove输入的op
[
  op
]
*/
StringBinding.prototype._onOp = function (op, source) {
  console.log("op=", op);
  // 如果当前是自己则不执行下面代码
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
  // 判断是否是同一个文档连接的
  if (isSubpath(this.path, component.p)) {
    // 判断是否是插入op
    this._parseInsertOp(component);
    // 判断是否是删除op
    this._parseRemoveOp(component);
  } else if (isSubpath(component.p, this.path)) {
    //直接更新文档
    this._parseParentOp();
  }
};

StringBinding.prototype._parseInsertOp = function (component) {
  if (!component.si) {
    return;
  }
  // 获取插入位置
  var index = component.p[component.p.length - 1];
  //获取插入字符串长度
  var length = component.si.length;
  this.onInsert(
    index, // 获取插入位置
    length //获取插入字符串长度
  );
};

//
StringBinding.prototype._parseRemoveOp = function (component) {
  // 判断是否是删除op
  if (!component.sd) {
    return;
  }
  // 删除字符串开始位置
  var index = component.p[component.p.length - 1];
  // 删除字符串长度
  var length = component.sd.length;
  // 删除字符串并且设置光标偏移
  this.onRemove(
    index, // 删除字符串开始位置
    length // 删除字符串长度
  );
};

// 不设置光标直接更新文档
StringBinding.prototype._parseParentOp = function () {
  // 更新文档到真实dom中
  this.update();
};

//获取文档内容
StringBinding.prototype._get = function () {
  // 获取文档
  var value = this.doc.data;
  for (var i = 0; i < this.path.length; i++) {
    var segment = this.path[i];
    value = value[segment];
  }
  return value;
};

/* 
  op={
    p:[
      "content",
      1  // 插入位置
  ],
    si:'3'  // 插入内容
  }
 */
StringBinding.prototype._insert = function (
  index, // 插入开始位置
  text // 获取插入文本
) {
  console.log("this.path.concat=", this.path.concat);
  console.log("this.path=", this.path);
  console.log("index=", index);
  var path = this.path.concat(index);
  console.log("path=", path);
  var op = { p: path, si: text };
  console.log("op=", op);
  console.log('this.doc.submitOp=',this.doc.submitOp)
 
  // 广播 给服务器 发送websocket
  this.doc.submitOp(op, { source: this , id:123, });
};

/*
  删除字符串
  op={
    p:[
      "content",
      1    1  // 删除位置
    ],
    sd:'3'  // 删除内容
  }
*/
StringBinding.prototype._remove = function (
  index, // 插入开始位置
  text // 获取插入文本
) {
  var path = this.path.concat(index);
  var op = { p: path, sd: text };
  console.log("op=", op);
  this.doc.submitOp(op, { source: this });
};
// 判断是否是同一个文档连接的
/*
 这里
 path= ['content']
 testPath= (2) ['content', 5]
 所以返回的是true
*/
function isSubpath(path, testPath) {
  console.log("path=", path);
  console.log("testPath=", testPath);
  for (var i = 0; i < path.length; i++) {
    if (testPath[i] !== path[i]) return false;
  }
  return true;
}
