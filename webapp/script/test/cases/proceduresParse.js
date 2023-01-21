(function ($) {
    let resultInstructions = []

    let inputCode = "const a1 = 5;\nvar resFloat1: float;\n\nprocedure test;\n\tbegin\n\tend;\n\nprocedure float returnTest;\n\treturn 2.5;\n\nprocedure paramSimpleTest(p1, p2: float, p3: boolean);\n\tbegin\n\tend;\n\nbegin\n\tcall test;\n\tresFloat1 := call returnTest;\n\tcall paramSimpleTest(a1, 2.8, true);\nend.";


    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        throw "Not implemented";

        TestRunner.validateInstructions(resultInstructions);
    }
})($);