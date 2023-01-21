(function ($) {
    //Public namespace object
    let Parser = {};

    //Private constants
    const keywords = ["const", "procedure", "begin", "do", "while", "if", "then", "end", "call"];
    const typeKeywords = ["var", "string", "integer", "float", "boolean"]
    const operators = ["<=", "<", ">", ">=", "=", "odd"];

    //Private variables
    let lastErrors = [];
    let debuggerReady = false;
    let editor = null;

    /** 
     * Event listener that binds all parsing functions to one public namespace.
     */
    window.addEventListener("load", function() {
        //Preapre upload file event
        document.getElementById('upload')?.addEventListener('change', handleFileSelect, false);

        initMonacoEditor();
        initPopover();
        initDebugger();
        initEditorMaxHeight();

        //Store the methods to public namespace.
        window["Parser"] = Parser;

        //Print welcome message <3
        Parser.writeToTerm("Welcome to PL0 parser :)");

        //Always set scroll to top left
        window.scrollTo(0, 0);
    });

    //=======================================================
    //                  Initialize functions 
    //=======================================================

    /**
     * Function to properly initialize input Monaco editor. 
     * This editor is used to highlight the text and underline errors.
     */
    function initMonacoEditor() {
        monaco.languages.register({
            id: 'mylang'
        });
        monaco.languages.setMonarchTokensProvider('mylang', {
            keywords: keywords,
            typeKeywords: typeKeywords,
            operators: operators,
            symbols:  /[=><!~?:&|+\-*\/\^%]+/,
            tokenizer: {
                root: [
                    [ /\(\*/, 'comment', '@comment'],
                    [ /@?[a-zA-Z][\w$]*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@typeKeywords': 'typeKeyword',
                            '@operators': 'operator',
                            '@default': 'variable'
                        }
                    }],
                    [/@symbols/, { 
                        cases: { 
                            '@operators': 'operator',
                            '@default'  : '' 
                        } 
                    }],
                    [/".*?"/, 'string']
                ],
                comment: [
                    [/[^\*\)]+/,    'comment' ],
                    [/\*\)/,        'comment', '@pop'  ],
                    [/[\)\*]/,      'comment' ]
                ]
            }
        });
        monaco.languages.registerCompletionItemProvider('mylang', {
            provideCompletionItems: (model, position) => {
                const suggestions = [
                    ...keywords.map(k => {
                        return {
                            label: k,
                            kind: monacoEditor.languages.CompletionItemKind.Keyword,
                            insertText: k
                        }
                    }),
                    ...typeKeywords.map(k => {
                        return {
                            label: k,
                            kind: monacoEditor.languages.CompletionItemKind.TypeParameter,
                            insertText: k
                        }
                    })
                ]
            }
        })
        monaco.editor.defineTheme('mylang-theme', {
            colors: {},
            base: 'vs',
            rules: [
                {token: 'keyword', foreground: "#FF6600", fontStyle: "bold"},
                {token: 'typeKeyword', foreground: "#FF6600"},
                {token: 'variable', foreground: "#006699"},
                {token: 'operator', foreground: "#7CFC00"},
                {token: 'comment', foreground: "#999999"}
            ]
        });
        monaco.editor.defineTheme('mylang-theme-dark', {
            colors: {
                'editor.foreground': "#FFFFFF",
                'editor.background': "#495057",
                'textSeparator.foreground': "#FFFFFF"
            },
            base: 'vs-dark',
            rules: [
                {token: 'keyword', foreground: "#FF6600", fontStyle: "bold"},
                {token: 'typeKeyword', foreground: "#FF6600"},
                {token: 'variable', foreground: "#03a9fc"},
                {token: 'operator', foreground: "#7CFC00"},
                {token: 'comment', foreground: "#999999"}
            ]
        });
        editor = monaco.editor.create(document.getElementById('editor-in'), {
            value: "const m=7, n=85;\nvar x, y, z, q, r;\n\nprocedure nasobeni;\nvar a, b;\nbegin a := x; b:= y; z:=0;\n\twhile b > 0 do\n\tbegin\n\t\tif odd b then z := z + a;\n\t\t\ta := 2 * a; b := b / 2;\n\tend;\nend;\n\nprocedure deleni;\nvar w;\nbegin r:=x; q := 0; w:= y;\n\twhile w <= r do w := 2*w;\n\twhile w > y do\n\tbegin q:=2*q; w:=w/2;\n\t\tif w <= r\tthen\n\t\tbegin r:=r-w; q:=q+1;\n\t\tend;\n\tend;\nend;\n\nprocedure gcd;\nvar f, g;\nbegin f:=x; g:=y;\n\twhile f#g do\n\tbegin if f <g then g:=g-f;\n\t\tif g<f then f:=f-g;\n\tend;\n\tz := f;\nend;\nbegin\n\tx:=m; y:=n; call nasobeni;\n\ty:=25; y:=3; call deleni;\n\tx:=84; y:=36; call gcd;\nend.",
            language: 'mylang',
            theme: "mylang-theme-dark",
            renderLineHighlight: "none",
            automaticLayout: true
        });

        var validationTimeoutHandle = null;
        editor.onDidChangeModelContent(() => {
          // debounce
          clearTimeout(validationTimeoutHandle);
          validationTimeoutHandle = setTimeout(() => Parser.parse(true), Config.VALIDATION_TIMEOUT);
        });
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
        debuggerFrame.src = Config.DEBUGGER_IP;
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
        
        middleEditor.style.maxHeight = Math.min(middleEditor.getBoundingClientRect().height, window.innerHeight - Config.DEFAULT_CONSOLE_HEIGHT) + "px";
    }


    //=======================================================
    //                  Public methods
    //=======================================================

    /**
     * Primary function to read the content of the input window, use tokenizer and recursive descent
     * to parse the code and print it to the output.
     */
    Parser.parse = function(validateOnly = false, input = null, returnErrors = false) {
        if (!validateOnly) {
            Parser.writeToTerm("Compiling the program..");
        }
        let codeToParse = (input != null ? input : editor.getValue());

        // @ts-ignore Added by library
        tokenizer.setInput(codeToParse);
        // @ts-ignore Added by library
        lastErrors = recursive_descent.program();

        if (lastErrors.length == 0) {
            if (!validateOnly) {
                Parser.writeToTerm("Program compiled successfully.", "green");
                // @ts-ignore Added by library
                print_instruction_list();
            }
            
            monaco.editor.setModelMarkers(editor.getModel(), "owner", []); //Remove markers
        } else {
            if (returnErrors) {
                return lastErrors;
            } 

            prepareErrors(validateOnly);
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
            Parser.error("Debugger is not ready, reloading.");
            debuggerFrame.src = Config.DEBUGGER_IP;
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
     * Prints error message to the terminal
     * 
     * @param {string} errText Error message to show in the terminal
     */
    Parser.error = function(errText) {
        Parser.writeToTerm(errText, "red");
    } 

    /**
     * Ses the theme of the Monaco editor according to the input parameter
     *
     * @param {Number} mode 0 = dark mode; 1 = light mode
     */
    Parser.setMonacoMode= function(mode) {
        if (mode == 0) {
            monaco.editor.setTheme("mylang-theme-dark");
        } else {
            monaco.editor.setTheme("mylang-theme");
        }
    }

    /**
     * Sets the input value in the input editor
     * 
     * @param {String} value Input value
     */
    Parser.setInputValue = function(value) {
        editor.setValue(value);
    }

    //=======================================================
    //                  Private methods
    //=======================================================

    

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
                Parser.writeToTerm("Debugger successfuly connected", "green");
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
     * Show underlines under each word that caused parsing error.
     */
    function prepareErrors(validateOnly) {
        //Remove previous errors from the page
        $(".err").each((index, element) => {
            const jqTarget = $(element);
            jqTarget.replaceWith(jqTarget.text());
        })

        //Show message in console
        for (const errorIndex in lastErrors) {
            const error = lastErrors[errorIndex];

            if (!validateOnly) {
                Parser.error("Error: " + error.err + " (line: " + error.line + ", symbol: " + error.symbol +")");
            }
        }

        //Underline the errors
        const children = $("#editor-in").children();
        const codeLines = editor.getValue().split("\n");

        let errorMarkers = [];

        for (const errorIndex in lastErrors) {
            const error = lastErrors[errorIndex];

            let targetLineIndex = error.line - 1;
            let targetLine = codeLines[targetLineIndex];

            while (targetLine.indexOf(error.symbol) == -1 && targetLineIndex > 0) {
                targetLineIndex--;
                targetLine = codeLines[targetLineIndex];
            }

            const startIndex = targetLine.indexOf(error.symbol);
            const endIndex = targetLine.indexOf(error.symbol) + error.symbol.length + 1;
            
            errorMarkers.push({
                startLineNumber: targetLineIndex + 1,
                endLineNumber: targetLineIndex + 1,
                startColumn: startIndex,
                endColumn: endIndex,
                message: error.err,
                severity: monaco.MarkerSeverity.Error
            })
        }

        monaco.editor.setModelMarkers(editor.getModel(), "owner", errorMarkers);
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

            let target = e.target;
            if (!target) {
                Parser.error("Could not read target event.")
                return;
            }
            
            Parser.setInputValue(target.result + "");
            Parser.writeToTerm("Successfully uploaded file: " + f.name);
        };
        })(f);
        
        // Read in the image file as a data URL.
        reader.readAsText(f);
    }
})($);