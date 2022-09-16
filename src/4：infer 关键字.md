<!--
 * @Author: 
 * @Date: 2022-04-15 15:22:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-15 16:40:35
 * @FilePath: \tsBase\src\4：infer 关键字.md
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
-->

# **infer 关键字**

`infer` 是 `inference`的缩写，通常的使用方式是 `infer R`，`R` 表示 **待推特的类型**。如果说，通常 `infer` 不会被直接使用，而是与条件类型一起，被放置在底层工具类型中。

看一个简单的例子，用于获取函数返回值类型的工具类型 `ReturnType`：
```
const foo = (): string => {
  return "snake";
}

type FooReturnType = ReturnType<typeof foo>
```

`inter` 的使用思路可能不是那么好习惯，我们可以用前端开发常见的一个例子类比，页面初始化时先显示占位交互，像 Loading/骨架屏，在请求返回后再去渲染真实数据。`infer` 也是这个思路，类型系统在获得足够的信息后，就能将 `infer` 后跟随的类型参数推导出来，最后返回这个推导结果。
```
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```
`(...args: any[]) => infer R` 是一个整体，这里函数的返回值类型的位置被 `infer R` 占据了。

当 `ReturnType` 被调用，泛型T被实际类型填充，如果T满足条件类型的约束，就返回R的值，在这里R即为函数的返回值实际类型。

实际上为了严谨，应当接受泛型T为函数类型，即：
```
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R :any
```

类似的，借着这个思路我们还可以活动函数入参类型、类的构造函数入参类型、甚至Promise内部的类型等，这些工具类型我们会在后面讲到。

infer 其实没用特别难消化的知识点，它需要的只是思路的转变，你要理解 **延迟推断** 的概念。