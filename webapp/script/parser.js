/** 
 * Event listener that binds all parsing functions to one public namespace.
 */
window.addEventListener("load", function() {
    let public = {};

    public.parse = parse;
    public.upload = upload;
    public.writeToTerm = writeToTerm;
    public.showTerminal = showTerminal;
    public.debug = debug;
    public.download = download;
    public.copyToClipboard = copyToClipboard;

    window["Parser"] = public;
});

/* TODO: Make private */
function upload() {

}

function parse() {
    
}

function showTerminal() {
    const showTerminalButton = document.querySelector("#showTermBtn");
    const terminalElements = document.querySelectorAll(".terminalElement")
    
    if(showTerminalButton.classList.contains("shown")) {
        showTerminalButton.classList.remove("shown", "btn-danger");
        showTerminalButton.classList.add("hidden", "btn-success");

        terminalElements.forEach((el) => {el.classList.add("h-0")})
    } else {
        showTerminalButton.classList.remove("hidden", "btn-success");
        showTerminalButton.classList.add("shown", "btn-danger");

        terminalElements.forEach((el) => {el.classList.remove("h-0")})
    }
}

function writeToTerm(value) {
    const termName = "ParserTerm>";
    let term = document.querySelector("#editor-terminal");

    term.value += value + '\n' + termName;
}

function debug() {

}

function download() {

}

function copyToClipboard() {

}