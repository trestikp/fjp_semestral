(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "47"],
        ["1", "JMP", "0", "3"],
        ["2", "JMP", "0", "18"],
        ["3", "INT", "0", "4"],
        ["4", "LIT", "0", "0"],
        ["5", "STO", "0", "3"],
        ["6", "LOD", "0", "3"],
        ["7", "LOD", "1", "3"],
        ["8", "OPR", "0", "10"],
        ["9", "JMC", "0", "15"],
        ["10", "LOD", "0", "3"],
        ["11", "LIT", "0", "1"],
        ["12", "OPR", "0", "2"],
        ["13", "STO", "0", "3"],
        ["14", "JMP", "0", "6"],
        ["15", "LOD", "0", "3"],
        ["16", "STO", "1", "4"],
        ["17", "RET", "0", "0"],
        ["18", "INT", "0", "4"],
        ["19", "LIT", "0", "0"],
        ["20", "STO", "0", "3"],
        ["21", "LIT", "0", "3"],
        ["22", "LOD", "1", "3"],
        ["23", "OPR", "0", "3"],
        ["24", "LIT", "0", "3"],
        ["25", "LOD", "1", "3"],
        ["26", "OPR", "0", "3"],
        ["27", "LIT", "0", "0"],
        ["28", "OPR", "0", "10"],
        ["29", "JMC", "0", "3"],
        ["30", "OPR", "0", "1"],
        ["31", "LIT", "0", "1"],
        ["32", "OPR", "0", "3"],
        ["33", "LIT", "0", "0"],
        ["34", "OPR", "0", "12"],
        ["35", "JMC", "0", "41"],
        ["36", "LOD", "0", "3"],
        ["37", "LIT", "0", "1"],
        ["38", "OPR", "0", "2"],
        ["39", "STO", "0", "3"],
        ["40", "JMP", "0", "31"],
        ["41", "JMP", "0", "31"],
        ["42", "INT", "0", "-1"],
        ["43", "JMP", "0", "43"],
        ["44", "LOD", "0", "3"],
        ["45", "STO", "1", "5"],
        ["46", "RET", "0", "0"],
        ["47", "INT", "0", "6"],
        ["48", "LIT", "0", "8"],
        ["49", "STO", "0", "3"],
        ["50", "CAL", "0", "2"],
        ["51", "RET", "0", "0"]
    ]

    let inputCode = "const upper = 8;\nvar res1, res2;\n\nprocedure testWhile;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\twhile i < upper do\n\t\t\ti := i + 1;\n\t\tres1 := i;\n\tend;\n\nprocedure testFor;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\tfor 3 to upper do\n\t\t\ti := i + 1;\n\t\tres2 := i;\n\tend;\n\nbegin\n\t(* call testWhile; *)\n\tcall testFor;\n\n\t(* Expects 8 in res1 and 5 in res2 *)\nend.\n";


    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);