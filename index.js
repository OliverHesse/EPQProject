let showLastState = true;
let default_name_num =1
let file_holder = document.getElementById("file_nav");

let file_data_holder = {"File":""}
let active_file = "File"


const file_nav_btn = document.getElementById("file_drop_down_btn")
const file_action_window = document.getElementById("file_action_window")

let html_text='<div class="filename" style="width:90%;font-size:1.2rem;">'+'File'+'</div>';

let html_button = document.createElement("button")
html_button.id = "file_actions_btn" 

let html_text2=
            '<div class="file_actions"></div>'+
            '<div class="file_actions"></div>'+
            '<div class="file_actions"></div>';
html_button.innerHTML = html_text2
base_file_name = "File"
let tempDiv = document.createElement('button');
tempDiv.className = "storedFileTab";
tempDiv.id = "File"
tempDiv.innerHTML = html_text
tempDiv.appendChild(html_button);
tempDiv.addEventListener("click",changeActiveFile)
file_holder.insertBefore(tempDiv,file_holder.firstChild);



let file_holder_visible = false
let file_action_file_name = ""
//used to display and hide the file manager context menue
document.addEventListener("click",function(e){
    console.log("clicked2")
    if(e.target != file_action_window && file_action_window.contains(e.target) == false){

        if(file_action_window.classList.contains("hide") == false){
            file_action_window.classList.add("hide")
        }
    }
    if(e.target.id == "file_actions_btn" || e.target.className == "file_actions"){
        //file manager is open
        file_action_window.style.top = e.clientY+"px";
        file_action_window.style.left = e.clientX+"px";
        file_action_window.classList.remove("hide");
        if(e.target.id == "file_actions_btn"){
            file_action_file_name = e.target.parentNode.id
        }else{
            file_action_file_name = e.target.parentNode.parentNode.id
        }
    }
    if(e.target != file_nav_btn && file_nav_btn.contains(e.target) == false && e.target != file_holder && file_holder.contains(e.target)==false&&file_holder_visible){
        console.log("changing visibility")
        file_holder_visible = false;
        file_holder.classList.add("hide")
    }

})



function onShowLastClick(e){
    console.log(e);
    slider = e.children[0]
    circle = e.children[1]
    if (showLastState){
        slider.className = "inactive_slider";
        circle.className = "inactive_slider_circle";
        showLastState = false;

    }else{
        slider.className = "active_slider";
        circle.className = "active_slider_circle";
        showLastState = true;
    }
}

function openFileHolder(e){
    console.log(file_holder.classList)
    if (file_holder_visible){
        file_holder_visible = false;
        file_holder.classList.add("hide")
    }else{
        file_holder_visible = true;
        file_holder.classList.remove("hide")
    }
}

function onEditorTextInput(e){
    file_data_holder[active_file] = input.value;
}
input.addEventListener("input",function(event){
    onEditorTextInput(event)
})

function load_file(file_name){
    active_file = file_name
    input.value = file_data_holder[active_file];
}

function onDownloadCurrentFileClicked(){
    let text = input.value;
    
    const a = document.createElement('a') // Create "a" element
    const blob = new Blob([text], {type: "text/plain"}) // Create a blob (file-like object)
    const url = URL.createObjectURL(blob) // Create an object URL from blob
    a.setAttribute('href', url) // Set "a" element link
    a.setAttribute('download', active_file+".txt") // Set download filename
    a.click() // Start downloading
}

function download_file(file_name){
    let text = file_data_holder[file_name]
    
    const a = document.createElement('a') // Create "a" element
    const blob = new Blob([text], {type: "text/plain"}) // Create a blob (file-like object)
    const url = URL.createObjectURL(blob) // Create an object URL from blob
    a.setAttribute('href', url) // Set "a" element link
    a.setAttribute('download', file_name+".txt") // Set download filename
    a.click() // Start downloading

}



