(function ($) {
    let inputCode = "(* all procedures called and gave expected results *)\ninvalidConst t = 10, f = 5;\nvar a, b;\n\nprocedure plus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x + t; (* 15 in a *)\n\t\tb := x + 3; (* 8 in b*)\n\tend;\n\nprocedure minus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x - t; (* -5 in a *)\n\t\tb := x - 3; (* 2 in b *)\n\tend;\n\nprocedure mult;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x * f; (* 25 in a *)\n\t\tb := x * 3; (* 15 in b *)\n\tend;\n\nprocedure div;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x / f; (* 1 in a *)\n\t\tb := x / 3; (* 1 in b *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.";

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        let errors = Parser.parse(true, inputCode, true);

        if (errors.length != 1) {
            throw "Expected 1 error, but got " + errors.length; 
        } 
        
        if(errors[0].symbol != "invalidConst") {
            throw "Expected error symbol invalidConst, but got " + errors[0].symbol; 
        }

        if(errors[0].err != "Assignment statement failed. Identifier: invalidConst not found") {
            throw "Expected error string \"Assignment statement failed. Identifier: invalidConst not found\" but got \"" + errors[0].err + "\""; 
        }
    }
})($);