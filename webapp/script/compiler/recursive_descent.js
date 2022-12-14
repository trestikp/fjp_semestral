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
    comment_start:   "(*",
    comment_end:    "*)",
    // dynamic inputs (dependant on input) - must read input
    ident:          "id",
    input:          "input",
    data_type:      "data_type",
    // error symbols
    ERR:            "ERR",
    EOF:            "EOF",
}

let symbol_input_type; // TODO: move it to better place?
const Symbols_Input_Type = {
    boolean:    "boolean",
    integer:    "integer",
    float:      "float",
    string:     "string",
    ERR:        "ERR",
}

const Instructions = {
    LIT:    "LIT",
    INT:    "INT",
    OPR:    "OPR",
    JMP:    "JMP",
    JMC:    "JMC",
    LOD:    "LOD",
    STO:    "STO",
    CAL:    "CAL",
    RET:    "RET",
    REA:    "REA",
    NEW:    "NEW",
    DEL:    "DEL",
    LDA:    "LDA",
    STA:    "STA",
    PLD:    "PLD",
    PST:    "PST",
    // to signalize invalid instruction
    ERR:    "ERR",
}

const DataTypes = {
    string: "string",
    int: "int",
    float: "float",
    bool: "bool",
}


// TODO: this would be nice to have it private - only accessible through functions
let instruction_list = [];

function push_instruction(inst = Instructions.ERR, par1 = -1, par2 = -1) {
    if (inst === Instructions.ERR || par1 === -1 || par2 === -1) {
        console.log("ERROR - tried to push instructions without specifing all parameters");
        return;
    }

    instruction_list.push({inst, par1, par2});
};

// TODO: rename? - make print to code output html element
function print_instruction_list() {
    let textArea = document.getElementById("editor-out");
    textArea.value = ""; // clear the text area
    let line;

    for (i = 0; i < instruction_list.length; i++) {
        line = i + " " + instruction_list[i].inst + "\t" + 
                         instruction_list[i].par1 + "\t" + 
                         instruction_list[i].par2 + "\n";
        textArea.value += line;

        // console.log(i + " " + instruction_list[i].inst + "\t" + 
        //                       instruction_list[i].par1 + "\t" + 
        //                       instruction_list[i].par2)
    }
}

