//File with configuration options that are used in the application
var Config = {
    /**
     * Address of the debugger that this compiler is integrated to.
     * Without correct URL the debugger integration will not work.
     * Modified version of the debugger with support for IFrame messages has to be used.
     */
    DEBUGGER_IP: "http://localhost:3000"
};

window["Config"] = Config;