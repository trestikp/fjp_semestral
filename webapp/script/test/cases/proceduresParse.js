(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "19"],
        ["1", "JMP", "0", "4"],
        ["2", "JMP", "0", "6"],
        ["3", "JMP", "0", "11"],
        ["4", "INT", "0", "4"],
        ["5", "RET", "0", "0"],
        ["6", "INT", "0", "4"],
        ["7", "LIT", "0", "2.5"],
        ["8", "STO", "1", "3"],
        ["9", "RET", "0", "0"],
        ["10", "RET", "0", "0"],
        ["11", "INT", "0", "7"],
        ["12", "LOD", "0", "-1"],
        ["13", "STO", "0", "6"],
        ["14", "LOD", "0", "-2"],
        ["15", "STO", "0", "5"],
        ["16", "LOD", "0", "-3"],
        ["17", "STO", "0", "4"],
        ["18", "RET", "0", "0"],
        ["19", "INT", "0", "6"],
        ["20", "LIT", "0", "5"],
        ["21", "STO", "0", "4"],
        ["22", "CAL", "0", "1"],
        ["23", "CAL", "0", "2"],
        ["24", "LOD", "0", "3"],
        ["25", "STO", "0", "5"],
        ["26", "LOD", "0", "4"],
        ["27", "LIT", "0", "2.8"],
        ["28", "LIT", "0", "1"],
        ["29", "CAL", "0", "3"],
        ["30", "INT", "0", "-3"],
        ["31", "RET", "0", "0"],
    ]    

    let inputCode = "const a1 = 5;\nvar resFloat1: float;\n\nprocedure test;\n\tbegin\n\tend;\n\nprocedure float returnTest;\n\treturn 2.5;\n\nprocedure paramSimpleTest(p1, p2: float, p3: boolean);\n\tbegin\n\tend;\n\nbegin\n\tcall test;\n\tresFloat1 := call returnTest;\n\tcall paramSimpleTest(a1, 2.8, true);\nend.";
    
    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);