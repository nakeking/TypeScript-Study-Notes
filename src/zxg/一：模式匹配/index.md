## 模式匹配

TypeScript类型的模式匹配是通过 extends 对类型参数做匹配，结果保存到通过infer声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的变量。

这个模式匹配的套路有多有用呢？我们来看下在数组、字符串、函数、构造器等类型里的应用。

### 1： 数组类型

#### First
```
type arr = [123]

type GetFirst<Array extends unknown[]> =
    Arr extends [inter First, ...unknown[]] ? First : never;

type GetFirstResult = GetFirst<[1,2,3]>     // GetFirstResult = 1
type GetFirstResult2 = GetFirst<[]>       // GetFirstResult2 = never
```


#### Last
```
type GetLast<Arr extends unknow[]> = 
    Arr extends [...unknow[], infer Last] ? Last : never

type GetLastResult = GetLast<[1,2,3]>       // GetLastResult = 3
```


#### PopArr
```
type PopArr<Arr extends unknow[]> = 
    Arr extends [] ? []
        : Arr extends [...infer Pop, unknow] ? Pop : never

type GetPopResult2 = PopArr<[]>     // GetPopResult2 = []
type GetPopResult = PopArr<[1,2,3]>     // GetPopResult = [1,2]
```

#### ShiftArr
```
type ShiftArr<Arr extends unknown[]> = 
    Arr extends [] ? []
        : Arr extends [unknown, ...infer Shift] ? Shift : never

type GetShiftResult2 = ShiftArr<[]>     // GetShiftResult2 = []
type GetShiftResult = ShiftArr<[1,2,3]>     // GetShiftResult = [2,3]
```


### 2：字符串类型

#### StartsWith
```
type StartsWith<Str extends string, Prefix extends string> =
    Str extends `${Prefix}${string}` ? true : false

type StartsWithResult = StartsWith<'http://www.baidu.com', 'http://'>      // StartWithResult = true
```

#### Replace
```
type Replace <
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Prefix}${From}${Suffix}` 
    ? `${Prefix}${To}${Suffix}` : Str

type ReplaceResult = Replace<"snake is ?, is ok?", '?', "dog">      //ReplaceResult = "snake is dog?, is ok?"
```

#### Trim
```
type TirmStrRight<Str extends string> = 
    Str extends `${infer Rest}${'' | '\n' | '\t'}` ? TrimStrRight<Rest> : Str

type TrimStrRightResult = TrimStrRight<'123     '>     // TrimStrRightResult = '123'


type TrimStrLeft<Str extends string> =
    Str extends `${'' | '\n' | '\t'}${infer Rest}` ? TrimStrLeft<Rest> : Str

type TrimStrLeftResult = TrimStrLeft<'   123'>      // TrimStrLeftResult = '123'    

type TrimResult = TrimStrRight<TrimStrLeft<'   123    '>>       // TrimResult = '123'
```
`因为我们不知道有多少个空白字符，所以只能一个一个匹配和去掉，需要递归`


### 函数

#### GetParameters
```
type GetParameters<Func extends Function> =
    Func extends (...args: infer Args) => unknown ? Args : never

type GetParametersResult = GetParameters<(name: string, age: number) => void>       // GetParametersResult = [name: string, age: number]
```

#### GetReturnType
```
type GetReturnType<Func extends Function> =
    Func extends (...args: unknown[]) => infer ReturnType ? ReturnType : never

type ReturnTypeRes = GetReturnType<() => void>      // ReturnTypeRes = void
```

#### GetThisParameterType 

```
class Dong {
    name: string;

    constructor() {
        this.name = "dong"
    }

    /** 
     * 用 对象.方法名 的方式调用的时候，this就指向那个对象
     * 但是方法也可以用 call 或者 apply 调用
     * call 调用的时候，this 就变了，但这里却没有被检查出来 this 指向的错误
     * 
     * 可以在方法声明时指定 this 的类型
    */
    hello(this: Dong) {
        return `hello, I\'m ${this.name}`
    }
}

let dong = new Dong()
dong.hello();
dong.hello.call({name: 'dong'})  // error
```

```
type GetThisParameterType<T> = 
    T extends (this: infer ThisType, ...args: unknown[]) => unknown ? ThisType : unknown

type GetThisParameterTypeRes = GetThisParameterType<typeof dong.hello>
```

### 构造器

#### GetInstanceType
构造器类型可以用interface声明，使用new():xx的语法
```
interface Person {
    name: string
}

interface PersonConstructor {
    new(name: string): Person
}
```


### 索引类型
#### GetRefProps
```
type GetRefProps<Props> =
    'ref' extends keyof Props
        ? Props extends {ref?: inter Value | undefined}
            ? value : never
        : never

type GetRefPropsRes = GetRefProps<{ref?: 1, name: 'snake'}>
```
