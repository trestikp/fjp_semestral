// symbols used in grammar -- used by tokenizer (lexer) to return parsed token
const Symbols = {
    // constant symbols - keywords and such
    begin:          "begin",
    call:           "call",
    const:          "const",
    do:             "do",
    else:           "else",
    end:            "end", 
    foreach:        "foreach", // NOTE: must be matched before "for"
    for:            "for",
    if:             "if",
    in:             "in",
    odd:            "odd",
    procedure:      "procedure",
    return:         "return",
    then:           "then",
    to:             "to",
    var:            "var",
    while:          "while",
    assignment:     ":=",
    colon:          ":",
    semicolon:      ";",
    comma:          ",",
    dot:            ".",
    open_bra:       "(",
    close_bra:      ")",
    open_curl:      "{",
    close_curl:     "}",
    quest_mark:     "?",
    excl_mark:      "!",
    hash_mark:      "#",
    eq:             "=",
    lte:            "<=", // NOTE: must be matched before "<"
    lt:             "<",
    gte:            ">=", // NOTE: must be matched before ">"
    gt:             ">",
    plus:           "+",
    minus:          "-",
    star:           "*", 
    slash:          "/",
    // dynamic inputs (dependant on input) - must read input
    number:         "[0-9]",
    ident:          "id",
    input:          "input",
    // error symbols
    ERR: "ERR",
    EOF: "EOF",
}

const DataTypes = {
    string: "string",
    int: "int",
    float: "float",
    bool: "bool",
}

