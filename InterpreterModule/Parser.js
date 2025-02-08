
class Parser{
    constructor(lexer){
        this.lexer = lexer;
        this.tokens = []
        console.log("starting lexer")
        while(true){
        
            let token = lexer.get_next_token();
            this.tokens.push(token)
            console.log(token.type);
            if(token.type == "EOF"){
                break;   
            }
        }
        this.current_position = 0;
        this.current_token = this.tokens[0];
        this.current_scope = "global_state_function"
   
    }
    peek(){
        return this.tokens[this.current_position+1];
    }
    eat(nodeType){
  
        if(this.current_token.type == nodeType){
            this.current_position+=1
            this.current_token = this.tokens[this.current_position];
           
        }else{
            this.error("expected "+nodeType+" got "+this.current_token.type);
        }

    }

    factor(){
        let token = this.current_token;
  
        if(token.type == "PLUS"){
            this.eat("PLUS");
            return new UnaryOp(token,this.factor());
        }
        if(token.type == "SUB"){
            this.eat("SUB");
            return new UnaryOp(token,this.factor());
        }

        if(token.type == "INTEGER_CONST"){
     
            this.eat("INTEGER_CONST");
            return new INTEGER_CONST(token)
        }
        if(token.type == "REAL_CONST"){
            this.eat("REAL_CONST");
            return new REAL_CONST(token)
        }
        if(token.type == "STRING_LITERAL"){
            this.eat("STRING_LITERAL");
            return new STRING_LITERAL(token)
        }
        if(token.type == "BOOL_CONST"){
            this.eat("BOOL_CONST");
            return new BOOL_CONST(token)
        }
        
        if(token.type == "OpenBracket"){
            this.eat("OpenBracket")
            let node = this.expr();
            this.eat("ClosedBracket");
            return node
        }
      
        if(this.peek().type == "OpenBracket"){
            return this.function_call()
        }
    
       
        return this.variable();
    }
    term(priority){
        let node = null
        if(priority == MAX_PRIORITY){
            node = this.factor();
        }else{
            node = this.term(priority+1);

        }
        

        while(operation_priority[priority].includes(this.current_token.type)){
            let token = this.current_token;
       
            this.eat(this.current_token.type);
            if(priority == MAX_PRIORITY){
                
                node = new BinOp(node,token,this.factor())
            }else{
                console.log(token)
                node = new BinOp(node,token,this.term(priority+1))
            }
        

        }
        return node
    }
    expr(){
        let node = this.term(1);
        
        while(operation_priority[0].includes(this.current_token.type)){
            let token = this.current_token;
            this.eat(this.current_token.type)

            node = new BinOp(node,token,this.term(1));
        }
        return node;
    }
    program(){
        let nodes = this.statement_list();
        
        let root = new Compound()
        nodes.forEach(node=>{
            root.children.push(node);
        })
        
        function_map["global_state_function"] = new FUNCTION(root,[],"VOID","global_state_function");
        console.log(function_map)
        return root;
    }
    func_statement_list(){
        let node = this.statement();
        let results= [node]
  
        while(this.current_token.type == "SEMI"){
            console.log("function ting found")
            this.eat("SEMI")
            if(this.current_token.type == "ClosedCurly"){
                break
            }
            results.push(this.statement());
        }
    
      
        if(this.current_token.type == "ID"){
            this.error("unknown id: "+this.current_token.value);
        }
     
        return results
    }
    statement_list(){
        let node = this.statement();
        let results= [node]
        while(this.current_token.type == "SEMI" || this.current_token.type == "ClosedCurly"){
            if(this.current_token.type == "SEMI"){
                this.eat("SEMI")
            }else{
                this.eat("ClosedCurly")
            }
            results.push(this.statement());
        }
        if(this.current_token.type == "ID"){
            this.error("unknown id: "+this.current_token.value);
        }
        return results
    }
    hackystuff(){
        this.eat("ClosedCurly")
        //very hacky do not try at home
        //treats closed curly brackets as semi colons so they can work in statement lists properly
        this.tokens.splice(this.current_position, 0, new Token("SEMI",";"));
        this.current_token = this.tokens[this.current_position];
      

    }
    statement(){

        if(this.current_token.type == "RETURN"){
            this.eat("RETURN");
            let expr = this.expr();
            return new RETURN(expr);
        }
        if(this.current_token.type == "IF"){
            //if stuff here
            this.eat("IF");
            this.eat("OpenBracket");
            let conditions = this.expr();
            this.eat("ClosedBracket");
            this.eat("OpenCurly");
            let true_statement_list = this.func_statement_list();
            let false_statement_list = []
            if(this.peek().type == "ELSE"){
                //stuff to setup else
                this.eat("ClosedCurly")
                this.eat("ELSE");
                this.eat("OpenCurly");
                false_statement_list = this.func_statement_list();
             

            }
            this.hackystuff();
            return new CONDITIONAL_IF(conditions,true_statement_list,false_statement_list);
        }
        if(this.current_token.type == "WHILE"){
            this.eat("WHILE");
            this.eat("OpenBracket");
            //looking for condition
            let condition = this.expr(); 
            this.eat("ClosedBracket");
            this.eat("OpenCurly");
            let nodes = this.func_statement_list();
            this.hackystuff()
            return new WHILE(condition,nodes)
        }
        if(this.current_token.type == "FOR"){
          
            this.eat("FOR");
            this.eat("OpenBracket");
            //looking for variable
            let var_node = this.init_var_statement();
            
            this.eat("COMMA");
            let condition = this.expr();
            this.eat("COMMA");
            let statement = this.assignment_statement();
            this.eat("ClosedBracket")
            this.eat("OpenCurly");
            let nodes = this.func_statement_list();
    
            
            this.hackystuff()
            return new FOR(var_node.id,var_node,condition,statement,nodes);
        }
        if(this.current_token.type == "FUNCTION"){
           
            this.eat("FUNCTION");
            let f_id = this.current_token.value;
            this.current_scope = f_id;
            this.eat("ID");
            this.eat("COLON")
            let f_type = this.current_token.type
            this.eat("TYPE");
            this.eat("OpenBracket");
            //list of params
            let params = []
            while(this.current_token.type != "ClosedBracket"){
          
                let param_id = this.current_token.value;
                this.eat("ID")
                this.eat("COLON")
                let type = this.current_token.value;
                params.push({"id":param_id,"type":type})
                this.eat("TYPE")
                if(this.current_token.type != "ClosedBracket"){
                    this.eat("COMMA")
                }
                
            }

            this.eat("ClosedBracket")
            //generate a statement_list
            this.eat("OpenCurly");
            let nodes = this.func_statement_list();
            
            
            let root = new Compound();
            nodes.forEach(node=>{
                root.children.push(node);
            })
           
            function_map[f_id] = new FUNCTION(root,params,f_type,f_id);
            
            return this.empty();
        }else if(this.current_token.type == "ID"){
            if(this.peek().type == "OpenBracket"){
                return this.function_call()
            }
            return this.assignment_statement();
        
        }else if(this.current_token.type == "VAR"){
            return this.init_var_statement();

        }
        else{
            return this.empty()
        }
    }
    function_call(){
        let id = this.current_token
        this.eat("ID")
        this.eat("OpenBracket")
        let params = []
 
        while(this.current_token.type != "ClosedBracket"){
            params.push(this.expr())
            if(this.current_token.type != "ClosedBracket"){
                this.eat("COMMA")
            }
        }

        this.eat("ClosedBracket")

        return new FUNCTION_CALL(id,params);
   

        
    }
    init_var_statement(){
        this.eat("VAR");
        let id = this.current_token.value;
        this.eat("ID");
        this.eat("COLON");
        let type = this.current_token.value
        this.eat("TYPE");
        this.eat("ASSIGN");
        let right = this.expr();
        return new INIT_VARIABLE(id,type,right);
    }
    assignment_statement(){
        let left = this.variable();
        let token = this.current_token;
        this.eat("ASSIGN");
        let right = this.expr();
        return  new Assign(left,right)
    }

    variable(){

        let id = this.current_token;
        this.eat("ID");
        
        return new Var(id);
    }
    empty(){
        return new NoOp();
    }
    error(message){
        runtime_error(message);
    }
    parse(){
        let node = this.program();
        if(this.current_token.type != "EOF"){
            
            this.error("end of file not reached")
           
        }
        return node;
    }
}