<!--
 * @Author: 
 * @Date: 2022-04-15 16:52:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-18 18:36:11
 * @FilePath: \tsBase\src\5：类型守卫 与 is in 关键字_Type Guards.md
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
-->
# **类型守卫 与 is in 关键字 Types Guards**

前面的内容可能不是那么符合人类直觉，需要一点时间消化。这一节我们看点相对简单 且 直观的知识点：类型守卫。

假设有这么一个字段，它可能字符串也可能是数字：
```
type numOrStrProp = number | string
```

现在在使用时，你想将这个字段的联合类型缩小范围，比如精确到string， 你可能会这么写：
```
const isString = (arg: unknown): boolean => typeof arg === "string"
```
看看这么写的效果
```
function useIt(numOrStr: number | string) {
  if(isString(numOrStr)){
    console.log(numOrStr.length);   // 类型"number"上不存在属性"length"
  }
}
```
看起来 `isString`函数并没有起到缩小类型范围的作用，参数依然是联合类型。这个时候就该使用 `is` 关键字了：
```
export const isString = (arg: unknown): arg is string => typeof arg === "string"
```

这个时候再去使用，就会发现在 `isString(numOrStr)`为true后，`numOrStr`的类型就被缩小到了`string`。这只是以元素类型为成员的联合类型，我们完全可以拓展到各种场景上，先看一下简单的假值判断：
```
type Falsy = false | "" | 0 | null | undefined;

const isFalsy = (val: unknown): val is Falsy => !val;
```
是不是挺有用，这应该是我日常用的最多的类型别名之一了。

也可以在 in 关键字的加持下，进行更强力的类型判断，思考下面的这个例子，要如何将 "A | B"的联合类型缩小到"A"?
```
class A {
  public a() {}

  public useA() {
    return "A"
  }
}

class B {
  public b() {}

  public useB() {
    return "B"
  }
}
```

再联想下 `for...in` 循环，它遍历对象的属性名，而 `in` 关键字也是一样的：
```
function useIt(arg: A | B): void {
  'a' in arg ? arg.useA() : arg.useB();
}
```
如果参数中存在 `a` 属性，由于A、B两个类型的交集并不包含a，所以这样能立刻缩小范围到A。

再看一个使用字面量类型作为类型守卫的例子：
```
interface IBoy {
  name: "mike";
  gf: string
}

interface IGirl {
  name: "sofia";
  bf: string;
}

function getLover(child: IBoy | IGirl): string {
  if(child.name === "mike") {
    return child.gf;
  }else {
    return child.bf;
  }
}
```

我想很多用TS写接口的小伙伴可能都遇到过，即登录与未登录下的用户信息时完全不同的接口，其实也可以使用 `in` 关键字解决。
```
interface ILoginUserProps {
  isLogin: boolean;
  name: string;
}

interface IUnLoginUserProps {
  isLogin: boolean;
  form: string
}

type UserProps = ILoginUserProps | IUnLoginUserProps;

function getUserInfo(user: UserProps): string {
  return 'name' in user ? user.name : user.form
}
```
同样的思路，还可以使用 `instanceof` 来进行实例的类型守卫。