//File with configuration options that are used in the application
var Config = {
    /**
     * Address of the debugger that this compiler is integrated to.
     * Without correct URL the debugger integration will not work.
     * Modified version of the debugger with support for IFrame messages has to be used.
     */
    DEBUGGER_IP: "http://localhost:3000",

    /**
     * Default height of the console window in pixels
     */
    DEFAULT_CONSOLE_HEIGHT: 200,

    /**
     * Timeout in milliseconds from the end of inputting code into the editor after which the validation of the
     * input code is started. See documentation, section 3.2 for more information.
     */
    VALIDATION_TIMEOUT: 1000
};

window["Config"] = Config;