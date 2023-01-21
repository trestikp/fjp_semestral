(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "1"],
        ["1", "INT", "0", "5"],
        ["2", "LIT", "0", "1"],
        ["3", "LIT", "0", "2"],
        ["4", "OPR", "0", "10"],
        ["5", "JMC", "0", "12"],
        ["6", "LIT", "0", "5"],
        ["7", "STO", "0", "4"],
        ["8", "LOD", "0", "4"],
        ["9", "STO", "0", "3"],
        ["10", "LOD", "0", "3"],
        ["11", "JMP", "0", "17"],
        ["12", "LIT", "0", "8"],
        ["13", "STO", "0", "4"],
        ["14", "LOD", "0", "4"],
        ["15", "STO", "0", "3"],
        ["16", "LOD", "0", "3"],
        ["17", "RET", "0", "0"],
    ]    

    let inputCode = "var res;\n\nbegin\n\t(1 < 2) ? begin res := 5; return res; end; : begin res := 8; return res; end;;\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);