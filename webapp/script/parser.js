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

    //Preapre upload file event
    document.getElementById('upload').addEventListener('change', handleFileSelect, false);
    writeToTerm("Welcome to PL0 parser :)");
});

/* TODO: Make private */
function upload() {
    document.getElementById('upload')?.click();
}

function parse() {
    let fake_input =  document.getElementById("editor-in").value;
    tokenizer.setInput(fake_input);
    recursive_descent.program();
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

    term.value += termName + value + '\n';
}

function debug() {

}

function download() {

}

function copyToClipboard() {

}

/* Private methods */ 
function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object
  
    // use the 1st file from the list
    let f = files[0];
  
    let reader = new FileReader();
  
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        document.getElementById("upload").value = "";
        document.getElementById("editor-in").innerHTML = e.target.result;
        writeToTerm("Successfully uploaded file: " + f.name);
      };
    })(f);
    
    // Read in the image file as a data URL.
    reader.readAsText(f);
  }