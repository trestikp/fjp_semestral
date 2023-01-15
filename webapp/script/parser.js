//TODO: Move to config
const DEBUGGER_IP = "http://localhost:3000";

(function ($) {
    let Parser = {};

    const CONSOLE_HEIGHT = 200;

    //Private variables
    let lastErrors = [];
    let debuggerReady = false;

    /** 
     * Event listener that binds all parsing functions to one public namespace.
     */
    window.addEventListener("load", function() {
        //Preapre upload file event
        document.getElementById('upload')?.addEventListener('change', handleFileSelect, false);

        initEditorHandlers();
        initPopover();
        initDebugger();
        initEditorMaxHeight();

        //Store the methods to public namespace.
        window["Parser"] = Parser;

        //Print welcome message <3
        Parser.writeToTerm("Welcome to PL0 parser :)");

        //TODO: RESET SCROLL VALUE TO THE TOP LEFT CORNER
    });

    //=======================================================
    //                  Initialize functions 
    //=======================================================

    /**
     * Prepare handlers for handling pressing Tab, Shift+Tab and other functions such as
     * removing error dialogs from lines of code, etc..
     */
    function initEditorHandlers() {
        document.getElementById("editor-in")?.addEventListener("keydown", (e) => {
            if(e.key === 'Tab') {
                //add tab
                var sel, range;
                if (window.getSelection && (sel = window.getSelection())?.rangeCount) {
                    range = sel.getRangeAt(0);

                    if (e.shiftKey) {
                        // @ts-ignore
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
            const selection = window.getSelection();

            if (!selection) {
                return;
            }
            let anchorNode = selection.anchorNode;
            if (anchorNode) {
                let target = null;
                /*debugger;
                let classList = anchorNode.classList;
                if (classList && classList.contains("err")) {
                    target = anchorNode;
                }

                if (!target) {*/
                    let classList = anchorNode.parentElement?.classList;
                    
                    if (classList && classList.contains("err")) {
                        target = anchorNode.parentElement;
                    }
                //}

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

    /**
     * Prepare popover dialogs for showing errors on specified lines of code.
     */
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
                        break;
                    }
                }

                return message;
            }
        }
        
        // @ts-ignore popover function is added by bootstrap library
        $('body').popover(popOverSettings);
    }

    /**
     * Initializes debugger window. Sets the correct debugger address and styles to the iframe.
     */
    function initDebugger() {
        window.addEventListener('message', handleIntegrationMessage);

        let debuggerFrame = document.getElementById("debuggerIframe");

        if (!debuggerFrame) {
            Parser.error("Debugger iframe was not found.");
            return;
        }

        // @ts-ignore debuggerFrame is HTMLIFrameElement not HTMLElement
        debuggerFrame.src = DEBUGGER_IP;
        debuggerFrame.style.top = "99.99vh";
    };

    /**
     * Caclulates the correct maxHeight of the editor
     */
    function initEditorMaxHeight() {
        let middleEditor = document.querySelector(".middle-editor");

        if (!middleEditor) {
            Parser.error("Middle editor was not found.");
            return;
        }

        // @ts-ignore 
        
        middleEditor.style.maxHeight = Math.min(middleEditor.getBoundingClientRect().height, window.innerHeight - CONSOLE_HEIGHT) + "px";
    }


    //=======================================================
    //                  Public methods
    //=======================================================

    /**
     * Primary function to read the content of the input window, use tokenizer and recursive descent
     * to parse the code and print it to the output.
     */
    Parser.parse = function() {
        Parser.writeToTerm("Compiling the program..");
        let fake_input = "";
        $("#editor-in").children().each((index, child) => {
            let text = child?.textContent;

            if (text) {
                fake_input += text + "\n";
            }
        });


        // @ts-ignore Added by library
        tokenizer.setInput(fake_input);
        // @ts-ignore Added by library
        lastErrors = recursive_descent.program();

        if (lastErrors.length == 0) {
            Parser.writeToTerm("Program compiled successfully.", "green");
            // @ts-ignore Added by library
            print_instruction_list();
        } else {
            prepareErrors();
        }
    }

    /**
     * Prints given value in given css color (red, white, #CCCCCC, ...) to the terminal window.
     * 
     * @param {string} value text to write to the terminal
     * @param {string} color color of the text
     */
    Parser.writeToTerm = function(value, color = "") {
        const termName = "ParserTerm>";
        let term = document.querySelector("#editor-terminal");

        if (!term) {
            console.error("Could not find terminal window!");
            console.error("Message that should've been printed: " + value);
            return;
        }

        if (color === "") {
            term.innerHTML += "<p>" + termName + value + '</p>';
        } else {
            term.innerHTML += "<p>" + termName + "<span style='color: " + color + "'>" + value + '</span></p>\n';
        }
    }

    /**
     * Displays or hides the terminal window
     */
    Parser.showTerminal = function() {
        const showTerminalButton = document.querySelector("#showTermBtn");
        const terminalElements = document.querySelectorAll(".terminalElement");
        let middleEditor = document.querySelector(".middle-editor");

        if (!showTerminalButton) {
            Parser.error("Show terminal button was not found.");
            return;
        }

        if (!middleEditor) {
            Parser.error("Editor div was not found.");
            return;
        }
        
        if(showTerminalButton.classList.contains("shown")) {
            showTerminalButton.classList.remove("shown", "btn-danger");
            showTerminalButton.classList.add("hidden", "btn-success");

            middleEditor.classList.add("console-hidden");

            terminalElements.forEach((el) => {el.classList.add("h-0")})
        } else {
            showTerminalButton.classList.remove("hidden", "btn-success");
            showTerminalButton.classList.add("shown", "btn-danger");

            middleEditor.classList.remove("console-hidden");

            terminalElements.forEach((el) => {el.classList.remove("h-0")})
        }
    }

    /**
     * Validates if the debugger is ready and sends the code to the debugger.
     * Debugger window is opened after the code is processed and ready to debug.
     * 
     * If debugger window is opened, then calling this function closes the window.
     */
    Parser.debug = function() {
        let debugButton = document.getElementById("showDebugBtn");
        let debuggerFrame = document.getElementById("debuggerIframe");

        if (!debuggerFrame) {
            Parser.error("Debugger iframe not found.");
            return;
        }

        if (debugButton?.classList.contains("shown")) {
            debuggerFrame.style.top = "99.99vh";

            debugButton?.classList.add("hidden", "btn-success");
            debugButton?.classList.remove("shown", "btn-danger");

            return;
        }

        if (!debuggerReady) {
            Parser.writeToTerm("Debugger is not ready.", "red");
            return;
        }

        const debugCode = document.getElementById("editor-out")?.textContent;
        
        // @ts-ignore debuggerFrame is HTMLIFrameElement not HTMLElement
        debuggerFrame.contentWindow.postMessage(
            {
                "target": "integration",
                "event": "debug",
                "debugCode": debugCode
            }, 
        "*");

        Parser.writeToTerm("Sent code to debugger..");
    }

    /**
     * Downloads the output code into the file.
     */
    Parser.download = function() {
        let textArea = document.getElementById("editor-out");

        if (!textArea) {
            Parser.error("Could not find editor out text area.");
            return;
        }

        let helperAelement = document.createElement('a');
        
        // @ts-ignore textArea is HTMLTextAreaElement not HTMLElement
        helperAelement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textArea.value));
        helperAelement.setAttribute('download', "outputCode.txt");
        helperAelement.click();
    }

    /**
     * Function to trigger the upload dialog.
     */
    Parser.upload = function() {
        document.getElementById('upload')?.click();
    }

    /**
     * Copies the output code into the clipboard.
     */
    Parser.copyToClipboard = function() {
        let textArea = document.getElementById("editor-out");

        if (!textArea) {
            Parser.error("Could not find text area to copy from.");
            return;
        }

        if (!navigator.clipboard){
            debugger;
            // @ts-ignore textArea is HTMLTextAreaElement not HTMLElement
            textArea.disabled = false;
            
            // @ts-ignore textArea is HTMLTextAreaElement not HTMLElement
            textArea.select();
            
            var success = document.execCommand('copy');
            if (success) {
                Parser.writeToTerm("Sucessfully copied to clipboard.", "green");
            } else {
                Parser.writeToTerm("Error copying to clipboard.", "red");
            }
            // @ts-ignore textArea is HTMLTextAreaElement not HTMLElement
            textArea.disabled = true;

            let selection = window.getSelection();

            if (selection == null) {
                return;
            }

            if (selection.empty) {  // Chrome
                selection.empty();
            } else if (selection.removeAllRanges) {  // Firefox
                selection.removeAllRanges();
            }
        } else {
            const textContent = textArea?.textContent;

            if (!textContent) {
                return;
            }

            navigator.clipboard.writeText(textContent).then(
                function() {
                    Parser.writeToTerm("Sucessfully copied to clipboard.", "green");
                    let element = document.getElementById("copyButton");

                    if (!element) {
                        Parser.error("Could not find copy button");
                        return;
                    }

                    element.innerHTML = '<i class="bi bi-check-lg"></i>';

                    setTimeout(() => {
                        // @ts-ignore Element is checked in the parrent.
                        element.innerHTML = '<i class="bi bi-clipboard-fill"></i>';
                    }, 3000)
                }).catch((err) => {
                    Parser.writeToTerm("Error copying to clipboard. Error: " + err, "red");
                })
        }
    }

    /**
     * Processess incoming message from the debugger.
     * 
     * @param {object} event Event object from the debugger containing data
     */
    function handleIntegrationMessage(event) {
        const data = event.data;

        if (data.target == "integration") {
            if (data.event == "READY") {
                debuggerReady = true;
            } else if (data.event == "COMPILATION_ERROR") {
                const parseErrors = data.data.parseErrors;
                for (const errorIndex in parseErrors) {
                    const currError = parseErrors[errorIndex];

                    Parser.writeToTerm("Debugger parse error: " + currError.error, "red");
                }

                const validationErrors = data.data.validationErrors;
                for (const errorIndex in validationErrors) {
                    const currError = validationErrors[errorIndex];

                    Parser.writeToTerm("Debugger validation error: " + currError.error, "red");
                }
            } else if (data.event == "DEBUGGER_START") {
                let debuggerFrame = document.getElementById("debuggerIframe");
                let debugButton = document.getElementById("showDebugBtn");
                const navbar = document.getElementsByTagName("nav")[0];

                if(!debuggerFrame) {
                    Parser.writeToTerm
                    return;
                }
                
                debuggerFrame.style.visibility = "shown";
                debuggerFrame.style.top = navbar.getBoundingClientRect().height + "px";
                debuggerFrame.style.height = "calc(100vh - " + navbar.getBoundingClientRect().height + "px)";

                debugButton?.classList.remove("hidden", "btn-success");
                debugButton?.classList.add("shown", "btn-danger");
            }
        }
    }

    /**
     * Prints error message to the terminal
     * 
     * @param {string} errText Error message to show in the terminal
     */
    Parser.error = function(errText) {
        Parser.writeToTerm(errText, "red");
    } 

    //=======================================================
    //                  Private methods
    //=======================================================

    /**
     * Show underlines under each word that caused parsing error.
     */
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

    /**
     * Handle event of choosing file to upload.
     * This reads the file and puts its content into the editor input window.
     * 
     * @param {object} evt File upload event
     */
    function handleFileSelect(evt) {
        let files = evt.target.files; // FileList object
    
        // use the 1st file from the list
        let f = files[0];
    
        let reader = new FileReader();
    
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
            let uploadElement = document.getElementById("upload");
            if(!uploadElement) {
                Parser.error("Could not find upload input element.")
                return;
            }
            
            // @ts-ignore uploadElement is HTMLInputElement not HTMLElement
            uploadElement.value = "";

            let editorInElement = document.getElementById("editor-in");
            if(!editorInElement) {
                Parser.error("Could not find editor input element.")
                return;
            }

            let target = e.target;
            if (!target) {
                Parser.error("Could not read target event.")
                return;
            }
            
            editorInElement.innerHTML = target.result + "";
            Parser.writeToTerm("Successfully uploaded file: " + f.name);
        };
        })(f);
        
        // Read in the image file as a data URL.
        reader.readAsText(f);
    }
})($);