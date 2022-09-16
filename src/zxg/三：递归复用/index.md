## 递归复用
递归是把问题分解为一系列相似的小问题，通过函数不断调用自身来解决这一个个小问题，直到满足结束条件，就完成了问题的求解。

TypeScript类型系统不支持循环，但支持递归。当处理数量(个数，长度，层数)不固定的类型的时候，可以只处理一个类型，然后递归调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完成，就完成了不确定数量的类型编程，达到循环的效果。

### Promise递归例子
```
type ttt = Promise<Promise<Record<string, any>>>

type DeepPromiseValueType<P extends Promise<unknown>> =
    P extends Promise<infer ValueType>
        ? ValueType extends Promise<unknown> 
            ? DeepPromiseValueType<ValueType> : ValueType
        : never

//简化，不在约束类型参数必须是Promise
type DeepPromiseValueType2<T> = 
    T extends Promise<infer ValueType>
        ? DeepPromiseValueType2<ValueType>: T

type DeepPromiseValueTypeRes = DeepPromiseValueType<ttt>        // DeepPromiseValueTypeRes = { [x:string]: any }

type DeepPromiseValueTypeRes2 = DeepPromiseValueType2<ttt>      // DeepPromiseValueTypeRes2 = { [x:string], any }
```


### 数组类型的递归
#### ReverseArr
```
type ReverseArr<Arr extends unknown[]> = 
    Arr extends [...infer Rest, infer Last]
        ? [Last, ...ReverseArr<Rest>] : Arr

type ReverseArrRes = ReverseArr<[1,2,3]>        // ReverseArrRes = [3,2,1]
```

#### Includes
```
//判断两个类型是否相等
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)

type Includes<Arr extends unknown[], FindItem> = 
    Arr extends [infer First, ...infer Rest]
        ? IsEqual<FindItem, First> extends true
            ? true : Includes<Rest, FindItem>
        : false

type IncludesRes = Includes<[1,2,3], 3>     // IncludesRes = true
```

#### RemoveItem
```
type RemoveItem<
    Arr extends unknown[],
    FindItem,
    Result extends unknown[] = []
> =
    Arr extends [inter First, ...infer Rest]
        ? IsEqual<First, FindItem> extends true
            ? RemoveItem<Rest, FindItem, Result> : RemoveItem<Rest, FindItem, [...Result, First]>
        : Result

type RemoveItemRes = RemoveItem<[1,2,3], 2>     // RemoveItemRes = [1,3]
```


#### BuildArray
```
type BuildArray<
    Length extend number, 
    ValueType,
    Arr extends unknown[] = []
> =
    Arr['length'] extends Length
        ? Arr : BuildArray<Length, ValueType, [...Arr, ValueType]>

type BuildArrayRes = BuildArray<3, string>      //BuildArrayRes = [string, string, string]
```


### 字符串类型的递归

#### ReplaceAll
```
type ReplaceAll<
    Str extends string,
    From extends string,
    To extends string
> = 
    String extends `${infer Fixed}${Form}${Rest}`
        ? `${Fixed}${To}${ReplaceAll<Rest, From, To>}` : Str

type ReplaceAllRes = ReplaceAll<'snake snake snake', 'snake', 'dog'>      // ReplaceAll = ['dog', 'dog', 'dog']
```


#### StringToUnion
```
type StringToUnion<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? First | StringToUnion<Rest> : never

type StringToUnionRes = StringToUnion<'snake'>      //StringToUnionRes = 's' | 'n' | 'a' | 'k' | 'e'
```


### 对象类型的递归
```
type deepObj = {
    a: {
        b: () => 'snake',
        c: {
            d: {
                name: string
            }
        }
    }
}

//Function extends object = true, 所以这里需要加Function的判断
type DeepReadonlyObj<Obj extends Record<string, any>> = {
    readonly [K in keyof Obj]: 
        Obj[K] extends object
            ? Obj[K] extends Function
                ? Obj[K] : DeepReadonlyObj<Obj[K]>
            : Obj[K]
}

//这里ts没有进行嵌套计算
//是因为 ts只有在类型被用到的时候才会做类型计算
//可以在前面加上一段 Obj extends never ? never 或者 Obj extends any等，让它触发计算
type DeepReadonlyObjRes = DeepReadonlyObj<deepObj>      
/* 
    DeepReadonlyObjRes = {
        readonly a: DeepReadonlyObj<{
            b: () => 'snake',
            c: {
                d: {
                    name: string
                }
            }
        }>
    }
*/

type DeepReadonlyObj2<Obj extends Record<string, any>> = 
    Obj extends any 
        ? {
            readonly [K in keyof Obj]: 
                Obj[K] extends object
                    ? Obj[K] extends Function
                        ? Obj[K] : DeepReadonlyObj<Obj[K]>
                    : Obj[K]
        }
        : never

type DeepReadonlyObjRes2 = DeepReadonlyObj2<deepObj>
/*
    DeepPromiseValueTypeRes2 = {
        readonly a : {
            readonly b: () => 'snake',
            readonly c: {
                readonly d: {
                    readonly name: string
                }
            }
        }
    }
 */

```

