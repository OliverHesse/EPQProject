





async function run(){
    console.log(input_mode)
    if(input_mode == "reading"){
        console.log("resetting input")
        input_mode = "normal";
        input_field.value = true;
        input_field.disabled = true;
        
    }


    function_map = {
        "input":new INPUT(),
        "print":new PRINT([{"type":"ANY"}],"print"),
        "to_int":new TO_INT([{"type":"ANY"}],"to_int"),
        "to_str":new TO_STR([{"type":"ANY"}],"to_str"),
        "to_real":new TO_REAL([{"type":"ANY"}],"to_real"),
        "valid_int":new VALID_INT([{"type":"ANY"}],"valid_int"),
        "valid_real":new VALID_REAL([{"type":"ANY"}],"valid_real"),
    }
    
    out.innerHTML = "";
    console.log("running");
    output = ""
    out.innerHTML = output;
 
    
    let lexer = new Lexer(input.value);
    let parser = new Parser(lexer)

    let root = parser.parse();

    console.log("starting program")
    console.log(function_map);
  
    let smth = await function_map["global_state_function"].run(undefined,{});

    function_map = {}

    
    
}