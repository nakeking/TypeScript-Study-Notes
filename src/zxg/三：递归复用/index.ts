// ============== Promise =============================
type ttt = Promise<Promise<Record<string, any>>>

type DeepPromiseValueType<P extends Promise<unknown>> =
    P extends Promise<infer ValueType> 
        ? ValueType extends Promise<unknown>
            ? DeepPromiseValueType<ValueType> : ValueType
        : never

//简化，不再约束类型参数必须是Promise
type DeepPromiseValueType2<T> =
    T extends Promise<infer ValueType>
        ? DeepPromiseValueType2<ValueType> : T

type DeepPromiseResult = DeepPromiseValueType<ttt>
type DeepPromiseResult2 = DeepPromiseValueType2<ttt>


// ============== 数组类型的递归 ==============
// ReverseArr
type ReverseArr<Arr extends unknown[]> =
    Arr extends [...infer Rest, infer Last] 
        ? [Last, ...ReverseArr<Rest>] : Arr

type ReverseArrRes = ReverseArr<[1, 2, 3]>

//Includes
type Includes<Arr extends unknown[], FindItem> =
    Arr extends [infer First, ...infer Rest]
        ? IsEqual<First, FindItem> extends true
            ? true : Includes<Rest, FindItem>
        : false

//判断类型相等
type IsEqual<A, B> = (<T>() => T extends A ? true : false) extends (<T>() => T extends B ? true : false) ? true : false
type IsEqualAny = IsEqual<string, any>


type IncludesRes = Includes<[1,2,3], 2>

// RemoveItem
type RemoveItem<
    Arr extends unknown[], 
    Item,
    Result extends unknown[] = []
> = 
    Arr extends [infer First, ...infer Rest] 
        ? IsEqual<First, Item> extends true 
            ? RemoveItem<Rest, Item, Result> : RemoveItem<Rest, Item, [...Result, First]>
        : Result

type RemoveItemRes = RemoveItem<[1,2,3], 2>


type BuildArray<
    Length extends number, 
    Ele = unknown, 
    Arr extends unknown[] = []
> = 
    Arr['length'] extends Length
        ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>

type BuildArrayRes = BuildArray<5, number>


//字符串类型的递归
//ReplaceAll
type ReplaceAll<
    Str extends string,
    From extends string,
    To extends string
> =
    Str extends `${infer Fixed}${From}${infer Rest}`
        ? `${Fixed}${To}${ReplaceAll<Rest, From, To>}` : Str

type ReplaceAllRes = ReplaceAll<'snake snake snake', 'snake', 'dog'>


// StringToUnion
type StringToUnion<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? First | StringToUnion<Rest>
        : never

type StringToUnionRes = StringToUnion<'snake'>


//ReverseStr
type ReverseStr<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? `${ReverseStr<Rest>}${First}` : Str

type ReverseStrRes = ReverseStr<'snake'>


// 对象类型的递归
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

// Function extends object = true
type DeepReadonlyObj<Obj extends Record<string, any>> = {
    readonly [K in keyof Obj]: 
        Obj[K] extends object
            ? Obj[K] extends Function
                ? Obj[K] : DeepReadonlyObj<Obj[K]>
            : Obj[K]
}

//为啥这里没有计算呀？ 
//因为ts只有类型被用到的时候才会做类型计算
//可以在前面加上一段 Obj extends never ? never 或者 Obj extends any等，让它触发计算
type DeepReadonlyObj2<Obj extends Record<string, any>> = 
    Obj extends any
        ? {
            readonly [K in keyof Obj]:
                Obj[K] extends object
                    ? Obj[K] extends Function
                        ? Obj[K] : DeepReadonlyObj2<Obj[K]>
                    : Obj[K]
        }
        : never

type DeepReadonlyObjRes = DeepReadonlyObj<deepObj>
type DeepReadonlyObjRes2 = DeepReadonlyObj2<deepObj>