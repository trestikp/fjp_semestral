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

    initEditorHandlers();
    initPopover();

});

/* TODO: Make private */

let lastErrors = [];

function upload() {
    document.getElementById('upload')?.click();
}

function initPopover() {
    var popOverSettings = {
        placement: 'bottom',
        container: 'body',
        html: true,
        selector: '[rel="errPopover"]',
        trigger: 'hover',
        content: function () {
            let element = this;
            let message = "";

            while (element != null) {
                message += lastErrors[element.attributes.getNamedItem("data-errindex").value].err + "<br>";

                if (element.parentElement.classList.contains("err")) {
                    element = element.parentElement;
                } else {
                    element = null;
                }
            }

            return message;
        }
    }
    
    $('body').popover(popOverSettings);
}

function initEditorHandlers() {
    document.getElementById("editor-in")?.addEventListener("keydown", (e) => {
        if(e.key === 'Tab') {
            //add tab
            var sel, range;
            if (window.getSelection && (sel = window.getSelection()).rangeCount) {
                range = sel.getRangeAt(0);

                if (e.shiftKey) {
                    let tabChildren = $(sel?.focusNode).find(".tab");
                    if (tabChildren.length > 0) {
                        tabChildren[0].remove();
                    }
                } else {
                    range.collapse(true);
                    var span = document.createElement("span");
                    span.innerHTML = "  ";
                    span.contentEditable = "false";
                    span.classList.add("tab");
                    range.insertNode(span);
            
                    // Move the caret immediately after the inserted span
                    range.setStartAfter(span);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            //prevent focusing on next element
            e.preventDefault()   
        }

        //Mozna to vyhodime, protoze to zase rozjebava select.. :/
        let anchorNode = window.getSelection().anchorNode;
        if (anchorNode) {
            let target = null;
            let classList = anchorNode.classList;
            if (classList && classList.contains("err")) {
                target = anchorNode;
            }

            if (!target) {
                classList = anchorNode.parentElement.classList;
                
                if (classList && classList.contains("err")) {
                    target = anchorNode.parentElement;
                }
            }

            if (target) {
                const jqTarget = $(target);
                jqTarget.replaceWith(jqTarget.text());
            }
        } 

        //Fucks up selection
        /*document.getElementById("editor-in")?.addEventListener("input", (e) => {
            e.target.innerHTML = e.target.innerHTML.replace("&nbsp;", "");
        });*/
    })
}

function parse() {
    Parser.writeToTerm("Compiling the program..");
    let fake_input = "";
    $("#editor-in").children().each((index, child) => {
        let text = child?.textContent;

        if (text) {
            fake_input += text + "\n";
        }
    });

    tokenizer.setInput(fake_input);
    lastErrors = recursive_descent.program();

    if (lastErrors.length == 0) {
        Parser.writeToTerm("Program compiled successfully.", "green");
    } else {
        prepareErrors();
    }
}

function prepareErrors() {
    //Remove previous errors from the page
    $(".err").each((index, element) => {
        const jqTarget = $(element);
        jqTarget.replaceWith(jqTarget.text());
    })

    //Show message in console
    for (const errorIndex in lastErrors) {
        const error = lastErrors[errorIndex];
        Parser.writeToTerm("Error: " + error.err + " (line: " + error.line + ", symbol: " + error.symbol +")", "red")
    }

    //Underline the errors
    const children = $("#editor-in").children();
    for (const errorIndex in lastErrors) {
        const error = lastErrors[errorIndex];
        
        const targetDiv = children.eq(error.line - 1); //Elements start at 0 but lines at 1
        targetDiv.html(targetDiv.html().replace(error.symbol, "<span class='err' rel='errPopover' data-errIndex='" + errorIndex + "'>" + error.symbol + "</span>"));
        const targetUnderlinedError = targetDiv.find(".err[data-errindex='" + errorIndex + "']");
        targetUnderlinedError.on("change", (e) => {
            debugger;
        })
    }
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

function writeToTerm(value, color) {
    const termName = "ParserTerm>";
    let term = document.querySelector("#editor-terminal");

    if (!color) {
        term.innerHTML += "<p>" + termName + value + '</p>';
    } else {
        term.innerHTML += "<p>" + termName + "<span style='color: " + color + "'>" + value + '</span></p>\n';
    }
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