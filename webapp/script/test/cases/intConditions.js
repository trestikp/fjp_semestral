(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "1"],
        ["1", "INT", "0", "8"],
        ["2", "LIT", "0", "5"],
        ["3", "STO", "0", "4"],
        ["4", "LIT", "0", "2"],
        ["5", "STO", "0", "5"],
        ["6", "LIT", "0", "0"],
        ["7", "STO", "0", "6"],
        ["8", "LIT", "0", "0"],
        ["9", "STO", "0", "7"],
        ["10", "LOD", "0", "4"],
        ["11", "LIT", "0", "5"],
        ["12", "OPR", "0", "8"],
        ["13", "JMC", "0", "18"],
        ["14", "LOD", "0", "6"],
        ["15", "LIT", "0", "1"],
        ["16", "OPR", "0", "2"],
        ["17", "STO", "0", "6"],
        ["18", "LOD", "0", "4"],
        ["19", "LIT", "0", "5"],
        ["20", "OPR", "0", "10"],
        ["21", "JMC", "0", "26"],
        ["22", "LOD", "0", "6"],
        ["23", "LIT", "0", "1"],
        ["24", "OPR", "0", "2"],
        ["25", "STO", "0", "6"],
        ["26", "LOD", "0", "4"],
        ["27", "LIT", "0", "5"],
        ["28", "OPR", "0", "12"],
        ["29", "JMC", "0", "34"],
        ["30", "LOD", "0", "6"],
        ["31", "LIT", "0", "1"],
        ["32", "OPR", "0", "2"],
        ["33", "STO", "0", "6"],
        ["34", "LOD", "0", "4"],
        ["35", "LIT", "0", "5"],
        ["36", "OPR", "0", "13"],
        ["37", "JMC", "0", "42"],
        ["38", "LOD", "0", "6"],
        ["39", "LIT", "0", "1"],
        ["40", "OPR", "0", "2"],
        ["41", "STO", "0", "6"],
        ["42", "LOD", "0", "4"],
        ["43", "LIT", "0", "5"],
        ["44", "OPR", "0", "11"],
        ["45", "JMC", "0", "50"],
        ["46", "LOD", "0", "6"],
        ["47", "LIT", "0", "1"],
        ["48", "OPR", "0", "2"],
        ["49", "STO", "0", "6"],
        ["50", "LOD", "0", "4"],
        ["51", "LIT", "0", "5"],
        ["52", "OPR", "0", "9"],
        ["53", "JMC", "0", "58"],
        ["54", "LOD", "0", "6"],
        ["55", "LIT", "0", "1"],
        ["56", "OPR", "0", "2"],
        ["57", "STO", "0", "6"],
        ["58", "LOD", "0", "4"],
        ["59", "LIT", "0", "1"],
        ["60", "OPR", "0", "9"],
        ["61", "JMC", "0", "66"],
        ["62", "LOD", "0", "6"],
        ["63", "LIT", "0", "1"],
        ["64", "OPR", "0", "2"],
        ["65", "STO", "0", "6"],
        ["66", "LOD", "0", "4"],
        ["67", "LOD", "0", "5"],
        ["68", "OPR", "0", "8"],
        ["69", "JMC", "0", "74"],
        ["70", "LOD", "0", "7"],
        ["71", "LIT", "0", "1"],
        ["72", "OPR", "0", "2"],
        ["73", "STO", "0", "7"],
        ["74", "LOD", "0", "4"],
        ["75", "LOD", "0", "5"],
        ["76", "OPR", "0", "10"],
        ["77", "JMC", "0", "82"],
        ["78", "LOD", "0", "7"],
        ["79", "LIT", "0", "1"],
        ["80", "OPR", "0", "2"],
        ["81", "STO", "0", "7"],
        ["82", "LOD", "0", "4"],
        ["83", "LOD", "0", "5"],
        ["84", "OPR", "0", "12"],
        ["85", "JMC", "0", "90"],
        ["86", "LOD", "0", "7"],
        ["87", "LIT", "0", "1"],
        ["88", "OPR", "0", "2"],
        ["89", "STO", "0", "7"],
        ["90", "LOD", "0", "4"],
        ["91", "LOD", "0", "5"],
        ["92", "OPR", "0", "13"],
        ["93", "JMC", "0", "98"],
        ["94", "LOD", "0", "7"],
        ["95", "LIT", "0", "1"],
        ["96", "OPR", "0", "2"],
        ["97", "STO", "0", "7"],
        ["98", "LOD", "0", "4"],
        ["99", "LOD", "0", "5"],
        ["100", "OPR", "0", "11"],
        ["101", "JMC", "0", "106"],
        ["102", "LOD", "0", "7"],
        ["103", "LIT", "0", "1"],
        ["104", "OPR", "0", "2"],
        ["105", "STO", "0", "7"],
        ["106", "LOD", "0", "4"],
        ["107", "LOD", "0", "5"],
        ["108", "OPR", "0", "9"],
        ["109", "JMC", "0", "114"],
        ["110", "LOD", "0", "7"],
        ["111", "LIT", "0", "1"],
        ["112", "OPR", "0", "2"],
        ["113", "STO", "0", "7"],
        ["114", "RET", "0", "0"],
    ]    

    let inputCode = "const a = 5, b = 2;\nvar res, res2;\n\nbegin\n\tres  := 0;\n\tres2 := 0;\n\n\tif a =  5  then res := res + 1;  (* true\t *)\n\tif a <  5  then res := res + 1;  (* false\t*)\n\tif a >  5  then res := res + 1;  (* false\t*)\n\tif a <= 5  then res := res + 1;  (* true\t *)\n\tif a >= 5  then res := res + 1;  (* true\t *)\n\tif a #  5  then res := res + 1;  (* false\t*)\n\tif a # -1  then res := res + 1;  (* true\t *)\n\n\tif a =  b then res2 := res2 + 1; (* false\t*)\n\tif a <  b then res2 := res2 + 1; (* false\t*)\n\tif a >  b then res2 := res2 + 1; (* true\t *)\n\tif a <= b then res2 := res2 + 1; (* false\t*)\n\tif a >= b then res2 := res2 + 1; (* true\t *)\n\tif a #  b then res2 := res2 + 1; (* true\t *)\n\n\t(* at the end res = 4, res2 = 3 *)\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);