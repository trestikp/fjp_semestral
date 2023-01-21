(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "53"],
        ["1", "JMP", "0", "5"],
        ["2", "JMP", "0", "17"],
        ["3", "JMP", "0", "29"],
        ["4", "JMP", "0", "41"],
        ["5", "INT", "0", "5"],
        ["6", "LIT", "0", "5"],
        ["7", "STO", "0", "4"],
        ["8", "LOD", "0", "4"],
        ["9", "LOD", "1", "4"],
        ["10", "OPR", "0", "2"],
        ["11", "STO", "1", "6"],
        ["12", "LOD", "0", "4"],
        ["13", "LIT", "0", "3"],
        ["14", "OPR", "0", "2"],
        ["15", "STO", "1", "7"],
        ["16", "RET", "0", "0"],
        ["17", "INT", "0", "5"],
        ["18", "LIT", "0", "5"],
        ["19", "STO", "0", "4"],
        ["20", "LOD", "0", "4"],
        ["21", "LOD", "1", "4"],
        ["22", "OPR", "0", "3"],
        ["23", "STO", "1", "6"],
        ["24", "LOD", "0", "4"],
        ["25", "LIT", "0", "3"],
        ["26", "OPR", "0", "3"],
        ["27", "STO", "1", "7"],
        ["28", "RET", "0", "0"],
        ["29", "INT", "0", "5"],
        ["30", "LIT", "0", "5"],
        ["31", "STO", "0", "4"],
        ["32", "LOD", "0", "4"],
        ["33", "LOD", "1", "5"],
        ["34", "OPR", "0", "4"],
        ["35", "STO", "1", "6"],
        ["36", "LOD", "0", "4"],
        ["37", "LIT", "0", "3"],
        ["38", "OPR", "0", "4"],
        ["39", "STO", "1", "7"],
        ["40", "RET", "0", "0"],
        ["41", "INT", "0", "5"],
        ["42", "LIT", "0", "5"],
        ["43", "STO", "0", "4"],
        ["44", "LOD", "0", "4"],
        ["45", "LOD", "1", "5"],
        ["46", "OPR", "0", "5"],
        ["47", "STO", "1", "6"],
        ["48", "LOD", "0", "4"],
        ["49", "LIT", "0", "3"],
        ["50", "OPR", "0", "5"],
        ["51", "STO", "1", "7"],
        ["52", "RET", "0", "0"],
        ["53", "INT", "0", "8"],
        ["54", "LIT", "0", "10"],
        ["55", "STO", "0", "4"],
        ["56", "LIT", "0", "5"],
        ["57", "STO", "0", "5"],
        ["58", "CAL", "0", "1"],
        ["59", "CAL", "0", "2"],
        ["60", "CAL", "0", "3"],
        ["61", "CAL", "0", "4"],
        ["62", "RET", "0", "0"],
    ]    

    let inputCode = "(* all procedures called and gave expected results *)\nconst t = 10, f = 5;\nvar a, b;\n\nprocedure plus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x + t; (* 15 in a *)\n\t\tb := x + 3; (* 8 in b*)\n\tend;\n\nprocedure minus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x - t; (* -5 in a *)\n\t\tb := x - 3; (* 2 in b *)\n\tend;\n\nprocedure mult;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x * f; (* 25 in a *)\n\t\tb := x * 3; (* 15 in b *)\n\tend;\n\nprocedure div;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x / f; (* 1 in a *)\n\t\tb := x / 3; (* 1 in b *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);