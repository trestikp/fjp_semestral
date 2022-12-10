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
            console.log(err_msg);
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
            return false; // NYI
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
    });
    return descent;
}) ();