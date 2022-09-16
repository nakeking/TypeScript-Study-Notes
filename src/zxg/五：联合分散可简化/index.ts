// ========= CamelcaseUnio ================
type Camelcase<Str extends string> =
    Str extends `${infer Left}_${infer Right}${infer Rest}`
        ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}` : Str

type CamelcaseResult = Camelcase<'aa_aa_aa'>


type CamelcaseArr<Arr extends unknown[]> =
    Arr extends [infer First, ...infer Rest] 
        ? [Camelcase<First & string>, ...CamelcaseArr<Rest>] : []

type CamelcaseArrResult = CamelcaseArr<['aa_aa_aa', 'bb_bb_bb']>


type CamelcaseUnio<Item extends string> =
    Item extends `${infer Left}_${infer Right}${infer Rest}`
        ? `${Left}${Uppercase<Right>}${CamelcaseUnio<Rest>}` : Item

type CamelcaseUnioResult = CamelcaseUnio<'aa_aa_aa' | 'bb_bb_bb'>


// =========== IsUnion =========
type TestUnion<A, B = A> = A extends A ? {a: A, b: B} : never
//A 和 B 都是同一个联合类型
//条件类型中如果左边的类型是联合类型，会把每个元素单独传入做计算，而右边不会。
//所以A 是 'a'的时候 B是'a'|'b'|'c'，A是'b'的时候，B是'a'|'b'|'c'...
type TestUnionResult = TestUnion<'a' | 'b' | 'c'>


//A extends A 这段看似没啥意义，主要是为了触发分布式条件类型，让 A 的每个类型单独传入。
//[B] extends [A] 这样不直接写死B就可以避免触发分布式条件类型，让A的每个类型单独传入。
type IsUnion<A, B = A> =
    A extends A
        ? [B] extends [A]
            ? false : true
        : never

type IsUnionResult = IsUnion<'a'|'b'|'c'>
type IsUnionResult2 = IsUnion<['a' | 'b']>

// BEM

//数组类型转联合类型
//type union = ['aaa', 'bbb'][number];

type BEM<
    B extends string,
    E extends string[],
    M extends string[]
> = `${B}__${E[number]}--${M[number]}`

type bemResult = BEM<'body', ['header', 'content'], ['Left', 'Right']> 


// AllCombinations
// 任何两个类型的组合有四种：A、B、AB、BA
type Combination<A extends string, B extends string> = A | B | `${A}${B}` | `${B}${A}`

type AllCombinations<
    A extends string,
    B extends string = A
> =
    A extends A
        ? Combination<A, AllCombinations<Exclude<B, A>>>
        : never

type AllCombinationsResult = AllCombinations<'A' | 'B' | 'C'>