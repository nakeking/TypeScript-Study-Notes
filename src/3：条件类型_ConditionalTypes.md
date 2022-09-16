<!--
 * @Author: 
 * @Date: 2022-04-14 18:32:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-15 15:21:02
 * @FilePath: \tsBase\src\3：条件类型_ConditionalTypes.md
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
-->
# 条件类型 Conditional Types

条件类型的语法实际就是三元表达式，看一个最简单的例子：
```
T extends U ? X : Y
```
`如果觉得这里extends不太好理解，可以暂时简单理解为U中的属性在T中都有。`

为什么会有条件类型？可以看到通常条件类型是和泛型一同使用的，联想到泛型的使用场景，我想你应该明白了些什么。对于类型无法即时确定的场景，使用条件类型来在运行时动态的确定最终的类型（运行时可能不太准确，或者可以理解为，你提供的函数被他人使用时，根据他人使用时传入的参数来动态确定需要被满足的类型约束）。

条件类型理解起来更直观，唯一需要有一定理解成本的就是 **何时条件类型系统会收集到足够的信息来确定类型**，也就是说，条件类型有时不会立刻完成判断。

在了解这一点前，我们先来看看条件类型常用的一个场景：**泛型约束**，实际上就是我们上面的例子：
```
function pickSingleValue<T extends object, U extends keyof T>(
  obj: T, 
  key: U
): T[U] {
  return obj[key];
}
```

这里的`T extends object` 和 `U extends keyof T` 都是泛型约束，分别`将 T 约束为对象类型` 和 `将 U 约束为 T 键名的字面量联合类型`，我们通常使用泛型约束来 `收窄类型约束`。

以一个使用条件类型作为函数返回值类型的例子：
```
declare function strOrNum<T extends boolean>(x: T): T extends true ? string : number
```

在这种情况下，条件类型的推导就会被延迟，因此此时类型系统没有足够的信息来判断。

只有给出了所需信息（在这里是入参x的类型），才可以推导。

```
const strReturnType = strOrNum(true);
const numReturnType = strOrNum(false);
```

同样的，就像三元表达式可以嵌套，条件类型也可以嵌套，如果你看过一些框架源码，也会发现其中存在着许多嵌套的条件类型，无他，条件类型可以将类型约束收拢到非常精确的范围内：
```
type TypeName<T> = T extends string ? "string" : 
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" : "object"
```

---

## **分布式条件类型 Distributive Conditional Types**

官方文档对分布式条件类型的讲解内容甚至要多于条件类型，因此你也知道这东西没那么简单了吧。

分布式条件类型实际上不是一种特殊的条件类型，而是其特性之一。先上概念：**对于属于裸类型参数的检测类型，条件类型会在实例化时期自动分发到联合类型上**

先提取几个关键词，然后我们通过例子理清这几个概念：

> 裸类型参数

> 实例化

> 分发到联合类型

```
type TypeName<T> = T extends string ? "string" : 
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" : "object"

// "string" | "function"
type T1 = TypeName<string | (() => void)>

// "string" | "object"
type T2 = TypeName<string | string[]>

// "object"
type T3 = TypeName<string[] | number[]>
```

我们发现在上面的例子里，条件类型的推导结果都是联合类型（T3实际也是，只不过相同所以被合并了），并且其实就是类型参数被依次进行了条件判断，再使用 `|` 组合得来的结果。

是不是get到了一点什么？我们再看另一个例子：

```
type Naked<T> = T extends boolean ? "Y" | "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" | "N";

/*
 * 先分发到Naked<number> | Naked<boolean>
 * 所以结果是 "Y" | "N"
 */
 type Distrubuted = Naked<number | boolean>   // "Y" | "N"; 


 /*
  * 不会分发 直接是[number | boolean] extends [boolean]
  * 这样当然就是"N"
  */
type NotDistributed = Wrapped<number | boolean>   // "N"

type Distributed = Wrapped<boolean>   // "Y"
```

现在我们可以来讲讲这几个概念：
> 裸类型参数，没有额外被接口/类型别名/奇怪的东西包裹过的，就像 `Wrapped` 包裹后就不能再被称为裸类型参数。

> 实例化，其实就是条件类型的判断过程，就像我们前面说的，条件类型需要在收集到足够的推断信息之后才能进行这个过程。在这里两个例子的实例化过程实际上是不同的，具体会在下一点中介绍。

> 分发至联合类型的过程：
> > 对于TypeName，它内部的类型参数 T 是没有被包裹过的，所以 `TypeName<string | (() => void)>` 会被分发为 `TypeName<string> | TypeName<() => void>`，然后再次进行判断，最后分发为 `"string" | "function"`
> > ```
> > (A | B | C) extends T ? X : Y
> > 
> > //相当于
> > (A extends T ? X : Y) | (B extends T ? X : Y) | (C extends T ? X : Y)
> > ```

一句话概括：`没有被额外包装的联合类型参数，在条件类型进行判断时会将联合类型分发，分别进行判断`。
