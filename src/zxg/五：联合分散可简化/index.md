## 分布式条件类型

当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。

举个例子
```
type Union = 'a' | 'b' | 'c'

type UppercaseA<Item extends string> = 
    Item extends 'a' ? Uppercase<Item> : Item

type result = UppercaseA<Union>     // result = 'b' | 'c' | 'A'
```
可以看到，我们类型参数Item约束为string，条件类型的判断中也是判断是否是 a，但传入的是联合类型。
这就是TypeScript对联合类型在条件类型中使用时的特殊处理：会把联合类型的每一个元素单独传入做类型计算，最后合并。
这和联合类型遇到字符串时的处理一样：
```
type Union = 'a' | 'b' |'c'

type str = `${Union}~~`     //str = 'a~~' | 'b~~' | 'c~~'
```

### CamelcaseUnion
Camelcase之前实现过，就是提取字符串中的字符，首字母大写后重新构造一个新的类型
```
type Camelcase<Str extends string> = 
    Str extends `${infer Left}_${infer Right}${infer Rest}`
        ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}` : Str

type CamelcaseResult = Camelcase<"aa_aa_aa">        // CamelcaseResult = "aaAaAa"
```
如果是对字符串数组做Camelcase，那就要递归处理每一个元素：
```
type CamelcaseArr<Arr extends unknown[]> =
    Arr extends [infer Item, ...infer Rest]
        ? [Camelcase<Item>, ...CamelcaseArr<Rest>] : []

type CamelcaseArrResult = CamelcaseArr<['aa_aa', 'bb_bb']>      // CamelcaseArrResult = ['aaAa', 'bbBb']
```
联合类型不需要递归提取每个元素，TypeScript内部会把每个元素传入单独做计算，之后把每个元素的计算结果合并成联合类型
```
type CamelcaseUnion<Item extends string> =
    Item extends `${infer Left}_${infer Right}${infer Rest}`
        ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}` : Item

type CamelcaseUnionResult = CamelcaseUnion<'aa_aa' | 'bb_bb'>       // CamelcaseUnionResult = 'aaAa' | 'bbBb'
```
对联合类型的处理和对单个类型的处理没什么区别，TypeScript 会把每个单独的类型拆开传入。不需要像数组类型那样需要递归提取每个元素做处理。