window.onload = function() {
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