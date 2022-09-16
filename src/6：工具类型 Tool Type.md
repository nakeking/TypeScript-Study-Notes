<!--
 * @Author: 
 * @Date: 2022-04-18 18:36:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 18:26:13
 * @FilePath: \tsBase\src\6：工具类型 Tool Type.md
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
-->
# **工具类型 Tool Type**

这一章是本文的最后一部分，应该也是本文“性价比”最高的一部分了，因为即使你还是不太懂这些工具类型的底层实现，也不影响你把它用好。就像 Lodash 不会要求你每用一个函数都熟知原理一样。

这一部分包括 `TS 内置工具类型` 与社区的 `扩展工具类型`，我个人推荐在王朝学习后记录你觉得比较有价值的工具类型，并在自己的项目里新建一个 `.d.ts` 文件存储它。

**`在继续阅读前，请确保你掌握了上面的知识，他们时类型编程的基础。`**

## **内置工具类型**

在之前我们已经实现了内置工具类型中被使用的最多的一个：
```
type Partial<T> = {
  [K in keyof T]?: T[K]
}
```
它用于将一个接口中的字段变为全部可选，除了映射类型以外，它只使用了 `?` 可选修饰符，那么我现在直接掏出小抄（好家伙）：
> 去除可选修饰符： `-?`

> 只读修饰符：`readonly`

> 去除只读修饰符：`-readonly`

恭喜，你得到了 `Required` 和 `Readonly`（去除readonly修饰符的工具类型不属于内置的，我们会在后面看到）：

```
type Required<T> = {
  [K in keyof T]-?: T[K]
}

type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}
```

在上面我们实现了一个pick函数：
```
function pick<T extends object, U extends keyof T>(obj: T, keys: U[]): T[U][] {
  return keys.map(key => obj[key]);
}
```
照这个思路，假设我们现在需要从一个接口挑选一些字段：
```
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Part = Pick<A, "a" | "b">
```

还是映射类型，只不过现在映射类型的映射源是类型参数K

既然有了`Pick`，那么自然要有`Omit`（一个是从对象中挑选部分，一个是排除部分），`Omit`和`Pick`的写法非常相似，但是一个问题要解决：我们要怎么表示`T`中剔除了`K`后的剩余字段？

> Pick选取传入的键值，Omit移除传入的键值

这里我们又要引入一个知识点：`never`类型，它表示永远不会出现的类型，通常被用来将**收窄联合类型或是接口**。

> 在类型守卫一节，我们提到一个用户登录状态决定类型接口的例子，实际上也可以用never实现。