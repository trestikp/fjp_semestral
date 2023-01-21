/**
 * WARNING!!!!! DO NOT CHANGE ORDER OF THE WORDS IN THE STRING AND RESULT ARRAYS.
 * if needed, add new ones to the end. If order change is neccessary then ensure the change is done in both
 * the string and the result array.
 */


(function ($) {
    const test_string_static = "begin call const do else end for if in odd procedure return then to var while := : \
    ; , . ( ) { } ? ! # = <= < >= > + - * / (* *)";
    const static_results = [Symbols.begin, Symbols.call, Symbols.const, Symbols.do, Symbols.else, Symbols.end, 
        Symbols.for, Symbols.if, Symbols.in, Symbols.odd, Symbols.procedure, Symbols.return, 
        Symbols.then, Symbols.to, Symbols.var, Symbols.while, Symbols.assignment, Symbols.colon, Symbols.semicolon,
        Symbols.comma, Symbols.dot, Symbols.open_bra, Symbols.close_bra, Symbols.open_curl, Symbols.close_curl, 
        Symbols.quest_mark, Symbols.excl_mark, Symbols.hash_mark, Symbols.eq, Symbols.lte, Symbols.lt, Symbols.gte,
        Symbols.gt, Symbols.plus, Symbols.minus, Symbols.star, Symbols.slash, Symbols.comment_start, Symbols.comment_end];


    /**
     * Main test method. Throws exception with information if the test fails.
     */
    window.runTestCase = function() {
        tokenizer.setInput(test_string_static);
        let symbol;
        let i = 0;

        do {
            do {
                symbol = tokenizer.next();
            } while (symbol === false); // next returns "false" on whitespace

            if (symbol == tokenizer.EOF) break; // TODO: this is quick fix - make it to just the while

            if (i >= static_results.length) {
                throw "Lexer test_static error: no expected results for symbol (number " + i + "): " + symbol;
                i++;
                continue;
            }
            if (symbol !== static_results[i]) 
                throw "Lexer test_static error: " + symbol + " doesn't match expected result: " + static_results[i];
            
            i++;
        } while (symbol != tokenizer.EOF);

        console.log("Static lexer test finished");
    }
})($);