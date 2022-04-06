# JSON0 OT Type

JSON OT 类型可用于编辑任意 JSON 文档。

## 特征

JSON OT 类型支持以下操作：

- 在列表中插入/删除/移动/替换项，根据需要对相邻的列表项进行无序排列
- 对象插入/删除/替换
- 原子数值加法运算
- 嵌入任意子类型
- 嵌入字符串编辑，使用旧的 text0 OT 类型作为子类型

JSON0 是一个*可变卖的*类型-也就是说，所有操作都有一个反向操作，它将撤消原始操作。因此，所有删除内容的操作都会在操作中内联添加要删除的内容。

但它并不完美-这里有一个清单*不能*执行：

- 物体移动
- 如果为空，则设置为空（第一个写入程序的对象插入将获得语义）
- 多个项目的高效列表插入

它也有 O（a\*b）复杂度，当相互转换大型操作时（与 O（a b）相反，更好的算法可以管理）。

## 操作

JSON 操作是操作组件的列表。操作是对这些组件的分组，按顺序应用。

每个操作组件都是一个具有`p： 路径`组件。路径是到达文档中目标元素的键列表。例如，给出以下文件：

```
{'a':[100, 200, 300], 'b': 'hi'}
```

删除第一个数组元素的操作(`100`) 是这样的:

```
[{p:['a', 0], ld:100}]
```

这路劲 (`['a', 0]`) 描述如何从根访问目标元素。第一个元素是包含对象中的键，第二个元素是索引
到数组中。

### 简易的操作

| op                                    | Description                                                           |
| ------------------------------------- | --------------------------------------------------------------------- |
| `{p:[path], na:x}`                    | 添加到 `x` 到数字路劲 `[path]`.                                       |
| `{p:[path,idx], li:obj}`              | 将对象' obj '插入到列表' [path] '中的' idx '项的前面。                |
| `{p:[path,idx], ld:obj}`              | 从' [path] '列表的索引' idx '中删除对象' obj '。                      |
| `{p:[path,idx], ld:before, li:after}` | 将' [path]列表中索引' idx '处的' before '对象替换为' after '对象。    |
| `{p:[path,idx1], lm:idx2}`            | 移动位于' idx1 '的对象，使该对象位于列表' [path] '的索引' idx2 '处。  |
| `{p:[path,key], oi:obj}`              | 将对象' obj '插入到对象' [path] '，键为' key '。                      |
| `{p:[path,key], od:obj}`              | 从对象' [path] '中删除键为' key '的对象' obj '。                      |
| `{p:[path,key], od:before, oi:after}` | 将对象' before '替换为' [path] '对象' at key ' key '后的对象'。       |
| `{p:[path], t:subtype, o:subtypeOp}`  | 将类型为 t 的子类型 op ' o '应用到位于' [path] '的对象上              |
| `{p:[path,offset], si:s}`             | 在 offset ' offset '处插入字符串' s '到' [path] '处(内部使用子类型)。 |
| `{p:[path,offset], sd:s}`             | 从位于[path]的字符串中删除位于 offset 的字符串' s '(内部使用子类型)。 |

---

### 操作数

对号码的唯一操作就是添加号码。记住,你是否总是可以通过操作另一个数字来替换该数字容器。

> 将 X 加到 PATH 的数字上。如果你要做减法，加一个负数。
>
> - 也是线性倍数(Ie, `x = Bx + C`)
> - MAX, MIN, etc? That would let you do timestamps...
>
> I can't think of any good use cases for those operations...

#### Add

使用:

    {p:PATH, na:X}

将 X 加到 PATH 的数字上。如果你要做减法，加一个负数。

---

### Lists and Objects

列表和对象具有相同的操作集(_插入_，_删除_，
_Replace_， _Move_)，但它们的语义非常不同。列表操作
将相邻的列表项向左或向右移动以腾出空间(或删除空间)。
对象操作则不然。您应该选择将给出的数据结构
在设计数据模型时，您可以使用您想要的行为。

为了明确操作的语义，列出操作和对象操作有不同的名称。(`li`, `ld`, `lm` for lists and `oi`,
`od` and `om` for objects).

#### Inserting, Deleting and Replacing in a list

使用:

- **Insert**: `{p:PATH, li:NEWVALUE}`
- **Delete**: `{p:PATH, ld:OLDVALUE}`
- **Replace**: `{p:PATH, ld:OLDVALUE, li:NEWVALUE}`

插入、删除或替换 `PATH`.

路径中的最后一个元素指定了列表中的索引，元素将在该索引中创建索引
删除、插入或替换。索引必须有效(0 <= _new index_ <=
_list length_)。现有列表元素的索引在新建时可能会改变
添加或删除列表元素。


替换操作:

    {p:PATH, ld:OLDVALUE, li:NEWVALUE}

相当于delete后面跟着insert:

    {p:PATH, ld:OLDVALUE}
    {p:PATH, li:NEWVALUE}

给出以下列表:

    [100, 300, 400]

应用如下操作:

    [{p:[1], li:{'yo':'hi there'}}, {p:[3], ld:400}]

将产生以下新列表:

    [100, {'yo':'hi there'}, 300]

#### Moving list elements

你可以通过删除它们和&插入它们回到其他地方来移动列表项目，
但是，如果对已删除的元素执行并发操作，则会丢失这些操作。
为了解决这个问题，JSON OT类型有一个特殊的列表移动操作。

使用:

    {p:PATH, lm:NEWINDEX}

将' PATH '指定的列表元素移动到列表中的其他位置，
与指数“NEWINDEX”。旧索引和新索引之间的任何元素
将得到新的指数，适当的。

新索引必须是0 <= _index_ < _list length_。新指数将是
**元素被从当前位置移除后**解释。
考虑到以下数据:

    ['a', 'b', 'c']

