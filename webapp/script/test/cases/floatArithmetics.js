(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "59"],
        ["1", "JMP", "0", "5"],
        ["2", "JMP", "0", "23"],
        ["3", "JMP", "0", "35"],
        ["4", "JMP", "0", "47"],
        ["5", "INT", "0", "5"],
        ["6", "LIT", "0", "0.01"],
        ["7", "STO", "0", "4"],
        ["8", "LOD", "0", "4"],
        ["9", "LOD", "1", "4"],
        ["10", "OPR", "0", "2"],
        ["11", "STO", "1", "6"],
        ["12", "LOD", "0", "4"],
        ["13", "LOD", "1", "4"],
        ["14", "OPR", "0", "2"],
        ["15", "LOD", "1", "5"],
        ["16", "OPR", "0", "2"],
        ["17", "STO", "1", "6"],
        ["18", "LOD", "0", "4"],
        ["19", "LIT", "0", "3"],
        ["20", "OPR", "0", "2"],
        ["21", "STO", "1", "7"],
        ["22", "RET", "0", "0"],
        ["23", "INT", "0", "5"],
        ["24", "LIT", "0", "0.01"],
        ["25", "STO", "0", "4"],
        ["26", "LOD", "1", "4"],
        ["27", "LOD", "0", "4"],
        ["28", "OPR", "0", "3"],
        ["29", "STO", "1", "6"],
        ["30", "LOD", "0", "4"],
        ["31", "LIT", "0", "3"],
        ["32", "OPR", "0", "3"],
        ["33", "STO", "1", "7"],
        ["34", "RET", "0", "0"],
        ["35", "INT", "0", "5"],
        ["36", "LIT", "0", "0.5"],
        ["37", "STO", "0", "4"],
        ["38", "LOD", "0", "4"],
        ["39", "LOD", "1", "4"],
        ["40", "OPR", "0", "4"],
        ["41", "STO", "1", "6"],
        ["42", "LOD", "0", "4"],
        ["43", "LIT", "0", "3"],
        ["44", "OPR", "0", "4"],
        ["45", "STO", "1", "7"],
        ["46", "RET", "0", "0"],
        ["47", "INT", "0", "5"],
        ["48", "LIT", "0", "1"],
        ["49", "STO", "0", "4"],
        ["50", "LOD", "0", "4"],
        ["51", "LOD", "1", "5"],
        ["52", "OPR", "0", "5"],
        ["53", "STO", "1", "6"],
        ["54", "LOD", "0", "4"],
        ["55", "LIT", "0", "3"],
        ["56", "OPR", "0", "5"],
        ["57", "STO", "1", "7"],
        ["58", "RET", "0", "0"],
        ["59", "INT", "0", "8"],
        ["60", "LIT", "0", "1.000"],
        ["61", "STO", "0", "4"],
        ["62", "LIT", "0", "0.0001"],
        ["63", "STO", "0", "5"],
        ["64", "CAL", "0", "1"],
        ["65", "CAL", "0", "2"],
        ["66", "CAL", "0", "3"],
        ["67", "CAL", "0", "4"],
        ["68", "RET", "0", "0"]
    ]

    let inputCode = "(* last case in div fails. Note: all variables must have type 'float' specified, \n   because by default variables are integer. All values must have decimal point specified, \n   otherwise they are considered as integers. \n*)\nconst t: float = 1.000, f: float = 0.0001;\nvar a: float, b: float;\n\nprocedure plus;\n\tvar x: float;\n\tbegin\n\t\tx := 0.01;\n\t\ta := x + t; (* 1.01 in a *)\n\t\ta := x + t + f; (* 1.0101 in a *)\n\t\tb := x + 3.0; (* 3.01 in b*)\n\tend;\n\nprocedure minus;\n\tvar x: float;\n\tbegin\n\t\tx := 0.01;\n\t\ta := t - x; (* 0.99 in a *)\n\t\tb := x - 3.0; (* -2.99 in b *)\n\tend;\n\nprocedure mult;\n\tvar x: float;\n\tbegin\n\t\tx := 0.5;\n\t\ta := x * t; (* 0.5 in a *)\n\t\tb := x * 3.0; (* 1.5 in b *)\n\tend;\n\nprocedure div;\n\tvar x: float;\n\tbegin\n\t\tx := 1.0;\n\t\ta := x / f; (* 10000 in a *)\n\t\tb := x / 3.0; (* 0.333 in b TODO: this results in 0 *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);