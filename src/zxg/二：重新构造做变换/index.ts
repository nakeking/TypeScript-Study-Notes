//type 叫做类型别名，其实就是声明一个变量存储某个类型

type tuple1 = [1,2]
type tuple2 = ['guang', 'dong']

type Zip<One extends unknown[], Two extends unknown[]> = 
    One extends [infer OneCurr, ...infer OneOther] 
        ? Two extends [infer TwoCurr, ...infer TwoOther]
            ?  [[OneCurr, TwoCurr], ...Zip<OneOther, TwoOther>] : []
        : []

type ZipRes = Zip<tuple1, tuple2>


// ========= CapitalizeStr ==================
type CapitalizeStr<Str extends string> =
    Str extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}` : Str

type CapitalizeStrRes = CapitalizeStr<"guang">


// ======== CamelCaseRes ====================
type CamelCase<Str extends string> =
    Str extends `${infer First}_${infer Right}${infer Rest}`
        ? `${First}${Uppercase<Right>}${CamelCase<Rest>}` : Str

type CamelCaseRes = CamelCase<'dong_dong_dong'>

// ======== DropSubStr ======================
type DropSubStr<Str extends string, SubStr extends string> =
    Str extends `${infer Prefix}${SubStr}${infer Suffix}`
        ? DropSubStr<`${Prefix}${Suffix}`, SubStr> : Str

type DropSubStrRes = DropSubStr<'sn~ak~e', '~'>


//函数类型的重新构造
// ========= AppendArgument ===============
type AppendArgument<Fun extends Function, Arg> =
    Fun extends (...args: infer Args) => infer ReturnType
        ? (...args: [...Args, Arg]) => ReturnType : never

type AppendArgumentRes = AppendArgument<(name: string) => string, number>


//索引类型的重新构造
//索引类型是聚合多个元素的类型，class、对象等都是索引类型
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
//对索引类型的修改和构造新类型涉及到映射类型的语法
type Mapping<Obj extends object> = {
    [Key in keyof Obj]: Obj[Key]
}
type MappingRes = Mapping<obj2>

// UppercaseKey
//除了可以对Value做修改，也可以对Key做修改。使用as，重映射
type UppercaseKey<Obj extends Record<string, any>> = {
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}

type UppercaseKeyRes = UppercaseKey<obj>

//Record
//TypeScript 提供了内置的高级类型 Record 来创建索引类型
//type Record<K extend any, T> = { [P in K]: T }
type RecordRes = Record<string, string>

//ToReadonly
type ToReadonly<T> = {
    readonly [Key in keyof T]: T[Key]
}
type ToReadonlyResult = ToReadonly<obj>

//ToPartial
type ToPartial<T> = {
    [Key in keyof T]?: T[Key]
}
type ToPartialResult = ToPartial<obj>

//ToMutable
type ToMutable<T> = {
    -readonly [Key in keyof T]: T[Key]
}

type ToMutableResult = ToMutable<obj2>

//ToRequired
type ToRequired<T> = {
    [Key in keyof T]-?: T[Key]
}

type ToRequiredResult = ToRequired<obj2>


// FilterByValueType
//never 的索引会在生成新的索引类型时被去掉
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
    [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key]
}

type FilterByValueTypeRes = FilterByValueType<obj, string>
