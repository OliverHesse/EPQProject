
class INPUT extends Function{

    constructor(root,param_list,type,scope_name){
        super(root,param_list,type,scope_name)
    }
    async run(args,scope){
        console.log("input_called");
        const result = await read_input();
        console.log("got value:")
        console.log({"type":"STRING_LITERAL","val":result})
        return {"type":"STRING_LITERAL","val":result}
    }
}


class TO_INT extends FUNCTION{
    constructor(param_list,scope_name){
        super("root", "param_list", "type", scope_name);
        this.param_list = param_list;
        this.scope_name = scope_name;
    }
    async run(args,scope){
        console.log(this.param_list);
        if(args.length != this.param_list.length){
            runtime_error("function to_int() expected 1 argument but got "+args.length)
        }
        let result = await args[0].eat_self(scope);
     
        if(result["type"] == "BOOL_CONST"){
            if(result["val"] == true){
                return {"type":"INTEGER_CONST","val":1}
            }
            return {"type":"INTEGER_CONST","val":0}
        }

        let float_v = parseFloat(result["val"])
        if(isNaN(float_v)){
            runtime_error("cannot convert "+result["val"] + " -> " +" INTEGER")
        }
        let int_v = Math.floor(float_v);
        return {"type":"INTEGER_CONST","val":int_v}
    }
}

class TO_STR extends FUNCTION{
    constructor(param_list,scope_name){
        super("root", "param_list", "type", scope_name);
        this.param_list = param_list;
        this.scope_name = scope_name;
    }
    async run(args,scope){
        console.log(this.param_list);
        if(args.length != this.param_list.length){
            runtime_error("function to_str() expected 1 argument but got "+args.length)
        }
        let result = await args[0].eat_self(scope);
    
        return {"type":"STRING_LITERAL","val":result["val"].toString()}
    }
}
class TO_REAL extends FUNCTION{
    constructor(param_list,scope_name){
        super("root", "param_list", "type", scope_name);
        this.param_list = param_list;
        this.scope_name = scope_name;
    }
    async run(args,scope){
        if(args.length != this.param_list.length){
            runtime_error("function to_real() expected 1 argument but got "+args.length)
        }
        let result = await args[0].eat_self(scope);
        
        if(result["type"] == "BOOL_CONST"){
            if(result["val"] == true){
                return {"type":"REAL_CONST","val":parseFloat(1)}
            }
            return {"type":"REAL_CONST","val":parseFloat(0)}
        }
        let float_v = parseFloat(result["val"])
        if(isNaN(float_v)){
            runtime_error("cannot convert "+result["val"] + " -> " +" REAL")
        }     
        return {"type":"REAL_CONST","val":float_v}
    }
}


class VALID_INT extends FUNCTION{
    constructor(param_list,scope_name) {
        super("root", "param_list", "type", scope_name);
        this.param_list = param_list;
        this.scope_name = scope_name;
    }
    async run(args,scope){
        if(args.length != this.param_list.length){
            runtime_error("function to_real() expected 1 argument but got "+args.length)
        }
        let result = await args[0].eat_self(scope);
          
        if(result["type"] == "BOOL_CONST"){
            
            return {"type":"BOOL_CONST","val":true}
        }

        let float_v = parseFloat(result["val"])
        console.log("THIS IS WHAT I AM GETTING");
        console.log(float_v == NaN)
        if(isNaN(float_v)){
            console.log("this is what i am returning");
            return {"type":"BOOL_CONST","val":false}
        }
        let int_v = Math.floor(float_v);
        return {"type":"BOOL_CONST","val":true}
        
    };
}
class VALID_REAL extends FUNCTION{
    constructor(param_list,scope_name) {
        super("root", "param_list", "type", scope_name);
        this.param_list = param_list;
        this.scope_name = scope_name;
    }
    async run(args,scope){
        if(args.length != this.param_list.length){
            runtime_error("function to_real() expected 1 argument but got "+args.length)
        }
        let result = await args[0].eat_self(scope);

        if(result["type"] == "BOOL_CONST"){
            return {"type":"BOOL_CONST","val":true}
           
        }
        let float_v = parseFloat(result["val"])
        if(isNaN(float_v)){
            return  {"type":"BOOL_CONST","val":false}
        }     
        return {"type":"BOOL_CONST","val":true}
    
        
        
    };
}



class PRINT extends Function{
    constructor(param_list, scope_name) {
        // Assuming no need for 'root' and 'type' as arguments
        super("root", "param_list", "type", scope_name);
        this.param_list = param_list;
        this.scope_name = scope_name;
    }
    
    async run(args,scope){
        console.log(args)
        if(args.length != this.param_list.length){
            runtime_error("function print() expected 1 argument but got "+args.length)
        }
        let result = await args[0].eat_self(scope);
        console.log(result);
        console.log("TRYING TO OUTPUT SMTH")
        if(result["type"] == "STRING_LITERAL"){
            result["val"] = result["val"].replace(/\\n/g,"<br>");
            update_output(result["val"]+"<br>")
        }else if(result["type"] != "VOID"){
            update_output(result["val"]+"<br>")
        }
       
        
    }
}
