let showLastState = true;


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