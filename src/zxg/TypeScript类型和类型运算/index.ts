//=============== zxg ts 基本类型============================
function getPropValue<
    T extends object, 
    Key extends keyof T
>(obj: T, key: Key): T[Key] {
    return obj[key]
}

console.log(getPropValue({a: 1, b: '3'}, 'b'))

type ParseParam<Param extends string> =
    Param extends `${infer Key}=${infer Value}` 
        ? {
            [K in Key]: Value
        }: {};

//字面量类型
// str: #号开头的字符串
function func(str: `#${string}`) {}
func('#123');       //true
// func('123');     //false

//TypeScript 类型系统中的类型运算
//条件: extends ? :
type res1 = 1 extends 2 ? true: false

type isTwo<T> = T extends 2 ? true : false
type res2 = isTwo<1>
type res3 = isTwo<2>

//推导: infer
//提取元组类型的第一个元素
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R] ? T : never;
type First2<Tuple extends unknown[]> = Tuple[0]
type res4 = First<[1,2,3]>
type res10 = First2<[1,2,3]>

//联合: |
type union = 1 | 2| 3
//交叉: &
type objType = {a: number} & {c: boolean}
let res5: objType = {a: 1, c: false}
type res6 = {a:number, c:boolean} extends objType ? true : false
type res7 = 'aaa' & 'bbb';

//映射类型
type MapType<T> = {
    [Key in keyof T]?: T[Key]
}

type MapType2<T> = {
    [Key in keyof T]: [T[Key], T[Key]]
}
type res8 = MapType2<{a: 1, b: 2}>

//as 重映射
type MapType3<T> = {
    [
        Key in keyof T 
            as `${Key & string}${Key & string}`
    ]: [T[Key]]
}
type res9 = MapType3<{a: 1, b: 2}>
// =============================================