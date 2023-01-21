(function ($) {
    let resultInstructions = [
        ["0", "JMP", "0", "1"],
        ["1", "INT", "0", "8"],
        ["2", "LIT", "0", "5"],
        ["3", "STO", "0", "4"],
        ["4", "LIT", "0", "2.345"],
        ["5", "STO", "0", "5"],
        ["6", "LIT", "0", "0"],
        ["7", "STO", "0", "6"],
        ["8", "LIT", "0", "1"],
        ["9", "STO", "0", "7"],
        ["10", "RET", "0", "0"]
    ]    

    let inputCode = "var int: integer, fl: float, bool: boolean, bool2: boolean;\n\nbegin\n\t{int, fl, bool, bool2} := {5, 2.345, false, true};\n\n\t(* expects the variables to have 5, 2.345, 0 *)\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        Parser.parse(true, inputCode);

        TestRunner.validateInstructions(resultInstructions);
    }
})($);