(function ($) {
    let resultInstructions = []

    let inputCode = "var int: integer, fl: float, bool: boolean, bool2: boolean;\n\nbegin\n\t{int, fl, bool, bool2} := {5, 2.345, false, true};\n\n\t(* expects the variables to have 5, 2.345, 0 *)\nend.";


    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        throw "Not implemented";

        TestRunner.validateInstructions(resultInstructions);
    }
})($);