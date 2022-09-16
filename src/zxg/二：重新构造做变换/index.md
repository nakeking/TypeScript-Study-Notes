## 重新构造
TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造。

数组、字符串、函数等类型的重新构造比较简单。

索引类型，也就是多个元素的聚合类型的重新构造复杂一些，涉及到映射类型的语法


### 数组类型重构

#### Push
```
type tuple = [1,2,3]

//TypeScript类型变量不支持修改，我们可以构造一个新的元组类型
type Push<Arr extends unknown[], Ele> = [...Arr, Ele];

type PushResult = Push<[1,2,3], 4>      // PushResult = [1,2,3,4]
```

#### Unshift
```
type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr]

type Unshift = Unshift<[1,2,3], 0>      // Unshift = [0,1,2,3]
```


#### Zip
```
type tuple1 = [1,2]
type tuple2 = ['guang', 'dong']

type Zip<One extends unknown[], Two extends unknown[]> = 
    One extends [inter OneCurr, ...infer OneOther]
        ? Two extends [infer TwoCurr, ...infer TwoOther]
            ? [[OneCurr, TwoCurr], ...Zip<OneOther, TwoOther>] : []
        : []

type ZipResult = Zip<tuple1, tuple2>        // ZipResult = [[1, 'guang'],[2, 'dong']]
```


### 字符串类型重构
#### CapitalizeStr
```
type CapitalizeStr<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? `${Uppercase<First>}${Rest}` : Str

type CapitalizeStrRes = CapitalizeStr<'guang'>      //CapitalizeStrRes = 'Guang'
```

### 函数类型重构
```
type AppendArgument<Fun extends Function, Arg> =
    Fun extends (...args: infer Args) => infer ReturnType
        ? (...args: [...Args, Arg]) => ReturnType : never

type AppendArgumentRes = AppendArgument<(name: string) => string, number>
```

### 索引类型重构
索引类型是聚合多个元素的类型，class、对象、等都是索引类型

```
type obj = {
    name: string
    age: number
    gender: boolean
}

//索引类型可以添加修饰符readonly(只读)、?(可选)
type obj2 = {
    readonly name: string
    age?: number
    gender: boolean
}

//索引类型的修改和构造新类型 涉及到映射类型的语法
type Mapping<Obj extends object> = {
    [Key in keyof Obj]: Obj[Key]
}

//TypeScript 内置高级类型Record，来创建索引类型
type Record<K extends any, T> = {
    [P in K]: T
}
type RecordRes = Record<string, number>     // RecordRes = { [x: string]: number }
```

#### UppercaseKey
除了可以对Value做修改，也可以对Key做修改。使用 as 重映射
```
type UppercaseKey<Obj extends Record<string, any>> = {
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}

type UppercaseKeyRes = UppercaseKey<obj>        // UppercaseKey = {
    NAME: string
    AGE: number
    ...
}
```

#### ToReadonly
```
type ToReadonly<T> = {
    readonly [Key in keyof T]: T[Key]
}

type ToReadonlyRes = ToReadonly<obj>        
// ToReadonlyRes = {
    readonly name: string
    readonly age: number
    readonly ...
}
```


#### ToPartial
```
type ToPartial<T> = {
    [Key in keyof T]?: T[Key]
}

type ToPartialRes = ToPartial<obj>      
//ToPartialRes = {
    name?: string
    age?: number
    ...
}
```

#### ToMutable
```
type ToMutable<T> = {
    -readonly [Key in keyof T]: T[Key]
}

type ToMutableRes = ToMutable<obj2>     
//ToMutableRes = {
    name: string
    age?: number
    ...
}
```

#### ToRequired
```
type ToRequired<T> = {
    [Key in keyof T]-?: T[Key]
}

type ToRequiredRes = ToRequired<obj2>       
//ToRequiredRes = {
    readonly name: string
    age: number
    ...
}
```

#### FilterByValueType
```
//never 的索引会在生成新的索引类型时被去掉
type FilterByValueType<Obj extends Record<string, any>, Filter> = {
    [Key in keyof Obj as Obj[Key] extends Filter ? Key : never]: Obj[Key]
}

type FilterByValueTypeResult = FilterByValueType<obj, string>       //FilterByValueTypeResult = {name: string}
```