let recursive_descent = (function() {
    function make_var(name, type, value = null, constant = false, level = 0, position = 0) {
        return {name, type, value, constant, level, position};
    }

    let descent = ({
        symbol: null,
        last_symbol_value: null,
        symbol_value: null,
        symbol_counter: 0, // increases when lexer parses symbol - can be used to underline syntax errors (should correspond to error word)
        compilationErrors: [],

        // constants: [],
        // variables: [],
        // array of arrays for constants and variables in a scope - every inner array is one scope of a level (index should correspons to level)
        variables: [],
        context_list: new Object(),

        level_counter: 0,
    
        /**
         * Loads next symbol from lexer (tokenizer) into symbol variable. 
         * Puts Symbols.ERR on error and Symbols.EOF on End of File - input.
         */
        next_sym: function() {
            this.last_symbol_value = tokenizer.yytext;
            let reading_comment = false;
    
            try {
                do {
                    do {
                        this.symbol = tokenizer.next();
                    } while (this.symbol === false); // next returns "false" on whitespace

                    if (this.symbol === Symbols.comment_start)
                        reading_comment = true;
                    if (this.symbol === Symbols.comment_end)
                        reading_comment = false;
                    if (this.symbol === tokenizer.EOF)
                        break; // reached EOF - this is in case EOF is reached in comment
                } while (reading_comment);

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
                console.log("Accepted symbol: " + this.symbol + ", text: " + tokenizer.yytext); // TODO: remove - debugg
                return true;
            }
    
            return false;
        },
    
        error: function(err_msg) {
            this.compilationErrors.push({
                line: tokenizer.yylineno + 1,
                err: err_msg,
                symbol: this.symbol_value
            });
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
            if (this.accept(Symbols.odd)) {
                if (!this.expression()) {
                    this.error("Failed to evaluate 'odd' expression.");
                    return false;
                }

                // TODO: insctructions

                return true;
            } else if (this.expression()) {
                // TODO cases
                switch (this.symbol) {
                    case Symbols.eq:
                        this.accept(Symbols.eq);
                        break;
                    case Symbols.hash_mark:
                        this.accept(Symbols.hash_mark);
                        break;
                    case Symbols.lt:
                        this.accept(Symbols.lt);
                        break;
                    case Symbols.lte:
                        this.accept(Symbols.lte);
                        break;
                    case Symbols.gt:
                        this.accept(Symbols.gt);
                        break;
                    case Symbols.gte:
                        this.accept(Symbols.gte);
                        break;
                    default:
                        this.error("Unrecognized comparison operation.");
                }

                if (!this.expression()) {
                    this.error("Failed to evaluate second expression.");
                    return false;
                }

                return true;
            }

            this.error("This code is not a condition: " + this.symbol_value);
            return false;
        },

        expression: function() {
            if (this.accept(Symbols.plus) || this.accept(Symbols.minus)) {
                // last_symbol - add some instruction or we
            }

            if (!this.term()) {
                this.error("failed to evaluate term");
                return false;
            }

            while (this.accept(Symbols.plus) || this.accept(Symbols.minus)) {
                if (!this.term()) {
                    this.error("failed to evaluate term");
                    return false;
                }
            }

            return true;
        },

        term: function() {
            if (!this.factor()) {
                this.error("term failed to compile factor");
                return false;
            }

            while (this.accept(Symbols.star) || this.accept(Symbols.slash)) {
                // last_symbol contains which one it is
                
                if (!this.factor()) {
                    this.error("term failed to compile factor");
                    return false;
                }   
            }

            return true;
        },

        factor: function() {
            if (this.accept(Symbols.ident)) {
                // TODO verify ident is valid, instructions
                return true;
            } else if (this.accept(Symbols.number)) {
                // TODO instructions
                return true;
            } else if (this.accept(Symbols.input)) {
                // validate input for value (string, bool)
                return true;
            } else if (this.accept(Symbols.open_bra)) {
                if (!this.expression()) {
                    this.error("failed to compile expression insinde factor");
                    return false;
                }
                if (!this.accept(Symbols.close_bra)) {
                    this.error("factor expression must be close by bracket ')'");
                    return false;
                }

                return true;
            }

            this.error("Unrecognized factor: " + this.symbol_value);
            return false;
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
                case Symbols.end:
                    if (!this.statement_end()) {
                        return false;
                    }
                    return 10; // special case - returns on true - doesn't return boolean
                default:
                    this.error("Unrecognized statement: " + this.symbol_value);
                    return false;
            }

            // TODO: if this is here, it only consumes the first command in a block (= scope)
            // this.accept(Symbols.semicolon); // statement can (but doesn't have to be) ended with ';'

            return true;
        },
    
        block: function() {
            // let consts = [], vars = [];
            let vars = []; // constants and variables of current scope
            let var_obj;

            // const
            if (this.accept(Symbols.const)) {
                do {
                    if ((var_obj = this.block_const()) === false) 
                        return false; // failed parsing
                        
                    // consts.push(var_obj);
                    vars.push(var_obj);
                } while (this.accept(Symbols.comma));
                
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
                    if ((var_obj = this.load_ident_and_type()) === false) 
                        return false; // failed parsing 

                    vars.push(var_obj);
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.semicolon)) {
                    // TODO: see if tokenizer can provide line number for this error (it should)
                    this.error("Missing semicolon at the end of const section.");
                    return false;
                }
            }

            let proc_name = "";
            while (this.accept(Symbols.procedure)) {
                if ((proc_name = this.block_procedure()) == null)
                    return false; // failed to compile procedure
            }


            if (this.context_list[proc_name] != null || this.context_list[proc_name] !== undefined) {
                this.error("Compilation failed because context with " + proc_name + " already exists. Please ensure " + 
                    proc_name + " is unique.");
                return false;
            }

            console.log("context: " + proc_name);

            // let var_index = this.variables.length; // maybe for verification that we are later popping correct stack
            if (vars.length > 0)
                this.variables.push(vars);

            if (this.variables.length > 0)
                push_instruction(Instructions.CAL, 0, 0); // TODO: params?



            // TODO: set PC
            if (!this.statement()) {
                // print some error? - statement compiling will print errors on where it failed
                return false;
            }

            this.variables.pop(); // at the top of the array should be only this blocks stack - maybe verify with index?
            return true;
        },
    
        program: function() {
            this.compilationErrors = []; //Empty the errors ftom previous iterations
            this.next_sym();
            if (!this.block())
                return this.compilationErrors; // failed to parse the body of the program - dot won't be reached by tokenizer (lexer)
            if (!this.accept(Symbols.dot))
                this.error("The program MUST end with '.' (dot)");

            return this.compilationErrors;
        },
    
        /**************************************************************************************************************
         * private functions - used in non-terminal function calls                                                    *
         **************************************************************************************************************/
    
        validate_input_as_data_type: function() {
            Object.keys(DataTypes).forEach(key => {
                if (DataTypes[key] == this.last_symbol_value)
                    return true;
            });

            return false;
        },

        validate_data_type: function(input) {
            Object.keys(DataTypes).forEach(key => {
                if (DataTypes[key] == input)
                    return true;
            });

            return false;
        },

        /**
         * 
         * @returns null on error. Array of [name, data_type] otherwise, where dataType can be null, if it wasn't supplied.
         */
        block_ident_declaration: function() {
            let ident_name, data_type = null;

            // ident
            if (!this.accept(Symbols.ident)) {
                this.error("Following identifier is invalid: " + this.last_symbol_value);
                return null;
            }

            ident_name = this.last_symbol_value; // name is valid identifier

            // TODO: test if this works, this will most likely not work correctly
            // [: data_type]
            if (this.accept(Symbols.colon))
                // lexer validates type
                if (!this.accept(Symbols.data_type)) {
                    this.error("Expected data type but got invalid input (unrecognized data type): " + this.last_symbol_value);
                    return null;
                } else
                    data_type = this.last_symbol_value; // TODO: could do DataTypes[last_symbol] here

            return [ident_name, data_type];
        },

        /**
         * Validates if value is valid data type and determines it. Also validates against expected data type.
         * @param {*} value that is validated or resolved.
         * @param {*} expected_dtype can be null. Expected data type of the value
         * @returns DataTypes value on success. "false" otherwise.
         */
        validate_value_and_type: function(value, expected_dtype) {
            switch (typeof value) {
                case "number":
                    {
                        if (!isNaN(value)) return false;
                        // value type doesn't match expected data type
                        if (expected_dtype != null && 
                            (expected_dtype[1] != DataTypes["int"] || expected_dtype[1] != DataTypes["float"]))
                        {
                            this.error("Data type mismatch. Recieved number (int/ float), but declaration expects: " + expected_dtype);
                            return false;
                        }
                        
                        return Number.isInteger(value) ? DataTypes["int"] : DataTypes["float"];
                    }
                case "string":
                    {
                        // typeof validates that the value is string
                        if (expected_dtype != null && expected_dtype != DataTypes["string"]) return false;
                        return DataTypes["string"];
                    }
                case "boolean":
                    {
                        // typeof validates that the value is true/ false
                        if (expected_dtype != null && expected_dtype != DataTypes["bool"]) return false;
                        return DataTypes["bool"];
                    }
                default:
                    this.error("Unrecognized data type. Supported data types are: integer, float, string");
            }

            return false;
        },

        load_ident_and_type: function() {
            // this will be array of [name, data_type], where data_type can be null
            let name_and_type = this.block_ident_declaration();

            if (name_and_type == null)
                return false;

            // stop parsing if error occured - printing error is handled by block_ident_declaration
            if (name_and_type[0] == null)
                return false;

            if (name_and_type[1] != null)
                if (!this.validate_data_type(name_and_type[1])) {
                    this.error("Invalid data type while parsing constants or variables. Datatype: " + name_and_type[1]);
                    return false;
                }

            // at this point everything should be validated - returning variable object
            // TODO - level and position - variable(name, type, level, position); -- might be unnecessary
            return make_var(name_and_type[0], name_and_type[1]);
        },
    
        block_const: function() {
            // this will be array of [name, data_type], where data_type can be null
            let var_obj = this.load_ident_and_type();

            if (var_obj === false) {
                // error printing should be done in load_ident_and_type
                return false;
            }

            // =
            if (!this.accept(Symbols.eq)) {
                this.error("Expected '=' symbol but received: " + this.last_symbol_value);
                return false;
            }

            if (!this.accept(Symbols.input)) {
                this.error("Expected value input, but recieved unrecognized token. Invalid input: " + this.last_symbol_value);
                return false;
            }

            if (this.validate_value_and_type(this.last_symbol_value, var_obj.type) === false) {
                this.error("Failed to validate value.");
                return false;
            }

            var_obj.value = this.last_symbol_value; // TODO: parse last_symbol_value as value of type?
            var_obj.constant = true;

            return var_obj;

            // // this will be array of [name, data_type], where data_type can be null
            // let name_and_type = this.block_ident_declaration();

            // // stop parsing if error occured - printing error is handled by block_ident_declaration
            // if (name_and_type[0] == null)
            //     return false;

            // // =
            // if (!this.accept(Symbols.eq)) {
            //     this.error("Expected '=' symbol but received: " + this.last_symbol_value);
            //     return false;
            // }

            // // TODO: this works differently now
            // // value - can be either input (string, maybe something more?) or number (both int and float)
            // if (!(this.accept(Symbols.input) || this.accept(Symbols.number))) {
            //     this.error("Following value is invalid: " + this.last_symbol_value);
            //     return false;
            // }

            // let type = this.validate_value_and_type(this.last_symbol_value, name_and_type[1]);
            // if (type === false) {
            //     // error should already be printed by validate_value_and_type
            //     return false;
            // }

            // // at this point everything should be validated - returning constant
            // // TODO - level and position 
            // return variable(name_and_type[0], type);
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
            // simple version: ident := expression; // where ; is checked by caller
            // multiple assignments: ident := ident := ident := expression; // problem: ident can expression - how to determine when it ends?
            // TODO: will have to add additional rule to the grammar

            // first "ident" already verified by caller
            this.accept(Symbols.ident);

            // simple version
            if (!this.accept(Symbols.assignment)) {
                this.error("Statement expected assignment symbol. Statement: " + this.symbol_value);
                return false;
            }

            if (!this.expression()) {
                this.error("Assignment must end with a valid expression.");
                return false;
            }

            // := ident (indefinetly)
            // do {
            //     if (!this.accept(Symbols.assignment)) {
            //         this.error("Statement expected assignment symbol. Statement: " + this.symbol_value);
            //         return false;
            //     }

            //     if (!this.expression()) {
            //         this.error("Assignment must end with a valid expression.");
            //         return false;
            //     }

            //     // TODO should save idents to some list
            // } while (this.accept(Symbols.ident));

            // expression
            // if (!this.expression()) {
            //     this.error("Assignment must end with a valid expression.");
            //     return false;
            // }

            // // reached end of statement
            // if (!this.accept(Symbols.semicolon)) return false;

            // TODO: instructions assigning expression result to all identifiers

            return true;
        },

        statement_open_curl: function() {
            let ident_counter = 0;

            // { verified by caller
            this.accept(Symbols.open_curl);

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
            // call verified by caller
            this.accept(Symbols.call);

            if (!this.accept(Symbols.ident)) {
                this.error("Call failed because identifier: " + ident + " is invalid.");
                return false;
            }

            // TODO: check that ident is a procedure identifier (stored in last_symbol_value)
            // TODO: generate instructions
            
            return true;
        },

        statement_quest_mark: function() {
            // ? verified by caller
            this.accept(Symbols.quest_mark)

            if (!this.accept(Symbols.ident)) {
                this.error("? expected valid identifier.");
                return false;
            }

            // TODO: what to do with this shit? We must have it, because it is original PL/0 grammar
            
            return true;
        },

        statement_excl_mark: function() {
            // ! verified by caller
            this.accept(Symbols.excl_mark);

            if (!this.expression()) {
                this.error("! doesn't end with valid expression.");
                return false;
            }

            // TODO: what to do with this shit? We must have it, because it is original PL/0 grammar
            
            return true;
        },

        statement_begin: function() {
            // begin verified by caller
            this.accept(Symbols.begin);
            
            let rv;

            // statement {";" statement}
            do {
                rv = this.statement();
                if (rv === 10)
                    break;
                if (rv === false) {
                    this.error("Failed to process statement in command block.");
                    return false;
                }
            } while (this.accept(Symbols.semicolon));

            // end -- accepted by statement_end();
            // if (!this.accept(Symbols.end)) {
            //     this.error("Expected 'end' to close command block. Received: " + this.symbol_value);
            //     return false;
            // }

            return true;
        },

        statement_if: function() {
            // if verified by caller
            this.accept(Symbols.if);

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
            // ( verified by caller
            this.accept(Symbols.open_bra);

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
            // while verified by caller
            this.accept(Symbols.while);

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
            // for verified by caller
            this.accept(Symbols.for);

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
            // foreach verified by caller 
            this.accept(Symbols.foreach);

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
            // return verified by caller
            this.accept(Symbols.return);

            // returns value - what is value? factor?

            return true;
        },

        statement_end: function() {
            return this.accept(Symbols.end);
        }
    });
    return descent;
}) ();