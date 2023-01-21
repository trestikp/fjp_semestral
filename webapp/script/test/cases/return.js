(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "15"],
        ["1", "JMP", "0", "3"],
        ["2", "JMP", "0", "10"],
        ["3", "INT", "0", "4"],
        ["4", "LIT", "0", "1"],
        ["5", "LIT", "0", "1"],
        ["6", "OPR", "0", "2"],
        ["7", "STO", "1", "3"],
        ["8", "RET", "0", "0"],
        ["9", "RET", "0", "0"],
        ["10", "INT", "0", "4"],
        ["11", "CAL", "0", "1"],
        ["12", "LOD", "0", "3"],
        ["13", "STO", "1", "4"],
        ["14", "RET", "0", "0"],
        ["15", "INT", "0", "5"],
        ["16", "CAL", "0", "2"],
        ["17", "RET", "0", "0"],
    ]    

    let inputCode = "var res;\n\nprocedure integer onePlusOne;\n\tbegin\n\t\treturn 1+1;\n\tend;\n\nprocedure assignOnePlusOne;\n\tbegin\n\t\tres := call onePlusOne;\n\tend;\n\nbegin\n\tcall assignOnePlusOne;\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);