(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "48"],
        ["1", "JMP", "0", "3"],
        ["2", "JMP", "0", "18"],
        ["3", "INT", "0", "5"],
        ["4", "LIT", "0", "0"],
        ["5", "STO", "0", "4"],
        ["6", "LOD", "0", "4"],
        ["7", "LOD", "1", "4"],
        ["8", "OPR", "0", "10"],
        ["9", "JMC", "0", "15"],
        ["10", "LOD", "0", "4"],
        ["11", "LIT", "0", "1"],
        ["12", "OPR", "0", "2"],
        ["13", "STO", "0", "4"],
        ["14", "JMP", "0", "6"],
        ["15", "LOD", "0", "4"],
        ["16", "STO", "1", "5"],
        ["17", "RET", "0", "0"],
        ["18", "INT", "0", "6"],
        ["19", "LIT", "0", "0"],
        ["20", "STO", "0", "4"],
        ["21", "LIT", "0", "3"],
        ["22", "LOD", "1", "4"],
        ["23", "OPR", "0", "3"],
        ["24", "STO", "0", "5"],
        ["25", "LOD", "0", "5"],
        ["26", "LIT", "0", "0"],
        ["27", "OPR", "0", "10"],
        ["28", "JMC", "0", "32"],
        ["29", "LOD", "0", "5"],
        ["30", "OPR", "0", "1"],
        ["31", "STO", "0", "5"],
        ["32", "LOD", "0", "5"],
        ["33", "LIT", "0", "1"],
        ["34", "OPR", "0", "3"],
        ["35", "STO", "0", "5"],
        ["36", "LOD", "0", "5"],
        ["37", "LIT", "0", "0"],
        ["38", "OPR", "0", "11"],
        ["39", "JMC", "0", "45"],
        ["40", "LOD", "0", "4"],
        ["41", "LIT", "0", "1"],
        ["42", "OPR", "0", "2"],
        ["43", "STO", "0", "4"],
        ["44", "JMP", "0", "32"],
        ["45", "LOD", "0", "4"],
        ["46", "STO", "1", "6"],
        ["47", "RET", "0", "0"],
        ["48", "INT", "0", "7"],
        ["49", "LIT", "0", "8"],
        ["50", "STO", "0", "4"],
        ["51", "CAL", "0", "2"],
        ["52", "RET", "0", "0"],
    ]    

    let inputCode = "const upper = 8;\nvar res1, res2;\n\nprocedure testWhile;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\twhile i < upper do\n\t\t\ti := i + 1;\n\t\tres1 := i;\n\tend;\n\nprocedure testFor;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\tfor 3 to upper do\n\t\t\ti := i + 1;\n\t\tres2 := i;\n\tend;\n\nbegin\n\t(* call testWhile; *)\n\tcall testFor;\n\n\t(* Expects 8 in res1 and 5 in res2 *)\nend.\n";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);