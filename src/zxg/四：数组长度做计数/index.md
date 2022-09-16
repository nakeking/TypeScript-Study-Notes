## 数组长度做计数
TypeScript类型系统没有加减乘除运算符。

```
type num1 = [unknown]['length']     // num1 = 1

type num2 = [unknown, unknown]['length']        // num2 = 2
```
**TypeScript类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。**
