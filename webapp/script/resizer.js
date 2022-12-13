window.addEventListener("load", function() {
    createResizeTerminal();
    createResizeEditor();
});

function createResizeTerminal() {
    let resize = document.querySelector("#resizeTerminal");
    let down = document.querySelector(".terminal");
    let editor = document.querySelectorAll(".editor");
    let middleEditor = document.querySelector(".middle-editor");

    var dragY = false;
    resize.addEventListener("mouseup", function (e) {
        dragY = false;
    });

    resize.addEventListener("mousedown", function (e) {
        dragY = true;
    });

    editor.forEach(function(el) {
        el.addEventListener("mousemove", function (e) {
            let moveY = e.y;
            if (dragY) {
                down.style.height = document.getElementsByTagName("html")[0].getBoundingClientRect().height - moveY - resize.getBoundingClientRect().height / 2 + "px";
                middleEditor.style.maxHeight = moveY - document.getElementsByTagName("nav")[0].getBoundingClientRect().height - resize.getBoundingClientRect().height / 2 + "px";
            }
        });
    })

    editor.forEach(function(el) {
        el.addEventListener("mouseup", function (e) {
            dragY = false;
        });
    })

    
}

function createResizeEditor() {
    let resize = document.querySelector("#resize");
    let left = document.querySelector(".left");
    let editor = document.querySelector(".editor");

    let moveX =
    left.getBoundingClientRect().width +
    resize.getBoundingClientRect().width / 2;

    var drag = false;
    resize.addEventListener("mousedown", function (e) {
    drag = true;
    moveX = e.x;
    });

    editor.addEventListener("mousemove", function (e) {
    moveX = e.x;
    if (drag)
        left.style.width =
            moveX - resize.getBoundingClientRect().width / 2 + "px";
    });

    editor.addEventListener("mouseup", function (e) {
    drag = false;
    });
}