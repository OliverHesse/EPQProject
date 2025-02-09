
const literal_to_type = {
    "BOOL_CONST":"BOOL",
    "INTEGER_CONST":"INTEGER",
    "REAL_CONST":"REAL",
    "STRING_LITERAL":"STRING"
}
const type_to_literal = {
    "BOOL": "BOOL_CONST",
    "INTEGER": "INTEGER_CONST",
    "REAL": "REAL_CONST",
    "STRING": "STRING_LITERAL"
  }
class AST{
    eat_self(scope){
       
    }
}
class UnaryOp extends AST{
    constructor(op,expr){
        super()
        this.op = op;
        this.expr = expr;

    }
    async eat_self(scope){
        let expr = await this.expr.eat_self(scope)
        if(expr["type"] == "STRING_LITERAL"){
            runtime_error("STRING_LITERAL cannot have a Unary operator")
        }
        return {"type":expr["type"],"val":BinaryOperations[this.op.type](0,expr["val"])};
    }
}
class BinOp extends AST{
    constructor(left,op,right){
        super()
        this.left = left;
        console.log("construcint BINOP")
        console.log(op)
        this.op = op;
        this.right = right;
    }
    async eat_self(scope){
        
        let left_val = await this.left.eat_self(scope);
        let right_val = await this.right.eat_self(scope);
   
        if(left_val["type"] == right_val["type"]){
            return {"type":left_val["type"],"val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
        }
        if(left_val["type"] == "STRING_LITERAL" || right_val["type"] == "STRING_LITERAL"){
            return {"type":"STRING_LITERAL","val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
        }
        if(left_val["type"] == "REAL_CONST" || right_val["type"] == "REAL_CONST"){
            console.log("PERFRORMIGN CALC");
            console.log(this.op.type);
            if(this.op.type == "INT_DIV"){
                return {"type":"INTEGER_CONST","val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
            }
            return {"type":"REAL_CONST","val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
        }
        if(left_val["type"] == "INTEGER_CONST" || right_val["type"] == "INTEGER_CONST"){
            if(this.op.type == "REAL_DIV"){
                return {"type":"REAL_CONST","val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
            }
            return {"type":"INTEGER_CONST","val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
        }
        
        return {"type":"BOOL_CONST","val":BinaryOperations[this.op.type](left_val["val"],right_val["val"])};
       
    }
}

class Var extends AST{
    constructor(token) {
        super()
        this.token = token
        this.value = token.value
       
    }
    eat_self(scope){
        let active_scope = scope 
        console.log("looking for variable")
        while(true){
            console.log(active_scope)
            if("curr" in active_scope){
                if(this.value in active_scope["curr"]){
                    active_scope = active_scope["curr"]
                    break
                }
                active_scope = active_scope["prev"]
            }else{
               
                if(this.value in active_scope){
                    break
                }
                runtime_error("variable: "+this.value+" does not exist")
                return null

            }

        }

        return {"type":type_to_literal[active_scope[this.value]["type"]],"val":active_scope[this.value]["val"]};
    }
}
class FOR extends AST{
    constructor(id,ini_node,condition,statement,list_statements){
        super()
        this.id = id;
        this.ini_node = ini_node;
        this.condition = condition;
        this.statement = statement;
        this.list_statements = list_statements;
        this.self_scope = {"curr":{}};
    }
    async eat_self(scope){
        this.self_scope = {"curr":{}};
        this.self_scope["prev"] = scope;
        let result = await this.ini_node.eat_self(this.self_scope)
        //should return the id of the counter since it should be the only variable defined at this point in the scope
        let counter_id = Object.keys(this.self_scope["curr"])[0] 
        console.log("id is:")
        console.log(counter_id) 
        while(true){
            let condition = await this.condition.eat_self(this.self_scope)
            if(condition["val"] != true){
                break
            }
            for(const node of this.list_statements){
                let result = await node.eat_self(this.self_scope);
                if(result != undefined){
                    return result;
                }
            }
           
      

            
            let statement = await this.statement.eat_self(this.self_scope);

            let temp_counter = this.self_scope["curr"][counter_id];
            this.self_scope["curr"] = {} //for some reason {counter_id:temp_counter} makes the key counter_id not the val
            this.self_scope["curr"][counter_id] = temp_counter
            console.log("REFRESHING SCPOE");
            console.log(this.self_scope) 
            
        }
        
    }
}
class NoOp extends AST{
    eat_self(scope){}
}
class Assign extends AST{
    constructor(left,right){
        super()
        this.left = left;
        this.right = right;

    }
    async eat_self(scope){
        let active_scope = scope 
        while(true){
            if("curr" in active_scope){
                if(this.left.value in scope["curr"]){
                    active_scope = active_scope["curr"]
                    break
                }
                active_scope = active_scope["prev"]
            }else{
                if(this.left.value in active_scope){
                    break
                }
                runtime_error("variable: "+this.left.value+" does not exist")
                return null

            }

        }
        
        let lv = this.left.value
        console.log(this.right);
        let rv = await this.right.eat_self(scope)
        console.log("testing this type")
        console.log(rv);
        if(!("type" in rv)){
            runtime_error("expected valid type for "+lv)
            return null
        }
        if(literal_to_type[rv["type"]] != active_scope[lv]["type"]){
            runtime_error("expecting type "+active_scope[lv]["type"]+" got " + rv["type"])
            return null
        }
        active_scope[lv]["val"] = rv["val"];
    }
}
class Compound extends AST{
    constructor(){
        super()
        this.children = []
    }
    async eat_self(scope){
        for(const child of this.children){
                        
            let result = await child.eat_self(scope)
          
            if(result != undefined){
                
                return result
            }
        }
 
   
       
    }
}
class INTEGER_CONST extends AST{
    constructor(token){
        super()
        this.token = token;
        this.value = token.value;
    }
    eat_self(scope){
        return {"type":"INTEGER_CONST","val":this.value};
    }
}
class REAL_CONST extends AST{
    constructor(token){
        super()
        this.token = token;
        this.value = token.value; 
    }
    eat_self(scope){
        return {"type":"REAL_CONST","val":this.value};
    }
}

class STRING_LITERAL extends AST{
    constructor(token) {
        super()
        this.token = token;
        this.value = token.value
    }
    eat_self(scope){
        return {"type":"STRING_LITERAL","val":this.value};
    }
}

class BOOL_CONST extends AST{
    constructor(token){
        super()
        this.token = token;
        this.value = token.value
    }
    eat_self(scope){
        return {"type":"BOOL_CONST","val":this.value};
    }
}
class INIT_VARIABLE extends AST{
    constructor(id,type,expr) {
        super()
        this.id = id;
        this.type = type;
        this.expr = expr
    }
    async eat_self(scope){
        let active_scope = scope
        if("curr" in scope){
            active_scope = scope["curr"]
        }
        console.log(this.expr)
        let value = await this.expr.eat_self(scope)
        console.log("testing this type")
        console.log(value);
        if(!("type" in value)){
            runtime_error("expected valid type for "+this.id)
        }
       
        if(literal_to_type[value["type"]] != this.type){
            runtime_error("expecting type "+this.type+" got " + value["type"])
            return null
        }
        //check if variable already exists
 
        if(this.id in active_scope){
            runtime_error("variable "+this.id+" already exists in this scope");
        }
        console.log("this is my scope");
        console.log(active_scope)
        active_scope[this.id] = {"type":this.type,"val":value["val"]};
        return null;
    }
}
class FUNCTION_CALL extends AST{
    constructor(id,args){
        super()

        this.id = id["value"];

        this.args = args;
    }
    async eat_self(scope){
        console.log("RUNNING FUNCTION"+this.id);
        console.log("THIS IS THE SCOPE AVAILABLE");
        console.log(scope)
        let func = function_map[this.id];
        console.log(function_map);
        console.log(this.id);
        let result = await func.run(this.args,scope);
        

        if(result != undefined){
            return result
        }
    }
}

class CONDITIONAL_IF extends AST{
    constructor(condition,true_statement_list,false_statement_list){
        super();
        this.condition = condition;
        this.true_statement_list = true_statement_list;
        this.false_statement_list = false_statement_list;
        this.self_scope = {"curr":{}}
    }
    async eat_self(scope){
        this.self_scope = {"curr":{}}
        let active_scope = {"curr":this.self_scope["curr"],"prev":scope}

        let condition_result = await this.condition.eat_self(scope)
        console.log("HERE")
        if(condition_result["val"] == true){
            for(const statement of this.true_statement_list){
                let result = await statement.eat_self(active_scope);
                if(result != undefined){
                    return result;
                }
            }
         
        }else{
            for(const statement of this.false_statement_list){
                let result = await statement.eat_self(active_scope);
                if(result != undefined){
                    return result;
                }
            }
        }
    }
}
class RETURN extends AST{
    constructor(return_v) {
        super();
        this.return_v = return_v
    }
    async eat_self(scope){
        return await this.return_v.eat_self(scope);
    }
}

class WHILE extends AST{
    constructor(condition,statement_list){
        super();
        this.condition = condition;
        this.statement_list = statement_list;
    }
    async eat_self(scope){
        let local_scope = {"curr":{},"prev":scope}
    
        
        while(true){
            let condition = await this.condition.eat_self(local_scope)
            if(condition["val"] != true){
                break
            }
            for(const node of this.statement_list){
                let result = await node.eat_self(local_scope);
                if(result != undefined){
                    return result;
                }
            }
           
      
            
        }
    }
}

class FUNCTION{
    constructor(root,param_list,type,scope_name) {
        this.root = root;
        this.scope_name = scope_name
        this.param_list = param_list
        this.local_scope = {}
        this.type = type
        this.prev_scope = "global_state_function"
    }
    get_scope(){
        if(this.scope_name == "global_state_function"){
            return this.local_scope;
        }
        return {"curr":this.local_scope,"prev":function_map["global_state_function"].get_scope()};
    }
    async run(args,scope){
        console.log("FUNCTION CALLED")
        this.local_scope = {}
        let param_scope = {"curr":this.local_scope,"prev":scope}

        console.log("generate param scope:")
        console.log(param_scope)
        //check that all args are valid
        //first check if there are the same amount of args]
   
       
        
        if(args == undefined){
            console.log(this.param_list)
            if(this.param_list.length != 0){
                runtime_error("expected "+this.param_list.length+" got 0 for function "+ this.scope_name)
            }
        
            console.log(this.root)
            let results = await this.root.eat_self(this.get_scope());
         
            console.log(results)
            if(results != undefined){
                return results;
            }
            return;
        }
      
        if(args.length != this.param_list.length){
            runtime_error("expected "+this.param_list.length+" got "+ args.length + " for function "+ this.scope_name)
        }    
        
        //now add each to the scope
       
        for (let i = 0; i < args.length; i++) {
            console.log("parsing arg with scope")
            console.log(param_scope);
            let arg = await args[i].eat_self(param_scope)
            console.log("arg parsed");
            if(literal_to_type[arg["type"]] != this.param_list[i]["type"]){
                runtime_error("expected type "+this.param_list[i]["type"] + " for parameter "+this.param_list[i]["id"]+ " got "+ literal_to_type[arg["type"]])
            }
            this.local_scope[this.param_list[i]["id"]] = {"type":this.param_list[i]["type"],"val":arg["val"]}
          }

        let result = await this.root.eat_self(this.get_scope());
     
        if(result != undefined){
            return result;
        }
        this.local_scope = {}
    }
    
}