function changeActiveFile(e){
    if( e.target.className == "file_actions" ||e.target.id == "file_actions_btn"){
        return
    }
    console.log("changing active file")
    console.log(e)
    let file_name = ""
    let div =document.getElementById("active_file_name");
    if (e.target.id == "" ){
        file_name = e.target.parentNode.id
        div.innerHTML = e.target.parentNode.id+".cl"
    }else{
        file_name = e.target.id
        div.innerHTML = e.target.id+".cl"
    }
   
    load_file(file_name)
    
}
function onAddFileClick(text){
    let invalid_name = true;
    while(invalid_name){
        if("File"+default_name_num in file_data_holder){
            default_name_num += 1;
        }else{
            invalid_name = false;
        }
    }

    if (typeof text === 'string' || text instanceof String){
        file_data_holder['File'+default_name_num] = text;
    }else{
        file_data_holder['File'+default_name_num] = "";
    }

    let html_text='<div class="filename" style="width:90%;font-size:1.2rem;">'+'File'+default_name_num+'</div>';
    let tempDiv = document.createElement('button');
    tempDiv.className = "storedFileTab";
    tempDiv.id = "File"+default_name_num
    tempDiv.innerHTML = html_text
    
    let html_button = document.createElement("button")
    html_button.id = "file_actions_btn" 
    
    html_button.innerHTML = html_text2
    tempDiv.appendChild(html_button);
    tempDiv.addEventListener("click",changeActiveFile)
    file_holder.insertBefore(tempDiv,file_holder.lastElementChild );
    default_name_num += 1;
}
const editor = document.getElementById("input_div");
console.log(editor.children)
console.log(editor.childNodes)
let shouldFireChange = false;
editor.addEventListener("input", function() {
  shouldFireChange = true;
  
  console.log("test")
  //TODO work in progress
  //highlight_key_words()
});
//editor.addEventListener("focusout", function() {
  //if(shouldFireChange) {
    //shouldFireChange = false;
    // add emulated 'onchange' code here
    //console.log("changing colors")
    //highlight_key_words()
  //}
//});




function highlight_key_words(){
    //actualy returns lines
    let lines = editor.childNodes
    let current_line = -1
   
    console.log(relativeSelection)
    for(const line of lines){
        if(line.nodeName == "DIV"){
            current_line += 1
            let output_text = ""
            
            for(const node of line.childNodes){
              
               
         
                if (node.nodeName == "SPAN"){
                    //check if nodes is a valid keyword/true false or number
                    if(!(node.innerHTML in RESERVED_KEYWORDS)){
                        output_text += node.innerHTML;
                       
                    }else{
                        output_text += node.outerHTML;
                       
                    }
                }else if(node.nodeName == "#text"){
                
                    output_text += color_key_words(node.textContent);
                }
             
                
            }
            line.innerHTML = output_text
        }
     
      
    }
    


}
function clear_empty_or_broken_spans(){}
function color_key_words(text){
    let new_text = text ||""
    let colors = {number:"#a7e022",keyword:"#0033B3",true_false:"#db2abe"};
 
    for(const keyword of Object.keys(RESERVED_KEYWORDS)){

        const regex = new RegExp(`\\b(${keyword})\\b`, 'g'); // Matches whole words only
        
        new_text = new_text.replace(regex, `<span style="color: #0033B3;">${keyword}</span>`);
        
    }

    
    return new_text
}


function onFileDownloadPressed(event){
    let file_name = file_action_file_name;
    download_file(file_name);
    file_action_window.classList.add("hide")
}


function delete_file(e){
    //some quackery to get file name and div
    let file_name = file_action_file_name;
    let file_div = document.getElementById(file_name);

    //delete file here
    file_div.remove();
    delete file_data_holder[file_name]

    if(file_name == active_file){
        //need to make new active file 
        let new_active = file_holder.firstChild.id
        let div =document.getElementById("active_file_name");
        div.innerHTML = new_active +".cl"
        load_file(new_active)        
    }
    file_action_window.classList.add("hide")
}


function duplicate_file(e){

    //some stuff to get file name
    let file_name = file_action_file_name;

    onAddFileClick(file_data_holder[file_name])
    file_action_window.classList.add("hide")
}

function start_renaming_process(){
    file_action_window.classList.add("hide");
    
    let modal = document.getElementsByClassName("modal")[0]
    document.getElementById("rename_input").value = ""
    modal.style.display = "flex";   
  
}

function confirm_change_file_name(){
    let modal = document.getElementsByClassName("modal")[0]
    
    modal.style.display = "none";
    let new_name = document.getElementById("rename_input").value;
    let file_div = document.getElementById(file_action_file_name)
    if(new_name in file_data_holder){
        return
    }
    if(file_action_file_name == active_file){
        active_file = new_name
        let div =document.getElementById("active_file_name");
        div.innerHTML = active_file +".cl"
    }
    file_div.id = new_name
    file_div.children[0].innerHTML = new_name
    let file_data = file_data_holder[file_action_file_name]
    delete file_data_holder[file_action_file_name]
    file_data_holder[new_name] = file_data
    console.log(file_data_holder)
}
function cancel_rename(){
    let modal = document.getElementsByClassName("modal")[0]
    
    modal.style.display = "none";   
}