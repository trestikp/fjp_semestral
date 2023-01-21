const darkIcon = document.createElement("i");
darkIcon.classList.add("bi", "bi-brightness-high");

const lightIcon = document.createElement("i");
lightIcon.classList.add("bi", "bi-moon-fill");

/**
 * Event listener to correctly handle change of light and dark mode
 */
window.addEventListener("load", function() {
    const modeSwitchButton = document.querySelector("#switchModeBtn");
    modeSwitchButton?.addEventListener("click", function() {
        if(modeSwitchButton.classList.contains("dark")) {
            modeSwitchButton.classList.remove("dark", "btn-warning");
            modeSwitchButton.classList.add("light", "btn-primary");

            modeSwitchButton.replaceChildren(lightIcon);

            Parser.setMonacoMode(1);
        } else {
            modeSwitchButton.classList.remove("light", "btn-primary");
            modeSwitchButton.classList.add("dark", "btn-warning");

            modeSwitchButton.replaceChildren(darkIcon);
            Parser.setMonacoMode(0);
        }

        let darkElements = document.querySelectorAll(".bg-dark");
        let lightElements = document.querySelectorAll(".bg-light");

        let darkTextElements = document.querySelectorAll(".text-dark");
        let lightTextElements = document.querySelectorAll(".text-light");
        
        darkElements.forEach(function(el) {
            el.classList.remove("bg-dark"); 
            el.classList.add("bg-light");
        });
        lightElements.forEach(function(el) {
            el.classList.remove("bg-light"); 
            el.classList.add("bg-dark")
        });
        darkTextElements.forEach(function(el) {
            el.classList.remove("text-dark"); 
            el.classList.add("text-light");
        });
        lightTextElements.forEach(function(el) {
            el.classList.remove("text-light"); 
            el.classList.add("text-dark")
        });
    })
})