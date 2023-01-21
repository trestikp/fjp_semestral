(function ($) {
    let resultInstructions = []

    let inputCode = "var i;\n\nprocedure callMe;\n\tbegin\n\t\ti := i - 1;\n\t\tif i > 0 then call callMe;\n\tend;\n\nbegin\n\ti := 5;\n\tcall callMe;\n\n\t(* recursion DOES NOT WORK!!! - expected *)\nend.";


    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        throw "Not implemented";

        TestRunner.validateInstructions(resultInstructions);
    }
})($);