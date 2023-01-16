(function ($) {
    let TestRunner = {};

    //Private variables
    let tests = null;

    /** 
     * Event listener that binds all parsing functions to one public namespace.
     */
    window.addEventListener("load", function() {
        initTestRunner();

        //Store the methods to public namespace.
        window["TestRunner"] = TestRunner;
    });

    //=======================================================
    //                  Initialize functions 
    //=======================================================

    function initTestRunner() {
        $.ajax({
            url: "script/test/tests.json", 
            success: function( data ) {
                tests = data;
            }
        });
    }


    //=======================================================
    //                  Public methods
    //=======================================================

    TestRunner.runAllTests = function() {
        if (!tests) {
            Parser.error("Tests are not ready yet.");
            return;
        }

        let testCounter = 0;
        let failedTests = 0;
        let successTests = 0;

        for (var index in tests) {
            const currentTest = tests[index];
            const currentTestPath = "script/test/cases/" + currentTest

            $.ajax({
                url: currentTestPath,
                dataType: "script",
                async: false,
                success: function() {
                    try {
                        testCounter++;
                        runTestCase();
                        successTests++;
    
                        //Remove sucessful test
                        $("script[src='" + currentTestPath + "']").remove();
                    } catch (e) {
                        console.error("Test " + currentTest + " failed. Error: " + e);
                        failedTests++;
    
                        //Remove the failed test
                        $("script[src='" + currentTestPath + "']").remove();
                    }
                }
            });
        }

        console.log("Testing finished. Ran tests: " + testCounter + ", Successfull tests: " + successTests + ", Failed tests: " + failedTests);
    }

    

    //=======================================================
    //                  Private methods
    //=======================================================

    
})($);