(function ($) {
    let resultInstructions = []

    let inputCode = "var res;\n\nbegin\n\t(1 < 2) ? begin res := 5; return res; end; : begin res := 8; return res; end;;\nend.";


    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        throw "Not implemented";

        TestRunner.validateInstructions(resultInstructions);
    }
})($);