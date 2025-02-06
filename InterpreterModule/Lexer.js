
function isDigit(str) {
    return /^\d+$/.test(str);
}
function isAlpha(char) {
    return char.match(/[a-zA-Z]/) !== null;
}
function isAlphanumericWithUnderscore(str) {
    return /^[a-z0-9_]+$/i.test(str);  // Allows letters, digits, and underscores
}
class Token{
    constructor(type,value){
        this.type = type;
        this.value = value;

    }
    as_str(){
        return "Token("+this.type+","+this.value+")";
    }
}

const RESERVED_KEYWORDS = {
    "function": new Token("FUNCTION","FUNCTION"),
    "void": new Token("TYPE","VOID"),
    "var": new Token("VAR","VAR"),
    "int": new Token("TYPE","INTEGER"),
    "str": new Token("TYPE","STRING"),
    "bool": new Token("TYPE","BOOL"),
    "real": new Token("TYPE","REAL"),
    "MOD": new Token("MOD","MOD"),
    "and": new Token("AND","and"),
    "or": new Token("OR","or"),
    "for":new Token("FOR","for"),
    "while":new Token("WHILE","while"),
    "if":new Token("IF","if"),
    "else":new Token("ELSE","else"),
    "return":new Token("RETURN","return"),
    "true":new Token("BOOL_CONST",true),
    "false":new Token("BOOL_CONST",false)
    
}
class Lexer{

    constructor(text){
        this.text = text;
        this.pos = 0
        this.current_char = this.text[0];
    }
    isAlphanumeric(input){
        return /^[a-zA-Z0-9]+$/.test(input);
    }
    error(message){
        throw message
    }
    advance(){
        this.pos+=1;
        if(this.pos>this.text.length){
            this.current_char = null;
        }else{
            this.current_char = this.text[this.pos];
        }
    }
    skip_whitespace(){
        while(this.current_char != null && /\s/.test(this.current_char)){
            this.advance();
        }
    }
    _id(){
        let result = ""
        console.log(this.current_char);
        while(this.current_char != null && isAlphanumericWithUnderscore(this.current_char)){
            result += this.current_char;
            this.advance();
        }
        console.log(result);
        if(result in RESERVED_KEYWORDS){
            return RESERVED_KEYWORDS[result];
        }else{
            return  new Token("ID",result);
        }
        
        
    }
    peek(){
        let peek_pos = this.pos+1;
        if(peek_pos>this.text.length){
            return null;
        }else{
            return this.text[peek_pos];
        }

    }
    integer(){
        let result = ""
        while(this.current_char != null && isDigit(this.current_char)){
            result += this.current_char;
            this.advance();
        }
        return parseInt(result);
    }
    number(){
        let result = ''
       
        while(this.current_char != null && isDigit(this.current_char)){
            result += this.current_char;
            this.advance();
        }
        if(this.current_char=="."){
            result+=this.current_char;
            this.advance();
            while(this.current_char != null && isDigit(this.current_char)){
                result += this.current_char;
                this.advance();
            }
            return new Token("REAL_CONST",parseFloat(result));
        }else{
            return new Token("INTEGER_CONST",parseInt(result));
        }
    }
    string_literal(){
        let endchar = this.current_char;
        this.advance();
        let result = ""
        while(this.current_char != null && this.current_char != endchar){
            result+=this.current_char;
            this.advance();
        }
        this.advance();
        return new Token("STRING_LITERAL",result);
    }
    get_next_token(){

        while(this.current_char != null){
           
            if (/\s/.test(this.current_char)){
                this.skip_whitespace();
                continue;
            }
            if(this.current_char=='"' || this.current_char == "'"){
                return this.string_literal()
            }
            if(isDigit(this.current_char)){  
                return this.number();
            }
            if(this.current_char=="+"){
                this.advance()
                return new Token("PLUS","+");
            }
            if(this.current_char=="-"){
                this.advance()
                return new Token("SUB","-");
            }
            if(this.current_char=="*"){
                this.advance()
                return new Token("MUL","*");
            }
            if(this.current_char=="/" && this.peek() == "/"){
                this.advance()
                this.advance()
                return new Token("INT_DIV","//");
            }
            if(this.current_char=="/"){
                this.advance()
                return new Token("REAL_DIV","/");
            }
            if(this.current_char=="^"){
                this.advance()
                return new Token("POW","^");
            }
            if(this.current_char=="("){
                this.advance()
                return new Token("OpenBracket","(");
            }
            if(this.current_char==")"){
                this.advance()
                return new Token("ClosedBracket",")");
            }
            if(this.current_char=="{"){
                this.advance()
                return new Token("OpenCurly","{");
            }
            if(this.current_char=="}"){
                this.advance()
                return new Token("ClosedCurly","}");
            }
            if(this.current_char==":"){
                this.advance()
                return new Token("COLON",":");
            }
            if(this.current_char==","){
                this.advance()
                return new Token("COMMA",",");
            }
            if(this.current_char=="."){
                this.advance()
                return new Token("DOT",".");
            }
            if(this.current_char==";"){
                this.advance()
                return new Token("SEMI",";");
            }
            if(this.current_char=="=" && this.peek() == "="){
                this.advance();
                this.advance();
                return new Token("EQ","==");
            }
            if(this.current_char=="="){
                this.advance();
                return new Token("ASSIGN","=");
            }
            if(this.current_char=="<" && this.peek() == "="){
                this.advance();
                this.advance();
                return new Token("LE","<=");
            }
            if(this.current_char==">" && this.peek() == "="){
                this.advance();
                this.advance();
                return new Token("GE",">=")
            }
            if(this.current_char=="!" && this.peek() == "="){
                this.advance();
                this.advance();
                return new Token("NE","!=")
            }
            if(this.current_char=="<"){
                this.advance()
                return new Token("LT","<")
            }
            if(this.current_char==">"){
                this.advance()
                return new Token("GT",">")
            }
            if(isAlpha(this.current_char)){
                return this._id();
            }
        }
        return new Token("EOF","EOF");
    }
}