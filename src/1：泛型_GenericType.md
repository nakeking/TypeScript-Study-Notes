<!--
 * @Author: 
 * @Date: 2022-04-13 17:25:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-14 11:55:43
 * @FilePath: \tsBase\src\1：泛型_GenericType.md
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
-->
# 泛型 Generic Type

假设我们有这么一个函数

```
function foo(args: unknown): unknown { ... }
```
- 如果接收一个字符串，返回这个字符串的部分截取
- 如果接收一个数字，返回这个数字的n倍
- 如果接收一个对象，返回键值被更改过的对象(键名不变)
- ...

上面这些场景有一个共同点，即函数的返回值与入参是同一类型

如果这时候需要类型定义，是否要把 ` unknown ` 替换为 `string | number | object` ? 这样固然可以，但别忘记我们需要的是 `入参与返回值类型相同` 的效果。这个时候 `泛型` 就该登场了，泛型使得代码的类型定义易于重用(比如后续又多了一种接收布尔值返回布尔值的函数实现)，并提升了灵活性与严谨性：

```
function foo<T>(arg: T): T {
  return arg;
}

//箭头函数写法
const foo = <T>(arg: T) => arg;

//如果你在TSX文件中这么写，<T>可能会被识别为JSX标签，因此需要显式告知浏览器
const foo = <T extends {}>(arg: T): T => {
  return arg
}
```

我们使用 `T` 来表示一个未知的类型，它是入参与返回值的类型，在使用时我们可以显示指定泛型：`通常泛型只会使用单个字母。如 T、U、K、V、S等。推荐做法是在项目达到一定复杂度后，使用有具体含义的泛型，如 BasicSchema。`

除了使用在函数中，泛型也可以在类中使用：

```
class Foo<T, U> {
  constructor(public arg1: T, public arg2: U){}

  public method(): T {
    return this.arg1;
  }
}
```

泛型除了单独使用，也经常与其他类型编程语法结合使用，可以说泛型就是TS类型变成最重要的基石。单独使用对于泛型的介绍就到这里（因为单纯的讲泛型实在没有什么好讲的）。