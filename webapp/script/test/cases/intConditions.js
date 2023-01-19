(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "1"],
        ["1", "INT", "0", "7"],
        ["2", "LIT", "0", "5"],
        ["3", "STO", "0", "3"],
        ["4", "LIT", "0", "2"],
        ["5", "STO", "0", "4"],
        ["6", "LIT", "0", "0"],
        ["7", "STO", "0", "5"],
        ["8", "LIT", "0", "0"],
        ["9", "STO", "0", "6"],
        ["10", "LOD", "0", "3"],
        ["11", "LIT", "0", "5"],
        ["12", "OPR", "0", "8"],
        ["13", "JMC", "0", "18"],
        ["14", "LOD", "0", "5"],
        ["15", "LIT", "0", "1"],
        ["16", "OPR", "0", "2"],
        ["17", "STO", "0", "5"],
        ["18", "LOD", "0", "3"],
        ["19", "LIT", "0", "5"],
        ["20", "OPR", "0", "10"],
        ["21", "JMC", "0", "26"],
        ["22", "LOD", "0", "5"],
        ["23", "LIT", "0", "1"],
        ["24", "OPR", "0", "2"],
        ["25", "STO", "0", "5"],
        ["26", "LOD", "0", "3"],
        ["27", "LIT", "0", "5"],
        ["28", "OPR", "0", "12"],
        ["29", "JMC", "0", "34"],
        ["30", "LOD", "0", "5"],
        ["31", "LIT", "0", "1"],
        ["32", "OPR", "0", "2"],
        ["33", "STO", "0", "5"],
        ["34", "LOD", "0", "3"],
        ["35", "LIT", "0", "5"],
        ["36", "OPR", "0", "11"],
        ["37", "JMC", "0", "42"],
        ["38", "LOD", "0", "5"],
        ["39", "LIT", "0", "1"],
        ["40", "OPR", "0", "2"],
        ["41", "STO", "0", "5"],
        ["42", "LOD", "0", "3"],
        ["43", "LIT", "0", "5"],
        ["44", "OPR", "0", "13"],
        ["45", "JMC", "0", "50"],
        ["46", "LOD", "0", "5"],
        ["47", "LIT", "0", "1"],
        ["48", "OPR", "0", "2"],
        ["49", "STO", "0", "5"],
        ["50", "LOD", "0", "3"],
        ["51", "LIT", "0", "5"],
        ["52", "OPR", "0", "9"],
        ["53", "JMC", "0", "58"],
        ["54", "LOD", "0", "5"],
        ["55", "LIT", "0", "1"],
        ["56", "OPR", "0", "2"],
        ["57", "STO", "0", "5"],
        ["58", "LOD", "0", "3"],
        ["59", "LIT", "0", "1"],
        ["60", "OPR", "0", "9"],
        ["61", "JMC", "0", "66"],
        ["62", "LOD", "0", "5"],
        ["63", "LIT", "0", "1"],
        ["64", "OPR", "0", "2"],
        ["65", "STO", "0", "5"],
        ["66", "LOD", "0", "3"],
        ["67", "LOD", "0", "4"],
        ["68", "OPR", "0", "8"],
        ["69", "JMC", "0", "74"],
        ["70", "LOD", "0", "6"],
        ["71", "LIT", "0", "1"],
        ["72", "OPR", "0", "2"],
        ["73", "STO", "0", "6"],
        ["74", "LOD", "0", "3"],
        ["75", "LOD", "0", "4"],
        ["76", "OPR", "0", "10"],
        ["77", "JMC", "0", "82"],
        ["78", "LOD", "0", "6"],
        ["79", "LIT", "0", "1"],
        ["80", "OPR", "0", "2"],
        ["81", "STO", "0", "6"],
        ["82", "LOD", "0", "3"],
        ["83", "LOD", "0", "4"],
        ["84", "OPR", "0", "12"],
        ["85", "JMC", "0", "90"],
        ["86", "LOD", "0", "6"],
        ["87", "LIT", "0", "1"],
        ["88", "OPR", "0", "2"],
        ["89", "STO", "0", "6"],
        ["90", "LOD", "0", "3"],
        ["91", "LOD", "0", "4"],
        ["92", "OPR", "0", "11"],
        ["93", "JMC", "0", "98"],
        ["94", "LOD", "0", "6"],
        ["95", "LIT", "0", "1"],
        ["96", "OPR", "0", "2"],
        ["97", "STO", "0", "6"],
        ["98", "LOD", "0", "3"],
        ["99", "LOD", "0", "4"],
        ["100", "OPR", "0", "13"],
        ["101", "JMC", "0", "106"],
        ["102", "LOD", "0", "6"],
        ["103", "LIT", "0", "1"],
        ["104", "OPR", "0", "2"],
        ["105", "STO", "0", "6"],
        ["106", "LOD", "0", "3"],
        ["107", "LOD", "0", "4"],
        ["108", "OPR", "0", "9"],
        ["109", "JMC", "0", "114"],
        ["110", "LOD", "0", "6"],
        ["111", "LIT", "0", "1"],
        ["112", "OPR", "0", "2"],
        ["113", "STO", "0", "6"],
        ["114", "RET", "0", "0"]
    ]

    let inputCode = "const a = 5, b = 2;\nvar res, res2;\n\nbegin\n\tres  := 0;\n\tres2 := 0;\n\n\tif a =  5  then res := res + 1;  (* true\t *)\n\tif a <  5  then res := res + 1;  (* false\t*)\n\tif a >  5  then res := res + 1;  (* false\t*)\n\tif a <= 5  then res := res + 1;  (* true\t *)\n\tif a >= 5  then res := res + 1;  (* true\t *)\n\tif a #  5  then res := res + 1;  (* false\t*)\n\tif a # -1  then res := res + 1;  (* true\t *)\n\n\tif a =  b then res2 := res2 + 1; (* false\t*)\n\tif a <  b then res2 := res2 + 1; (* false\t*)\n\tif a >  b then res2 := res2 + 1; (* true\t *)\n\tif a <= b then res2 := res2 + 1; (* false\t*)\n\tif a >= b then res2 := res2 + 1; (* true\t *)\n\tif a #  b then res2 := res2 + 1; (* true\t *)\n\n\t(* at the end res = 4, res2 = 3 *)\nend.";


    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);