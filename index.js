let showLastState = true;
let default_name_num =1
let file_holder = document.getElementById("file_nav");
const file_nav_btn = document.getElementById("file_drop_down_btn")
const file_action_window = document.getElementById("file_action_window")
let html_text='<div class="filename" style="width:90%;font-size:1.2rem;">'+'File'+default_name_num+'</div>';

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
document.addEventListener("click",function(e){
    console.log("clicked2")
    if(e.target != file_action_window && file_action_window.contains(e.target) == false){

        if(file_action_window.classList.contains("hide") == false){
            file_action_window.classList.add("hide")
        }
    }
    if(e.target.id == "file_actions_btn" || e.target.className == "file_actions"){
        file_action_window.style.top = e.clientY+"px";
        file_action_window.style.left = e.clientX+"px";
        file_action_window.classList.remove("hide");
    }
    if(e.target != file_nav_btn && file_nav_btn.contains(e.target) == false && e.target != file_holder && file_holder.contains(e.target)==false&&file_holder_visible){
        console.log("changing visibility")
        file_holder_visible = false;
        file_holder.classList.add("hide")
    }

})

function onChangeOldRuntimeState(e){
    if(e.children[0].classList.contains("drop_down_closed_line3")){
        e.children[0].classList.remove("drop_down_closed_line3")
        e.children[0].classList.add("drop_down_closed_line1")
    }else{
        e.children[0].classList.remove("drop_down_closed_line1")
        e.children[0].classList.add("drop_down_closed_line3")
    }
    if(e.children[1].classList.contains("drop_down_closed_line4")){
        e.children[1].classList.remove("drop_down_closed_line4")
        e.children[1].classList.add("drop_down_closed_line2")
    }else{
        e.children[1].classList.remove("drop_down_closed_line2")
        e.children[1].classList.add("drop_down_closed_line4") 
    }
    let text_area = e.parentNode.parentNode.children[1]
    if(text_area.classList.contains("hide")){
        text_area.classList.remove("hide")
    }else{
        text_area.classList.add("hide")
    }
    console.log(e);
}

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

function load_file(file_id){
    
}


function changeActiveFile(e){
    if( e.target.className == "file_actions" ||e.target.id == "file_actions_btn"){
        return
    }
    console.log("changing active file")
    console.log(e)
    let div =document.getElementById("active_file_name");
    if (e.target.id == "" ){
        div.innerHTML = e.target.parentNode.id+".cl"
    }else{
        div.innerHTML = e.target.id+".cl"
    }
   
    load_file(0)
    
}
function onAddFileClick(e){

    
    let tempDiv = document.createElement('button');
    tempDiv.className = "storedFileTab";
    tempDiv.id = "File"+default_name_num
    tempDiv.innerHTML = html_text
    
    let html_button = document.createElement("button")
    html_button.id = "file_actions_btn" 
    html_button.addEventListener("click",openFileActions)
    html_button.innerHTML = html_text2
    tempDiv.appendChild(html_button);
    tempDiv.addEventListener("click",changeActiveFile)
    file_holder.insertBefore(tempDiv,file_holder.lastElementChild );
    default_name_num += 1;
}