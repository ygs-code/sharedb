
# Collaborative Textarea with ShareDB

This is a collaborative plain textarea using the default ShareDB JSON document
type and the `sharedb-string-binding` module.

In this demo, data is not persisted. To persist data, run a Mongo
server and initialize ShareDB with the
[ShareDBMongo](https://github.com/share/sharedb-mongo) database adapter.

## Install dependencies
```
npm install
```

## Build JavaScript bundle and run server
```
npm run build && npm start
```

browserify client.js -o static/bundle.js

## Run app in browser
Load [http://localhost:8080](http://localhost:8080)



# ShareDB-textarea 源码分析

## 客户端

reconnecting-websocket 包 客户端webscoket连接包

sharedb-string-binding包绑定textarea dom触发onChange事件 ShareDB订阅和发布 op

text-diff-binding包 计算op位置和光标处理

 sharedb\lib\client  客户端包



客户端思想是每次修改textarea 都会触发onChange事件，通过text-diff-binding计算出修改和删除新增的操作和字符位置 字符串内容的，然后自己计算op合并文档，存在本地缓存中。然后通过订阅发布发送webscoket把op发个服务器，比如a 会发一个webscoket，服务器接受到a的webscoket之后，会处理op合并到文档中存入到数据中，然后服务器在推送到其他客户端中，然后刚才a客户也会推送，但是没有op信息，这样他就不会二次执行op了。然后b用户接受到op之后再和本地的文本合并。



客户端代码流程

第一创建websocket连接

```
var socket = new ReconnectingWebSocket("ws://" + window.location.host);

// 获取文档 
var connection = new sharedb.Connection(socket);


 



```

连接 socket ,此时如果socket连接上会发送 { a: "hs", id: this.id } 给服务器

```
// 获取文档 
var connection = new sharedb.Connection(socket);
```

 然后服务器在返回一个{"a":"init","protocol":1,"protocolMinor":1,"id":"b7d0c9c69be7d08395ce68c2c0f81916","type":"http://sharejs.org/types/JSONv0"}数据回来

客户端再发一次 { a: "hs", id: this.id } 给服务器



客户端获取文档

```
var doc = connection.get("examples", "textarea");


然后调用文档类
// 如果文档不存在则创建一个文档
  if (!doc) {
    doc = docs[id] = new Doc(this, collection, id);
    this.emit("doc", doc);
  }
```



然后订阅文档

doc.subscribe 这里做  { a: "s", c: doc.collection, d: doc.id, v: version }

```
// 获取到文档对象
doc.subscribe(function (err) {
  if (err) {
    throw err;
  }
  //绑定 input 事件
  var binding = new StringBinding(element, doc, ["content"]);
  // 初始化
  binding.setup();
});

```





我现在遇到的问题就是服务端怎么分清除哪个人连接，然后对于那个人不发送op信息的，还有不同的人发送不同的op是如何处理冲突的。







