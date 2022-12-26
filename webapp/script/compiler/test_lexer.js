/**
 * WARNING!!!!! DO NOT CHANGE ORDER OF THE WORDS IN THE STRING AND RESULT ARRAYS.
 * if needed, add new ones to the end. If order change is neccessary then ensure the change is done in both
 * the string and the result array.
 */

let test_string_static = "begin call const do else end foreach for if in odd procedure return then to var while := : \
 ; , . ( ) { } ? ! # = <= < >= > + - * / (* *)";
let static_results = [Symbols.begin, Symbols.call, Symbols.const, Symbols.do, Symbols.else, Symbols.end, 
    Symbols.foreach, Symbols.for, Symbols.if, Symbols.in, Symbols.odd, Symbols.procedure, Symbols.return, 
    Symbols.then, Symbols.to, Symbols.var, Symbols.while, Symbols.assignment, Symbols.colon, Symbols.semicolon,
    Symbols.comma, Symbols.dot, Symbols.open_bra, Symbols.close_bra, Symbols.open_curl, Symbols.close_curl, 
    Symbols.quest_mark, Symbols.excl_mark, Symbols.hash_mark, Symbols.eq, Symbols.lte, Symbols.lt, Symbols.gte,
    Symbols.gt, Symbols.plus, Symbols.minus, Symbols.star, Symbols.slash, Symbols.comment_start, Symbols.comment_end];

let test_string_dynamic = "true 1.001 false 9876 \"asdf\" true 0.5 .75 \"z\" -1234 -.75"
let dynamic_types_result = [Symbols_Input_Type.boolean, Symbols_Input_Type.float, Symbols_Input_Type.boolean,
    Symbols_Input_Type.integer, Symbols_Input_Type.string, Symbols_Input_Type.boolean, Symbols_Input_Type.float,
    Symbols_Input_Type.float, Symbols_Input_Type.string, Symbols_Input_Type.integer, Symbols_Input_Type.float];

function test_static_lexer() {
    tokenizer.setInput(test_string_static);
    let symbol;
    let i = 0;

    try {
        do {
            do {
                symbol = tokenizer.next();
            } while (symbol === false); // next returns "false" on whitespace

            if (symbol == tokenizer.EOF) break; // TODO: this is quick fix - make it to just the while

            if (i >= static_results.length) {
                console.log("Lexer test_static error: no expected results for symbol (number " + i + "): " + symbol);
                i++;
                continue;
            }
            if (symbol !== static_results[i]) 
                console.log("Lexer test_static error: " + symbol + " doesn't match expected result: " + 
                    static_results[i]);
            
            i++;
        } while (symbol != tokenizer.EOF);
    } catch (ex) {
        console.log("Lexer test_static error while parsing test string.\n" + ex);
    }

    console.log("Static lexer test finished");
}

function test_dynamic_lexer() {
    tokenizer.setInput(test_string_dynamic);
    let symbol;
    let i = 0;

    try {
        do {
            do {
                symbol = tokenizer.next();
            } while (symbol === false); // next returns "false" on whitespace

            if (symbol == tokenizer.EOF) break; // TODO: this is quick fix - make it to just the while

            if (i >= dynamic_types_result.length) {
                console.log("Lexer test_dynamic error: result overflow");
                i++;
            }

            if (symbol !== Symbols.input)
                console.log("Lexer test_dynamic error: " + symbol + " doesn't match any input! Resulting symbol is: " +
                    symbol);

            if (symbol_input_type !== dynamic_types_result[i])
                console.log("Lexer test_dynamic error: " + symbol_input_type + " (value : " + tokenizer.yytext + ") " +
                    " isn't a supported data type or doesn't match result. Expected: " + dynamic_types_result[i]);
            
            i++;
        } while (symbol != tokenizer.EOF);
    } catch (ex) {
        console.log("Lexer test_static error while parsing test string.\n" + ex);
    }

    console.log("Dynamic lexer test finished");
}

function test_lexer() {
    test_static_lexer();
    test_dynamic_lexer();
}