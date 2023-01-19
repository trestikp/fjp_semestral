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
        /*if (!tests) {
            Parser.error("Tests are not ready yet.");
            return;
        }*/

        $('#testResultsModal').modal('toggle');

        let testCounter = 0;
        let failedTests = 0;
        let successTests = 0;

        let testResultContent = document.querySelector("#testResultsModal .modal-body");
        testResultContent.innerHTML = "";

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

                        testResultContent.append(createResult(currentTest, null, true));
                    } catch (e) {
                        console.error("Test " + currentTest + " failed. Error: " + e);
                        failedTests++;
    
                        //Remove the failed test
                        $("script[src='" + currentTestPath + "']").remove();
                        testResultContent.append(createResult(currentTest, e, false));
                    }
                }
            });
        }

        let dividerElement = document.createElement("div");
        dividerElement.classList.add("my-3", "p-0", "bg-secondary");
        dividerElement.style.height = "2px";

        let testRunElement = document.createElement("h6");
        testRunElement.innerHTML = "Tests run: " + testCounter;

        let testSuccessElement = document.createElement("h6");
        testSuccessElement.classList.add("text-success");
        testSuccessElement.innerHTML = "Successful tests: " + successTests;

        let testFailedElement = document.createElement("h6");
        testFailedElement.classList.add("text-danger");
        testFailedElement.innerHTML = "Failed tests: " + failedTests;

        testResultContent.append(dividerElement);
        testResultContent.append(testRunElement);
        testResultContent.append(testSuccessElement);
        testResultContent.append(testFailedElement);

        console.log("Testing finished. Ran tests: " + testCounter + ", Successfull tests: " + successTests + ", Failed tests: " + failedTests);
    }


    TestRunner.validateInstructions = function(expectedInstructions) {
        for (let index in instruction_list) {
            if (instruction_list[index].inst != expectedInstructions[index][1]) {
                throw "Missmatch instruction on line " + index + ". Expected " + expectedInstructions[index][1] + ", but got " + instruction_list[index].inst;
            }

            if (instruction_list[index].par1 != expectedInstructions[index][2]) {
                throw "Missmatch parameter 1 on line " + index + ". Expected " + expectedInstructions[index][2] + ", but got " + instruction_list[index].par1;
            }

            if (instruction_list[index].par2 != expectedInstructions[index][3]) {
                throw "Missmatch parameter 2 on line " + index + ". Expected " + expectedInstructions[index][3] + ", but got " + instruction_list[index].par2;
            }
        }
    } 
    

    //=======================================================
    //                  Private methods
    //=======================================================

    function createResult(testName, errorString, isSuccess) {
        let resultElement = document.createElement("div");
        resultElement.classList.add("text-light", "my-1", "p-1");

        if (isSuccess) {
            resultElement.classList.add("bg-success");
            resultElement.innerHTML = testName;
        } else {
            resultElement.classList.add("bg-danger");
            resultElement.innerHTML = testName + " - " + errorString;
        }

        return resultElement;
    }
})($);