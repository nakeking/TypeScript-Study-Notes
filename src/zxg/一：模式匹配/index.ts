type p = Promise<'snake'>

type GetValueType<P> = P extends Promise<infer Value> ? Value : never

type GetValueResult = GetValueType<Promise<'snake'>>


// 数组
// =============== Last ===================
type GetLast<Arr extends unknown[]> = 
    Arr extends [...unknown[], infer Last] ? Last : never

type GetLastResult = GetLast<[1,2,3]>


// =============== PopArr ==================
type PopArr<Arr extends unknown[]> =
    Arr extends [] ? []
        : Arr extends [...infer Pop, unknown] ? Pop : never

type GetPopArrResult2 = PopArr<[]>
type GetPopArrResult = PopArr<[1,2,3]>



// 字符串
// =============== ShiftArr ==================
type ShiftArr<Arr extends unknown[]> = 
    Arr extends [] ? []
        : Arr extends [unknown, ...infer Shift] ? Shift : never

type GetShiftArrResult2 = ShiftArr<[]>
type GetShiftArrResult = ShiftArr<[1,2,3]>


// =============== StartsWith ====================
type StartsWith<Str extends string, Prefix extends string> =
    Prefix extends '' ? false
        : Str extends `${Prefix}${string}` ? true : false

        
type StartsWithResult2 = StartsWith<'http://', ''>
type StartsWithResult = StartsWith<'http://www.baidu.com', 'http://'>


// =============== Replace =================
type Replace <
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str

type ReplaceResult = Replace<"snake is ?, is ok?", '?', "dog">


// ================ Trim ==================
type TrimStrRight<Str extends string> =
    Str extends `${infer Rest}${' ' | '\n' | '\t'}`
        ? TrimStrRight<Rest> : Str

type TrimStrRightResult = TrimStrRight<'123      '>

type TrimStrLeft<Str extends string> =
    Str extends `${' ' | '\n' | '\t'}${infer Rest}`
        ? TrimStrLeft<Rest> : Str

type TrimStrLeftResult = TrimStrLeft<'   123'>

type TrimResult = TrimStrLeft<TrimStrRight<'   123   '>>



// 函数
// ================= GetParameters ===================
type GetParameters<Func extends Function> =
    Func extends (...args: infer Args) => unknown ? Args : never

type ParametersResult = GetParameters<(name: string, age: number) => unknown>


// ================ GetReturnType ======================
type GetReturnType<Func extends Function> = 
    Func extends (...args: unknown[]) => infer ReturnType ? ReturnType : never

type ReturnTypeResult = GetReturnType<() => void>


//构造器
// ================ GetThisParameterType ================
class Dong {
    name: string;

    constructor() {
        this.name = "dong"
    }

    /** 
     * 用 对象.方法名 的方式调用的时候，this就指向那个对
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
// dong.hello.call({name: 'dong'})  // error

type GetThisParameterType<T> = 
    T extends (this: infer ThisType, ...args: unknown[]) => unknown ? ThisType : unknown

type GetThisParameterTypeRes = GetThisParameterType<typeof dong.hello>


// ==================== GetInstanceType =============
//构造器类型可以用 interface 声明，使用 new(): xx 的语法
interface Person {
    name: string
}

interface PersonConstructor {
    new (name: string): Person
}

type GetInstanceType<ConstructorType extends new (...args: any) => any> =
    ConstructorType extends new (...args: any) => infer InstanceType ? InstanceType : any

type GetInstanceTypeRes = GetInstanceType<PersonConstructor>


//索引类型
// ====================== React PropwithRef ===================
type PropsWithRef<P> =
    'ref' extends keyof P
        ? P extends { ref?: infer R | undefined }
            ? string extends R
                ? PropsWithRef<P> & { ref?: Exclude<R, string> | undefined }
                : P
            : P
        : P


// ====================== GetRefProps ==============
type GetRefProps<Props> =
    'ref' extends keyof Props 
    ? Props extends {ref?: infer Value | undefined} ? Value : never
    : never

type GetRefPropsRes = GetRefProps<{ref: 1, name: 'snake'}>