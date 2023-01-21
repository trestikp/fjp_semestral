/**
 * WARNING!!!!! DO NOT CHANGE ORDER OF THE WORDS IN THE STRING AND RESULT ARRAYS.
 * if needed, add new ones to the end. If order change is neccessary then ensure the change is done in both
 * the string and the result array.
 */


(function ($) {
    let test_string_dynamic = "true 1.001 false 9876 \"asdf\" true 0.5 .75 \"z\" -1234 -.75"
    let dynamic_types_result = [Symbols_Input_Type.boolean, Symbols_Input_Type.float, Symbols_Input_Type.boolean,
        Symbols_Input_Type.integer, Symbols_Input_Type.string, Symbols_Input_Type.boolean, Symbols_Input_Type.float,
        Symbols_Input_Type.float, Symbols_Input_Type.string, Symbols_Input_Type.integer, Symbols_Input_Type.float];

    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        tokenizer.setInput(test_string_dynamic);
        let symbol;
        let i = 0;

        do {
            do {
                symbol = tokenizer.next();
            } while (symbol === false); // next returns "false" on whitespace

            if (symbol == tokenizer.EOF) break; // TODO: this is quick fix - make it to just the while

            if (i >= dynamic_types_result.length) {
                throw "Lexer test_dynamic error: result overflow";
                i++;
            }

            if (symbol !== Symbols.input)
                throw "Lexer test_dynamic error: " + symbol + " doesn't match any input! Resulting symbol is: " + symbol;

            if (symbol_input_type !== dynamic_types_result[i])
                throw "Lexer test_dynamic error: " + symbol_input_type + " (value : " + tokenizer.yytext + ") " +
                    " isn't a supported data type or doesn't match result. Expected: " + dynamic_types_result[i];
            
            i++;
        } while (symbol != tokenizer.EOF);

        console.log("Dynamic lexer test finished");
    }
})($);