let recursive_descent = (function() {
    let descent = ({
        symbol: null,
        last_symbol_value: null,
        symbol_value: null,
        symbol_counter: 0, // increases when lexer parses symbol - can be used to underline syntax errors (should correspond to error word)
    
        /**
         * Loads next symbol from lexer (tokenizer) into symbol variable. 
         * Puts Symbols.ERR on error and Symbols.EOF on End of File - input.
         */
        next_sym: function() {
            this.last_symbol_value = tokenizer.yytext;
    
            try {
                do {
                    this.symbol = tokenizer.next();
                } while (this.symbol === false); // next returns "false" on whitespace
                
                this.symbol_value = tokenizer.yytext; // TODO: may be unneeded?
                this.symbol_counter++;
            } catch(error) {
                this.symbol = Symbols.ERR;
                // probably should do symbol_counter++; for correct highlighting
            }
    
            // TODO tokenizer.EOF = 1 - this might cause trouble when parsing number "1" ?
            if (this.symbol === tokenizer.EOF)
                this.symbol = Symbols.EOF; // EOF should throw error anywhere in recursive_descent - MUST NOT BE PART OF GRAMMAR
        },
    
        accept: function(sym) {
            if (this.symbol === sym) {
                this.next_sym();
                return true;
            }
    
            return false;
        },
    
        error: function(err_msg) {
            console.log(tokenizer.yylineno + " - " + err_msg);
            // TODO: redirect to gui console - text area
        },
    
        // not using this fuction, because using only accept if enough for custom errors
        // expect: function(sym) {
        //     if (this.accept(sym)) return true; // or return sym;
    
        //     this.error("Expected symbol: " + sym + " but found: " + this.symbol_value);
        //     return false;
    
        //     // if (this.next_sym() !== sym) {
        //     //     error("Expected symbol: " + sym + " but found: " + this.symbol_value);
        //     //     return false;
        //     // }
            
        //     // return sym;
        // },

        condition: function() {

        },

        expression: function() {

        },

        term: function() {

        },

        factor: function() {

        },

        statement: function() {
            switch (this.symbol) {
                case Symbols.ident:
                    if (!this.statement_ident()) {
                        return false;
                    }
                    break;
                case Symbols.open_curl:
                    if (!this.statement_open_curl()) {
                        return false;
                    }
                    break;
                case Symbols.call:
                    if (!this.statement_call()) {
                        return false;
                    }
                    break;
                case Symbols.quest_mark:
                    if (!this.statement_quest_mark()) {
                        return false;
                    }
                    break;
                case Symbols.excl_mark:
                    if (!this.statement_excl_mark()) {
                        return false;
                    }
                    break;
                case Symbols.begin:
                    if (!this.statement_begin()) {
                        return false;
                    }
                    break;
                case Symbols.if:
                    if (!this.statement_if()) {
                        return false;
                    }
                    break;
                case Symbols.open_bra:
                    if (!this.statement_open_bra()) {
                        return false;
                    }
                    break;
                case Symbols.while:
                    if (!this.statement_while()) {
                        return false;
                    }
                    break;
                case Symbols.for:
                    if (!this.statement_for()) {
                        return false;
                    }
                    break;
                case Symbols.foreach:
                    if (!this.statement_foreach()) {
                        return false;
                    }
                    break;
                case Symbols.return:
                    if (!this.statement_return()) {
                        return false;
                    }
                    break;
                default:
                    this.error("Unrecognized statement: " + this.symbol_value);
                    return false;
            }

            return true;
        },
    
        block: function() {
            // const
            if (this.accept(Symbols.const)) {
                do {
                    if (!this.block_const()) 
                        return false; // failed parsing 
                } while (this.accept(Symbols.comma));
                
                // TODO: while might have ended by unknown token - not semicolon - error check
                // ;
                if (!this.accept(Symbols.semicolon)) {
                    // TODO: see if tokenizer can provide line number for this error (it should)
                    this.error("Missing semicolon at the end of const section.");
                    return false;
                }
            }

            // var
            if (this.accept(Symbols.var)) {
                do {
                    if (this.block_ident_declaration() == null) 
                        return false; // failed parsing 
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.semicolon)) {
                    // TODO: see if tokenizer can provide line number for this error (it should)
                    this.error("Missing semicolon at the end of const section.");
                    return false;
                }
            }

            while (this.accept(Symbols.procedure)) {
                if (this.block_procedure() == null)
                    return false; // failed to compile procedure
            }

            if (!this.statement()) {
                // print some error? - statement compiling will print errors on where it failed
                return false;
            }

            return true;
        },
    
        program: function() {
            this.next_sym();
            if (!this.block())
                return; // failed to parse the body of the program - dot won't be reached by tokenizer (lexer)
            if (!this.accept(Symbols.dot))
                this.error("The program MUST end with '.' (dot)");
        },
    
        /******
         * private functions - used in non-terminal function calls
         *****/
    
        validate_input_as_data_type: function() {
            Object.keys(DataTypes).forEach(key => {
                if (DataTypes[key] == this.last_symbol_value)
                    return true;
            });

            return false;
        },

        block_ident_declaration: function() {
            let ident_name;

            // ident
            if (!this.accept(Symbols.ident)) {
                this.error("Following identifier is invalid: " + this.last_symbol_value);
                return null;
            }

            ident_name = this.last_symbol_value; // name is valid identifier

            // [: data_type]
            if (this.accept(Symbols.colon))
                // NOTE: accept(input) will always return true, because input isn't validated
                if (!this.accept(Symbols.input) && !this.validate_input_as_data_type(this.last_symbol_value)) {
                    this.error("Following input isn't a valid data type: " + this.last_symbol_value);
                    return null;
                }

            // TODO: maybe generate instructions here - for declaring variables?

            return ident_name;
        },
    
        block_const: function() {
            let const_name;

            const_name = this.block_ident_declaration();

            // error is handled by block_ident_declaration
            if (const_name == null)
                return false;

            // =
            if (!this.accept(Symbols.eq)) {
                this.error("Expected '=' symbol but received: " + this.last_symbol_value);
                return false;
            }

            // value
            if (!this.accept(Symbols.input)) {
                this.error("Following value is invalid: " + this.last_symbol_value);
                return false;
            }

            // TODO: generate instructions either here from where this is called

            return true;
        },

        block_procedure: function() {
            let ident_name;

            // ident
            if (!this.accept(Symbols.ident)) {
                this.error("Following identifier is invalid: " + this.last_symbol_value);
                return null;
            }

            ident_name = this.last_symbol_value; // name is valid identifier

            // optionally parameters
            // [ "(" ident [ : data_type ] {"," ident [ : data_type ]} ")" ]
            if (this.accept(Symbols.open_bra)) {
                // 
                do {
                    if (this.block_ident_declaration() == null) 
                        return null; // failed parsing 

                    // TODO: save param name to some structure
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.close_bra)) {
                    // TODO: see if tokenizer can provide line number for this error (it should)
                    this.error("Procedure paramater declaration MUST BE closed by ')'");
                    return null;
                }
            }

            // ;
            if (!this.accept(Symbols.semicolon)) {
                this.error("Procedure (" + ident_name + ") header (declaration) must end with ';'");
                return null;
            }

            // block
            if (!this.block()) {
                this.error("Failed to compile procedure (" + ident_name + ") body.");
                return null;
            }

            // ;
            if (!this.accept(Symbols.semicolon)) {
                this.error("Procedure (" + ident_name + ") body must end with ';'");
                return null;
            }

            return ident_name;
        },


        // statement functions
        statement_ident: function() {
            // first "ident" already accepted by caller

            // := ident (indefinetly)
            do {
                if (!this.accept(Symbols.assignment)) {
                    this.error("Statement expected assignment symbol. Statement: " + this.symbol_value);
                    return false;
                }

                // TODO should save idents to some list
            } while (this.accept(Symbols.ident));

            // expression
            if (!this.expression()) {
                this.error("Assignment must end with a valid expression.");
                return false;
            }

            // TODO: instructions assigning expression result to all identifiers

            return true;
        },

        statement_open_curl: function() {
            let ident_counter = 0;

            // { accepted by caller

            // ident {, ident}
            do {
                if (!this.accept(Symbols.ident)) {
                    this.error(this.symbol_value + " is not an valid identifier for multiple assignment.");
                    return false;
                }

                // TODO: store idents in array/ list - preserve indexes

                ident_counter++;
            } while (this.accept(Symbols.comma));

            // } := {
            if (this.accept(Symbols.close_curl)) {
                this.error("Multiple assignment statement expects '}' to close identifier list.");
                return false;
            }
            if (this.accept(Symbols.assignment)) {
                this.error("Multiple assignment statement expects assignment symbol.");
                return false;
            }
            if (this.accept(Symbols.open_curl)) {
                this.error("Multiple assignment statement expects '{' to open value list.");
                return false;
            }

            // value {, value}
            do {
                if (!this.accept(Symbols.input)) {
                    this.error("Invalid value. This value is a keyword or is otherwise invalid. Value: " + this.symbol_value);
                    return false;
                }

                // TODO: value type checking
                // TODO: load into identifiers/ maybe load values to array or list and assign after

                ident_counter--;
            } while (this.accept(Symbols.comma));

            if (ident_counter != 0) {
                this.error("Multiple assignment statement identifier count and value count do not match.");
                return false;
            }

            return true;
        },

        statement_call: function() {
            // call accepted by caller

            if (!this.accept(Symbols.ident)) {
                this.error("Call failed because identifier: " + ident + " is invalid.");
                return false;
            }

            // TODO: check that ident is a procedure identifier (stored in last_symbol_value)
            // TODO: generate instructions
            
            return true;
        },

        statement_quest_mark: function() {
            // ? accepted by caller

            if (!this.accept(Symbols.ident)) {
                this.error("? expected valid identifier.");
                return false;
            }

            // TODO: what to do with this shit? We must have it, because it is original PL/0 grammar
            
            return true;
        },

        statement_excl_mark: function() {
            // ! accepted by caller

            if (!this.expression()) {
                this.error("! doesn't end with valid expression.");
                return false;
            }

            // TODO: what to do with this shit? We must have it, because it is original PL/0 grammar
            
            return true;
        },

        statement_begin: function() {
            // begin accepted by caller

            // statement {";" statement}
            do {
                if (!this.statement()) {
                    this.error("Failed to process statement in command block.");
                    return false;
                }
            } while (this.accept(Symbols.semicolon));

            // end
            if (!this.accept(Symbols.end)) {
                this.error("Expected 'end' to close command block. Received: " + this.symbol_value);
                return false;
            }

            return true;
        },

        statement_if: function() {
            // if accepted by caller

            if (!this.condition()) {
                this.error("Failed to evaluate if condition.");
                return false;
            }

            if (!this.accept(Symbols.then)) {
                this.error("if condition must be followed by 'then' before statement.");
                return false;
            }

            if (!this.statement()) {
                this.error("Failed to execute positive branch statement.");
                return false;
            }

            // TODO: generate positive branch instructions

            if (this.accept(Symbols.else))
                if (!this.statement()) {
                    this.error("Failed to execute negative branch statement.");
                    return false;
                }

                // TODO: generate negative branch instructions

            return true;
        },

        statement_open_bra: function() {
            // ( accepted by caller

            // condition
            if (!this.condition()) {
                this.error("Failed to evaluate tenrary operator condition.");
                return false;
            }

            // )
            if (!this.accept(Symbols.close_bra)) {
                this.error("Expected ')' to close the ternary operator condition but received: " + this.symbol_value);
                return false;
            }

            // ?
            if (!this.accept(Symbols.quest_mark)) {
                this.error("Expected '?' for ternary operator but received: " + this.symbol_value);
                return false;
            }

            // TODO: "internally 'return'"
            if (!this.statement()) {
                this.error("First statement in the ternary operator failed to execute.");
                return false;
            }

            if (!this.accept(Symbols.quest_mark)) {
                this.error("Expected ':' to separate ternary statements. Received: " + this.symbol_value);
                return false;
            }

            // TODO: "internally 'return'"
            if (!this.statement()) {
                this.error("Second statement in the ternary operator failed to execute.");
                return false;
            }

            // TODO: guess what, instructions

            return true;
        },

        statement_while: function() {
            // while accepted by caller

            if (!this.condition()) {
                this.error("Failed to compile while condition.");
                return false;
            }

            if (!this.accept(Symbols.do)) {
                this.error("Expected 'do' before while statement.");
                return false;
            }

            if (!this.statement()) {
                this.error("Failed to compile while statement.");
                return false;
            }

            // TODO instruuuuctiooooooooons

            return true;
        },

        statement_for: function() {
            // for accepted by caller

            let start, end;

            if (!this.accept(Symbols.number)) {
                this.error("For loop needs first number is a starting point.");
                return false;
            }

            start = this.last_symbol_value;

            if (!this.accept(Symbols.to)) {
                this.error("For loop needs 'to' before second number.");
                return false;
            }
            if (!this.accept(Symbols.number)) {
                this.error("For loop needs first number is a ending point.");
                return false;
            }

            end = this.last_symbol_value;

            if (!this.accept(Symbols.do)) {
                this.error("Expected 'do' before for statement.");
                return false;
            }
            if (!this.statement()) {
                this.error("Failed to compile for statement.");
                return false;
            }

            // TODO instruuuuctiooooooooons

            return true;
        },

        statement_foreach: function() {
            // foreach accepted by caller 

            let iterator;

            if (!this.accept(Symbols.ident)) {
                this.error("foreach first ident error");
                return false;
            }

            if (!this.accept(Symbols.in)) {
                this.error("foreach missing in");
                return false;
            }
            if (!this.accept(Symbols.ident)) {
                this.error("foreach wrong array ident");
                return false;
            }


            if (!this.accept(Symbols.do)) {
                this.error("Expected 'do' before foreach statement.");
                return false;
            }
            if (!this.statement()) {
                this.error("Failed to compile foreach statement.");
                return false;
            }

            // TODO: blah blah

            return true;
        },

        statement_return: function() {
            // return accepted by caller

            // returns value - what is value? factor?

            return true;
        },
    });
    return descent;
}) ();