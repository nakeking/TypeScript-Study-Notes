//类型断言
var someValue = 'this is a string';
var strLength = someValue.length;
var strLength1 = someValue.length;
create({ prop: 0 });
create(null);
//never类型,异常处理
function error(message) {
    throw new Error(message);
}
//联合类型
var num = 3;
num = null;
//void
function voidFun() {
    console.log("无返回值方法");
}
//只能负责成undefined
var vo = undefined;
//undefined
var un = undefined;
//null
var nu = null;
//any类型,任何类型值
var arr4 = [1, "2", 3, false];
//枚举类型
var Color;
(function (Color) {
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Blue"] = 3] = "Blue";
})(Color || (Color = {}));
var color = Color.Green;
var colorName = Color[2];
console.log(Color);
console.log(color, colorName); //1, "Green"
//数组(类型)
var arr = [1, 2, 3];
var arr2 = [1, 2, 3];
//元组
var arr3;
arr3 = ["snake", 21];
console.log(arr3[0].substr(1));
var User = /** @class */ (function () {
    function User(user, age) {
        this.user = user;
        this.age = age;
        this.result = user + ' ' + age;
    }
    return User;
}());
function greeter(person) {
    return person;
}
var user = {
    user: 'snake皮',
    age: 21
};
var user2 = {
    user: '老王'
};
var user3 = {
    user: 'snake',
    age: 21,
    aihao: "打篮球"
};
var user4 = new User("旋", 21);
console.log(greeter(user));
console.log(greeter(user2));
console.log(greeter(user3));
console.log(greeter(user4));
