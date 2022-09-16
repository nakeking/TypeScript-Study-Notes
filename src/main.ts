//interface 只读属性(初始化后不可修改)
interface Point{
    readonly x: number
    readonly y: number
}

let p1: Point = {x: 10, y: 20}
//p1.x = 5      TS2540: Cannot assign to 'x' because it is a read-only property. 修改报错，不能修改只读数据

//泛型只读数组 ReadonlyArray
let arr5: number[] = [1,2,3,4];
let readonlyArr: ReadonlyArray<number> = arr5
//readonlyArr.push()    error,不能修改

//interface 可选属性例子
interface Square{
    color: string
    area: number
}

interface SquareConfig{
    color?: string
    width?: number
}

function createSquare(config: SquareConfig): Square {
    let newSquare = {color: "whith", area: 100};
    if(config.color){
        newSquare.color = config.color;
    }
    if(config.width){
        newSquare.area = config.width *config.width
    }
    return newSquare;
}

let mySquare = createSquare({color: "red", width: 100})
console.log(mySquare)

//接口
interface LabelValue{
    label: string                                                
}

function printLabel(labelObj: LabelValue){
    console.log(labelObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"}
printLabel(myObj)

//类型断言
let someValue: any = 'this is a string'
let strLength: number = (<string>someValue).length
let strLength1: number = (someValue as string).length

//Object类型,declare声明
// declare function create(o: object | null): void;
// create({prop: 0})
// create(null)

//never类型,异常处理
function error(message: string): never{
    throw new Error(message)
}

//联合类型
let num: number | null = 3
num = null

//void
function voidFun():void{
    console.log("无返回值方法");
}
//只能负责成undefined
let vo: void = undefined
//undefined
let un: undefined = undefined
//null
let nu: null = null

//any类型,任何类型值
let arr4:any[] = [1,"2",3,false]

//枚举类型
enum Color {
    Red = 1,
    Green,
    Blue
}

let color: Color = Color.Green
let colorName: string = Color[2]
console.log(Color);
console.log(color, colorName);      //1, "Green"

//数组(类型)
let arr: number[] = [1,2,3];
let arr2: Array<number> = [1,2,3];

//元组
let arr3: [string, number]
arr3 = ["snake", 21];
console.log(arr3[0].substr(1));

//接口
interface Person {
    //确定属性,必须传，不能多传，不能少传
    user: string
    //?可选属性,可传可不传
    age?: number,
    //任意属性
    [propName: string]: any

}

class User{
    user: string
    age: number
    result: string
    constructor(user: string, age: number){
        this.user = user
        this.age = age
        this.result = user + ' ' + age
    }
}

function greeter(person: Person){
    return person
}

const foo = <T extends {}>(arg: T): T => {
    return arg
}

let user = {
    user: 'snake皮',
    age: 21
}

let user2 = {
    user: '老王'
}

let user3 = {
    user: 'snake',
    age: 21,
    aihao: "打篮球"
}

let user4 = new User("旋", 21)

console.log(greeter(user));
console.log(greeter(user2));
console.log(greeter(user3));
console.log(greeter(user4));



function picksingleValue<T extends {}>(obj: T, key: keyof T) {
    return obj[key];
}

picksingleValue({
    a: 1,
    b: 'string'
}, 'b')

interface A {
    a: boolean,
    b: string,
    c: number,
    d: () => void
}

type Stringify<T> = {
    [K in keyof T]: string
}

let obj: Stringify<A> = {
    a: true,
    b: '12',
    c: 12,
    d: () => 12
}

type readonlyType<T> = {
    readonly [K in keyof T]: T[K]
}

let readonlyObj: readonlyType<A> = {
    a: true,
    b: '12',
    c: 12,
    d: () => 12
}

readonlyObj.a = 123;


type TypeName<T extends object> = T extends string 
    ? "string"
    : T extends number
    ? "number"
    : "object"

type Naked<T> = T extends boolean ? "Y" : "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

/*
* 先分发到Naked<number> | Naked<boolean>
* 所以结果是 "Y" | "N"
*/
type Distrubuted = Naked<string | boolean>

let a: Distrubuted = "Y"

type NotDistributed = Wrapped<number>


let getName = (): string => {
    return "snake"
}

type FooReturnType = ReturnType<typeof getName>


type numOrStrProp = number | string;

const isString = (arg: unknown): boolean => typeof arg === "string"

function useIt(numOrStr: number | string) {
    if(isString(numOrStr)){
        console.log(numOrStr.length);   // 类型"number"上不存在属性"length"
    }
}

// is 关键字
// const isString = (arg: unknown): arg is string => typeof arg === "string"

// function useIt(numOrStr: number | string) {
//     if(isString(numOrStr)){
//         console.log(numOrStr.length);
//     }
// }

type Falsy = false | "" | 0 | null | undefined;

const isFalsy = (val: unknown): val is Falsy => !val;


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

function useIt2(arg: A | B): void {
    'a' in arg ? arg.useA() : arg.useB();
}


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

  getUserInfo({isLogin: false, form: 'snake'})


  type Partial;

  type Pick;

  type Omit

  type Readonly;

  function pick<T extends object, U extends keyof T>(obj: T): T[];


  type getPick<T, K extends keyof T> = {
    [P in K]: T[P]
  }
  
  type Part = getPick<Record<"a" | "b", number>, "a" | "b", >

  let obj1: Part = {
    a: 123,
    b: "123"
  }

type type1 = "c" | "b";

type type2 = {
    a: number
    b: number
}
let obj2: Exclude<type1, type2> = "b"