the following operation:

    [{p:[1], lm:2}]

will result in the following data:

    ['a', 'c', 'b']

#### Inserting, Deleting and Replacing in an object

使用:

- **Insert**: `{p:PATH, oi:NEWVALUE}`
- **Delete**: `{p:PATH, od:OLDVALUE}`
- **Replace**: `{p:PATH, od:OLDVALUE, oi:NEWVALUE}`

将' PATH '指示的元素从' OLDVALUE '设置为' NEWVALUE '。最后一个
路径的元素必须是要插入、删除或删除的元素的键
更换。


插入时，该键不能已经被使用。删除或替换a
的值，' OLDVALUE '必须等于对象在
指定的关键。

和列表一样，替换操作:

    {p:PATH, od:OLDVALUE, oi:NEWVALUE}

相当于delete后面跟着insert:

    {p:PATH, od:OLDVALUE}
    {p:PATH, oi:NEWVALUE}

(不幸的是)没有对应的列表移动对象。

---

### Subtype operations

使用:

    {p:PATH, t:SUBTYPE, o:OPERATION}

' PATH '是要被子类型修改的对象的路径。
' SUBTYPE '是子类型的名称，例如:“text0””。
' OPERATION '是子类型操作本身。

要注册一个子类型，调用' json0。registerSubtype '与另一个OT类型。
具体来说，子类型是一个具有以下方法的JavaScript对象:

- `apply`
- `transform`
- `compose`
- `invert`

查看 [OT types documentation](https://github.com/ottypes/docs) 了解这些方法的详细信息。

#### Text subtype

旧的字符串操作仍然受支持(见下文)，但现在作为子类型在内部实现
使用' text0 '类型。你可以继续使用下面记录的原始的' si '和' sd '操作，
或者自己使用' text0 '类型作为子类型。


要编辑字符串，请创建' text0 '子类型op
以下对象:

    {'key':[100,'abcde']}

如果你想从字符串" abcde' '中删除" d' '，你可以使用以下操作:

    [{p:['key',1], t: 'text0', o:[{p:3, d:'d'}]}

注意路径。按顺序排列的组件是列表的键和索引
“中的“字符串。中给出了字符串中" d' '字符的偏移量
子类型的操作。

##### Insert into a string

使用:

    {p:PATH, t:'text0', o:[{p:OFFSET, i:TEXT}]}


将' TEXT '插入到' PATH '指定的字符串中，位置由' OFFSET '指定。

##### Delete from a string

使用:

    {p:PATH, t:'text0', o:[{p:OFFSET, d:TEXT}]}

删除由' PATH '指定的字符串中的' TEXT '在' OFFSET '指定的位置.

---

### 字符串操作

这些操作现在在内部实现为使用' text0 '类型的子类型操作，但如果你愿意，你仍然可以使用它们。见上图。

如果路径上的内容是字符串，则操作可以编辑该字符串
就地删除字符或插入字符。

若要编辑字符串，请将字符串偏移量添加到路径中。例如，给定
以下对象:

    {'key':[100,'abcde']}

如果你想从字符串" abcde' '中删除" d' '，你可以使用以下操作:

    [{p:['key',1,3],sd:'d'}]


注意路径。按顺序排列的组件是列表的键和索引
" abcde' '字符串，然后偏移到字符串中的" d' '字符。

#### Insert into a string

使用:

    {p:PATH, si:TEXT}


在' PATH '指定的位置插入' TEXT '。路径必须指定
字符串中的偏移量。

#### Delete from a string

使用:

    {p:PATH, sd:TEXT}

在' PATH '指定的位置删除' TEXT '。路径必须指定
字符串中的偏移量。' TEXT '必须包含在指定的位置。

---

# Commentary

这个库是几年前由[Jeremy Apthorp](https://github.com/nornagon). 这是
最初是用coffeescript写的，作为ShareJS的一部分，然后它被删除了
进入share/ottypes库，最终到达这里。

该类型使用操作组件列表模型，其中每个操作生成一个
对文档的一系列单独更改。约瑟夫现在觉得这是
这是一个糟糕的想法，因为它不能很好地扩展到大型业务，但它确实做到了
(N<sup>2</sup> 而不是2N的复杂度).

杰里米和约瑟夫说过要重写这个库，以使每个
操作是对文档的稀疏遍历。但这是令人讨厌的
在第一个地方很难正确实现JSON OT -它可能会
让我们俩几个星期不去想别的事情，就能做到
发生。

当它被写入时，嵌入的text0类型是sharejs的文本类型。它的自
重写，使每个操作都是遍历，但JSON OT类型
仍然嵌入旧类型。因此，旧的文本类型包含在这里
存储库。如果您想在自己的项目中使用text0，我将非常乐意
把它从这里拉出来，让它成为自己的模块。不过，我建议你
只需使用新的文本类型。它更简单也更快。
---

# License

所有贡献给这个库的代码都是在MIT的标准许可下使用的:

版权所有2011 ottypes库贡献者

任何索取本文件副本的人士，在此获发免费许可
本软件及相关文档文件(下称“软件”)，以进行处理
不受任何限制，包括但不限于权利
使用、复制、修改、合并、发布、分发、再授权和/或出售
复制本软件，并允许拥有本软件的人
在符合下列条件的情况下，提供这样做的条件:

本软件是“按现状”提供的，没有任何形式的明示或担保
隐含的，包括但不限于适销性保证，
适合特定目的和不侵权。在任何情况下
作者或版权持有人对任何索赔、损害赔偿或其他责任
责任，无论是在合同、侵权或其他诉讼中，
由于或与本软件或本软件的使用或其他交易有关
该软件。