let lastMoveY;
let lastMoveX;

/**
 * Initialize events for resizing the editor windows
 */
window.addEventListener("load", function() {
    createResizeTerminal();
    createResizeEditor();
    createResizeWindowListener();
});

/**
 * Create listener that resets the correct editor window sizes after browser window resize.
 */
function createResizeWindowListener() {
    window.addEventListener("resize", function() {
        if (lastMoveX) {
            setMoveX(lastMoveX);
        }

        if (lastMoveY) {
            setMoveY(lastMoveY);
        }
    })
}

/**
 * Add mouse event listeners for vertical resizing
 */
function createResizeTerminal() {
    let resize = document.querySelector("#resizeTerminal");
    let editor = document.querySelectorAll(".editor");

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
                lastMoveY = moveY;
                setMoveY(moveY);
            }
        });
    })

    editor.forEach(function(el) {
        el.addEventListener("mouseup", function (e) {
            dragY = false;
        });
    })
}

/**
 * Sets correct styles to the console window and the editor windows
 * 
 * @param {Number} moveY Y coordinate of the top of the console window
 */
function setMoveY(moveY) {
    let down = document.querySelector(".terminal");
    let middleEditor = document.querySelector(".middle-editor");
    let resize = document.querySelector("#resizeTerminal");

    down.style.height = document.getElementsByTagName("html")[0].getBoundingClientRect().height - moveY - resize.getBoundingClientRect().height / 2 + "px";
    middleEditor.style.maxHeight = moveY - document.getElementsByTagName("nav")[0].getBoundingClientRect().height - resize.getBoundingClientRect().height / 2 + "px";
} 

/**
 * Add mouse event listeners for horizontal resizing
 */
function createResizeEditor() {
    let resize = document.querySelector("#resize");
    let left = document.querySelector(".left");
    let editor = document.querySelector(".editor");

    let moveX = left.getBoundingClientRect().width + resize.getBoundingClientRect().width / 2;

    var drag = false;
    resize.addEventListener("mousedown", function (e) {
        drag = true;
        moveX = e.x;
    });

    editor.addEventListener("mousemove", function (e) {
        moveX = e.x;
        if (drag) {
            lastMoveX = moveX;
            setMoveX(moveX);        
        }
    });

    editor.addEventListener("mouseup", function (e) {
        drag = false;
    });
}

/**
 * Sets correct styles for left and right editor windows
 * 
 * @param {Number} moveX size of the left window
 */
function setMoveX(moveX) {
    let resize = document.querySelector("#resize");
    let left = document.querySelector(".left");

    left.style.width = moveX - resize.getBoundingClientRect().width / 2 + "px";
}