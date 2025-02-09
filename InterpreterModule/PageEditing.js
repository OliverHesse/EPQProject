let input = document.getElementById("input_div");
let out = document.getElementById("output_div");
let output = "";
let canRun = false
let input_field = document.getElementById("input_field")
let input_mode = "normal";
let keydownHandler;
let function_map = {}
const fc = {
    red: "<font color='red'>",
}

function read_input(callback){
    return new Promise((resolve) => {
        input_field.value = "";
        input_field.disabled = false;
        input_field.focus()
        input_mode = "reading";
        
        // Define the keydown handler function
        keydownHandler = (e) => {
            if (e.code === "Enter" && input_mode === "reading") {
                let value = input_field.value;
                input_field.value = "";
                input_field.disabled = true;
                input_mode = "normal";
                input_field.blur(); // Optionally blur to remove focus

                // Remove the keydown event listener once it's triggered
                document.removeEventListener('keydown', keydownHandler);

                resolve(value);  // Resolve the promise with the input value
            }
        };

        // Add the keydown event listener
        document.addEventListener('keydown', keydownHandler);
    });
}

function lost_focus(){
    if(input_mode == "reading"){
        input_field.focus()
    }
}

function runtime_error(msg){
    //
    output += fc.red+msg +"</font>" ;
    out.innerHTML = output
    throw msg
}
function update_output(text){
    output += text;
    requestAnimationFrame(() => {
        out.innerHTML = output;
    });
}
document.addEventListener('keydown', (e) => {

    if (e.code == "Tab") {
        e.preventDefault();
        console.log("Tab pressed")
        let text = input.value;
        text = text.slice(0,input.selectionStart)+"\t"+text.slice(input.selectionStart);
        let temp = input.selectionStart;
        input.value = text;
        input.selectionStart = temp+1;
        input.selectionEnd = temp+1;
    }
});