function POW(num1,num2){
    return num1**num2;
}
function PLUS(num1,num2){
    return num1+num2;
}
function SUB(num1,num2){
    return num1-num2;
}
function MUL(num1,num2){
    console.log("mutliplying numbers")
    console.log(num1);
    console.log(num2);
    return num1*num2;
}
function INT_DIV(num1,num2){
    return Math.floor(num1/num2)
}
function REAL_DIV(num1,num2){
    return num1/num2
}
function MOD(num1,num2){
    return num1%num2;
}
function EQ(v1,v2){   
    return v1 === v2;
}
function GE(v1,v2){
    return v1 >= v2;
}
function LE(v1,v2){
    return v1 <= v2;
}
function LT(v1,v2){
    return v1 < v2;
}
function GT(v1,v2){
    return v1>v2;
}
function NE(v1,v2){
    return v1 != v2;
}
function AND(v1,v2){
    return v1 && v2;
}
function OR(v1,v2){
    return v1 || v2;
}
const BinaryOperations = {
    "POW": POW,
    "PLUS": PLUS,
    "SUB": SUB,
    "MUL":MUL,
    "INT_DIV": INT_DIV,
    "REAL_DIV": REAL_DIV,
    "MOD": MOD,
    "EQ": EQ,
    "GE": GE,
    "LE": LE,
    "LT": LT,
    "GT": GT,
    "NE": NE,
    "AND": AND,
    "OR": OR
};
const  operation_priority ={
    0:["AND","OR"],
    1:["EQ","GE","LE","LT","NE"],
    2:["PLUS","SUB"],
    3:["REAL_DIV","INT_DIV","MUL","MOD"],
    4:["POW"]
}
const MAX_PRIORITY = 4;