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


// TODO: this would be nice to have it private - only accessible through functions
let instruction_list = [];

function push_instruction(inst = Instructions.ERR, par1 = -1, par2 = -1) {
    if (inst === Instructions.ERR || par1 === -1 || par2 === -1) {
        console.log("ERROR - tried to push instructions without specifing all parameters");
        return;
    }

    instruction_list.push({inst, par1, par2});
};

function push_instruction_to_start(inst = Instructions.ERR, par1 = -1, par2 = -1) {
    if (inst === Instructions.ERR || par1 === -1 || par2 === -1) {
        console.log("ERROR - tried to push instructions without specifing all parameters");
        return;
    }

    instruction_list.unshift({inst, par1, par2});
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
    /**
     * Makes object holding information about a variable. Name is required parameter but other parameters have default values.
     */
    function make_var(name, type = Symbols_Input_Type.integer, value = null, constant = false, level = 0, position = 0){
        if (type == null)
            type = Symbols_Input_Type.integer;
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
        // context_list: new Object(), // wanted it as a map, but array will have to do
        context_list: [],

        level_counter: 0,
        expr_left_type: Symbols_Input_Type.ERR, // expressions validate data type against this - based on left side data type
    
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
                // console.log("Accepted symbol: " + this.symbol + ", text: " + tokenizer.yytext); // TODO: remove - debugg
                return true;
            }
    
            return false;
        },
    
        error: function(err_msg) {
            this.compilationErrors.push({
                line: tokenizer.yylineno + 1,
                err: err_msg,
                // symbol: this.symbol_value
                symbol: this.last_symbol_value
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

                // assuming expression result is on top of the stack
                push_instruction(Instructions.OPR, 0, 6); // 6 = is odd

                return true;
            } else if (this.expression()) {
                let op_number = 0;
                switch (this.symbol) { // TODO: cant work in this order, opr must be last
                    case Symbols.eq:
                        this.accept(Symbols.eq);
                        op_number = 8; // 8 = equal
                        break;
                    case Symbols.hash_mark:
                        this.accept(Symbols.hash_mark);
                        op_number = 9; // 9 = inequal
                        break;
                    case Symbols.lt:
                        this.accept(Symbols.lt);
                        op_number = 10; // 10 = less than
                        break;
                    case Symbols.lte:
                        this.accept(Symbols.lte);
                        op_number = 11; // 11 = less than or equal
                        break;
                    case Symbols.gt:
                        this.accept(Symbols.gt);
                        op_number = 12; // 12 = greater than
                        break;
                    case Symbols.gte:
                        this.accept(Symbols.gte);
                        op_number = 13; // 13 = greater than or equal
                        break;
                    default:
                        this.error("Unrecognized comparison operation.");
                        return false;
                }

                if (!this.expression()) {
                    this.error("Failed to evaluate second expression.");
                    return false;
                }

                // assumes that top of stack is 2 results of 2 expressions
                push_instruction(Instructions.OPR, 0, op_number);

                return true;
            }

            this.error("This code is not a condition: " + this.symbol_value);
            return false;
        },

        expression: function() {
            // expression can be "result" of call, however to use statement_call, we must verify the "call" symbol
            if (this.symbol == Symbols.call)
                if (this.statement_call()) {
                    return true;
                    // TODO: get return data type from procedure and verify if the data type is correct + save the value from return statement
                }

            // if the expression isn't call, then do normal expression
            let negate = false;
            if (this.accept(Symbols.plus) || this.accept(Symbols.minus)) {
                // nothing to do with +
                // on - negates the result
                if (this.last_symbol_value == Symbols.minus)
                    negate = true;
            }

            let term_type;
            if ((term_type = this.term()) === false) {
                this.error("Failed to evaluate term in expression.");
                return false;
            }

            let loop_term_type;
            let operation;

            // check if +/- operations are permitted with this data type
            if (this.symbol == Symbols.minus)
                if (term_type == Symbols_Input_Type.string || term_type == Symbols_Input_Type.boolean) {
                    this.error("'Expression' error. Cannot subtract strings and booleans. Type error: " + term_type);
                    return false;
                }
            
            if (this.symbol == Symbols.plus)
                if (term_type == Symbols_Input_Type.boolean) {
                    this.error("'Expression' error. Cannot add booleans. Type error: " + term_type);
                    return false;
                }

            while (this.accept(Symbols.plus) || this.accept(Symbols.minus)) {
                // 2 = addition, 3 = subtraction
                operation = this.last_symbol_value == Symbols.plus ? 2 : 3;

                if ((loop_term_type = this.term()) === false) {
                    this.error("failed to evaluate term");
                    return false;
                }

                if (term_type != loop_term_type) {
                    this.error("'Expression' (addition/ subtraction expression) terms have different data type!" + 
                    " Operations +,- cannot be executed with incompatible data types");
                    return false;
                }

                if (operation == 2) {
                    switch (term_type) {
                        case Symbols_Input_Type.integer:
                        case Symbols_Input_Type.float:
                            push_instruction(Instructions.OPR, 0, operation);
                            break;
                        case Symbols_Input_Type.string:
                            // TODO: string concat operations
                            break;
                        default:
                            this.error("'Expression' failed because type: " + term_type + " does not support addtion.");
                            return false;
                    }
                } else {
                    if (term_type != Symbols_Input_Type.integer && term_type != Symbols_Input_Type.float) {
                        this.error("'Expression' failed because type: " + term_type + " does not support subtraction.");
                        return false;
                    }
                    push_instruction(Instructions.OPR, 0, operation);
                }
            }

            return true;
        },

        term: function() {
            let factor_type;

            // factor load/ prepares value to stack
            if ((factor_type = this.factor()) === false) {
                this.error("'Term' (multiplication/ division expression) failed to obtain factor");
                return false;
            }

            let loop_factor_type;
            let operation;

            // same if as the loop below - if we go to the loop we need to verify, that the operation makes sense
            if (this.symbol == Symbols.star || this.symbol == Symbols.slash)
                if (factor_type == Symbols_Input_Type.string || factor_type == Symbols_Input_Type.boolean) {
                    this.error("'Term' error. Cannot multiply or divide booleans or strings. Type error: " + 
                        factor_type);
                    return false;
                }

            while (this.accept(Symbols.star) || this.accept(Symbols.slash)) {
                // already verified, that the operation is either * or /. Also must save operation before factor()
                operation = this.last_symbol_value == Symbols.star ? 4 : 5; 
                
                if ((loop_factor_type = this.factor()) === false) {
                    this.error("'Term' (multiplication/ division expression) failed to obtain additional factor");
                    return false;
                }

                if (factor_type != loop_factor_type) {
                    this.error("'Term' (multiplication/ division expression) factors have different data type!" + 
                        " Operations *,/ cannot be executed with incompatible data types");
                    return false;
                }

                // another factor was loaded to stack, operation between 2 factors is now to be done and result will be on the stack
                push_instruction(Instructions.OPR, 0, operation);
            }

            return factor_type;
        },

        factor: function() {
            if (this.accept(Symbols.ident)) {
                let v = this.get_variable_by_name(this.last_symbol_value);
                if (v == null) {
                    this.error("Could not load variable value, because variable: " + 
                        this.last_symbol_value + " was not found.");
                    return false;
                }

                push_instruction(Instructions.LOD, v.level, v.position);
                return v.type;
            } else if (this.accept(Symbols.input)) {
                // loading various data types must be handled differently
                switch (symbol_input_type) {
                    case Symbols_Input_Type.boolean:
                        push_instruction(Instructions.LIT, 0, this.get_boolean_as_int(this.last_symbol_value));
                        break;
                    case Symbols_Input_Type.string:
                        {
                            // TODO: create string function - function that pushes the string to the memory and returns its address
                            push_instruction(Instructions.LIT, 0, 123); // address from string init
                            break;
                        }
                    case Symbols_Input_Type.float:
                    case Symbols_Input_Type.integer:
                        push_instruction(Instructions.LIT, 0, this.last_symbol_value);
                        break;
                    default:
                        this.error("Cannot push value to stack. Unrecognized data type for: " + this.last_symbol_value);
                }
                
                return symbol_input_type;
            } else if (this.accept(Symbols.open_bra)) {
                if (!this.expression()) {
                    this.error("Failed to compile nested expression (inside another expressions factor)");
                    return false;
                }
                if (!this.accept(Symbols.close_bra)) {
                    this.error("Nested expression must be close with closing bracket - ')'");
                    return false;
                }

                // TODO: expression result is on stack. Make expression return result type, so it can be returned here

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
                    if (!this.statement_if()) { // TODO: this needs instructions
                        return false;
                    }
                    break;
                case Symbols.open_bra:
                    if (!this.statement_open_bra()) { // TODO: this needs instructions
                        return false;
                    }
                    break;
                case Symbols.while:
                    if (!this.statement_while()) { // TODO: this needs instructions
                        return false;
                    }
                    break;
                case Symbols.for:
                    if (!this.statement_for()) { // TODO: this needs instructions
                        return false;
                    }
                    break;
                case Symbols.foreach:
                    if (!this.statement_foreach()) { // TODO: we don't have time to do this - remove it from lexer
                        return false;
                    }
                    break;
                case Symbols.return:
                    if (!this.statement_return()) { // TODO: this needs instructions
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
                    var_obj.position = 3 + vars.length; // 3 is used for registers
                    var_obj.level = this.level_counter;
                    vars.push(var_obj);
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.semicolon)) {
                    this.error("Missing semicolon at the end of const section.");
                    return false;
                }
            }

            // var
            if (this.accept(Symbols.var)) {
                do {
                    if ((var_obj = this.load_ident_and_type()) === false) 
                        return false; // failed parsing 

                    var_obj.position = 3 + vars.length; // 3 is used for registers
                    var_obj.level = this.level_counter;
                    vars.push(var_obj);
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.semicolon)) {
                    // TODO: see if tokenizer can provide line number for this error (it should)
                    this.error("Missing semicolon at the end of const section.");
                    return false;
                }
            }

            // must push vars before procedures, so we can use them in procs
            // let var_index = this.variables.length; // maybe for verification that we are later popping correct stack
            if (vars.length > 0)
            this.variables.push(vars);

            let pp_count = 0; // procedure-param count
            // procedures
            while (this.accept(Symbols.procedure)) {
                pp_count = this.block_procedure();
                
                if (pp_count < 0)
                    return false; // failed to compile procedure
            }

            // this value is returned - this is an address where this block instructions start
            let block_start = instruction_list.length;

            // alloc space for variables in current stack frame
            push_instruction(Instructions.INT, 0, 3 + pp_count + vars.length); // TODO: make 3 constant - always needs alloc for registers

            // initialize constant values
            vars.forEach(function (val, i) {
                if (val.constant) {
                    // TODO: linting suggest val.value is problematic, but i dont know why
                    if (val.value == undefined || val.value == null) {
                        this.error("Failed to generate constant initialization instructions. Constant: " + 
                            val.name + " does not have a value!");
                        return false;
                    }
                    push_instruction(Instructions.LIT, 0, val.value);
                    push_instruction(Instructions.STO, val.level, val.position);
                }
            })

            // TODO: set PC
            if (!this.statement()) {
                // print some error? - statement compiling will print errors on where it failed
                return false;
            }

            // TODO: is this wanted?
            this.variables.pop(); // at the top of the array should be only this blocks stack - maybe verify with index?

            push_instruction(Instructions.RET, 0, 0); // TODO: ret value?

            return block_start;
        },
    
        program: function() {
            this.compilationErrors = []; //Empty the errors ftom previous iterations
            this.context_list = [];
            instruction_list = []; // empty instruction list (global)

            this.next_sym();

            let main_context = this.push_context("main", -1); // TODO main block name constant?
            let block_start = 0;
            if ((block_start = this.block()) === false)
                return this.compilationErrors; // failed to parse the body of the program - dot won't be reached by tokenizer (lexer)
            main_context.c_address = block_start;

            if (!this.accept(Symbols.dot))
                this.error("The program MUST end with '.' (dot)");

            // must push in reverse to keep correct order when pushing to start
            for (i = (this.context_list.length - 1); i >= 0; i--) {
                push_instruction_to_start(Instructions.JMP, 0,
                    this.context_list[i].c_address + this.context_list.length);
                console.log("%d pushing %s", i, this.context_list[i].c_name);
            }

            return this.compilationErrors;
        },
    
        /**************************************************************************************************************
         * private functions - used in non-terminal function calls                                                    *
         **************************************************************************************************************/

        /**
         * Pushes new context object to "context_list". Context must contain name and adress. Optionally context return
         * type if present.
         */
        push_context: function(c_name, c_address, c_return_type = null) {
            console.log("adding context: " + c_name);
            // TODO: not doing error checking - is that ok? - only used privately anyway
            this.context_list.push({c_name, c_address, c_return_type});
            return this.context_list[this.context_list.length - 1];
        },

        /**
         * Searches the context_list. If the list contains object with @c_name returns it. Returns null otherwise.
         */
        get_context_by_name: function (c_name) {
            for (i in this.context_list) {
                if (this.context_list[i].c_name == c_name) {
                    return this.context_list[i];
                }
            }

            return null;
        },

        get_context_index_by_name: function (c_name) {
            for (i in this.context_list) {
                if (this.context_list[i].c_name == c_name) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Returns variable closest to current context scope or null. If the same variable name is contained in 
         * different context - eg. "a" in global context and "a" in procedure "test", then "a" from "test" 
         * will be returned.
         */
        get_variable_by_name: function (var_name) {
            // reversing the list from end, because new scopes are at the end of the list
            for (i = (this.variables.length - 1); i >= 0; i--) {
                let inner_list = this.variables[i];
                // reversing inner list, because constants are at the start of the list, which might not be as desired as variables
                for (j = (inner_list.length - 1); j >= 0; j--) {
                    if (inner_list[j].name == var_name)
                        return inner_list[j];
                }
            }

            return null;
        },

        get_boolean_as_int: function(bool_string) {
            return bool_string == "true" ? 1 : 0;
        },

        validate_data_type: function(input) {
            Object.keys(Symbols_Input_Type).forEach(key => {
                if (Symbols_Input_Type[key] == input)
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
                    data_type = Symbols_Input_Type[this.last_symbol_value]; 

            return [ident_name, data_type];
        },

        /**
         * Validates if value is valid data type and determines it. Also validates against expected data type.
         * @param {*} value that is validated or resolved.
         * @param {*} expected_dtype can be null. Expected data type of the value
         * @returns Symbols_Input_Type value on success. "false" otherwise.
         */
        validate_value_and_type: function(value, expected_dtype) {
            // TODO: if this is to be used it must be fixed, because lexer always returns string and typeof doesn't work on it

            switch (typeof value) {
                case "number":
                    {
                        if (!isNaN(value)) return false;
                        // value type doesn't match expected data type
                        if (expected_dtype != null && 
                            (expected_dtype[1] != Symbols_Input_Type["integer"] || expected_dtype[1] != Symbols_Input_Type["float"]))
                        {
                            this.error("Data type mismatch. Recieved number (int/ float), but declaration expects: " + expected_dtype);
                            return false;
                        }
                        
                        return Number.isInteger(value) ? Symbols_Input_Type["integer"] : Symbols_Input_Type["float"];
                    }
                case "string":
                    {
                        // typeof validates that the value is string
                        if (expected_dtype != null && expected_dtype != Symbols_Input_Type["string"]) return false;
                        return Symbols_Input_Type["string"];
                    }
                case "boolean":
                    {
                        // typeof validates that the value is true/ false
                        if (expected_dtype != null && expected_dtype != Symbols_Input_Type["boolean"]) return false;
                        return Symbols_Input_Type["boolean"];
                    }
                default:
                    this.error("Unrecognized data type. Supported data types are: integer, float, string");
            }

            return false;
        },

        validate_last_type_to_expected: function(expected_dtype) {
            return symbol_input_type == expected_dtype;
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
                    this.error("Invalid data type while parsing constants or variables. Data type: " + name_and_type[1]);
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

            if (this.validate_last_type_to_expected(var_obj.type) === false) {
                this.error("Failed to validate value.");
                return false;
            }
            // if (this.validate_value_and_type(this.last_symbol_value, var_obj.type) === false) {
            //     this.error("Failed to validate value.");
            //     return false;
            // }

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
            let param_count = 0;

            // increase level counter, because we are now "deeper"
            this.level_counter++;

            // ident
            if (!this.accept(Symbols.ident)) {
                this.error("Following identifier is invalid: " + this.last_symbol_value);
                return -1;
            }

            ident_name = this.last_symbol_value; // name is valid identifier

            let return_type;
            if (this.accept(Symbols.data_type)) {
                return_type = Symbols_Input_Type[this.last_symbol_value];
            }

            // check if context name is available
            if (this.get_context_by_name(ident_name) != null) {
                this.error("Compilation failed because context with name: " + ident_name + ", already exists." + 
                        " Please ensure name: " + ident_name + " is unique.");
                return -1;
            }

            // optionally parameters
            // [ "(" ident [ : data_type ] {"," ident [ : data_type ]} ")" ]
            if (this.accept(Symbols.open_bra)) {
                // 
                do {
                    if (this.block_ident_declaration() == null) 
                        return -1; // failed parsing 

                    param_count++;
                    // TODO: save param name to some structure
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.close_bra)) {
                    // TODO: see if tokenizer can provide line number for this error (it should)
                    this.error("Procedure paramater declaration MUST BE closed by ')'");
                    return -1;
                }
            }

            // ;
            if (!this.accept(Symbols.semicolon)) {
                this.error("Procedure (" + ident_name + ") header (declaration) must end with ';'");
                return -1;
            }
            
            // block
            let current_context = this.push_context(ident_name, -1, return_type);
            let block_start = 0;
            if ((block_start = this.block()) === false) {
                this.error("Failed to compile procedure (" + ident_name + ") body.");
                return -1;
            }
            current_context.c_address = block_start;

            // ;
            if (!this.accept(Symbols.semicolon)) {
                this.error("Procedure (" + ident_name + ") body must end with ';'");
                return -1;
            }

            // decrease level counter because we are returning
            this.level_counter--;

            return param_count;
        },


        // statement functions


        statement_ident: function() {
            // simple version: ident := expression; // where ; is checked by caller
            // multiple assignments: ident := ident := ident := expression; // problem: ident can expression - how to determine when it ends?
            // TODO: will have to add additional rule to the grammar

            // first "ident" already verified by caller
            this.accept(Symbols.ident);

            let variable = this.get_variable_by_name(this.last_symbol_value);

            if (variable == null) {
                this.error("Assignment statement failed. Identifier: " + this.last_symbol_value + " not found");
                return false;
            }

            // simple version
            if (!this.accept(Symbols.assignment)) {
                this.error("Statement expected assignment symbol. Statement: " + this.symbol_value);
                return false;
            }

            if (!this.expression()) {
                this.error("Assignment must end with a valid expression.");
                return false;
            }

            // expecting that expression result is at the top of the stack
            push_instruction(Instructions.STO, variable.level, variable.position);

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
            let vars = [];

            // { verified by caller
            this.accept(Symbols.open_curl);

            // ident {, ident}
            do {
                if (!this.accept(Symbols.ident)) {
                    this.error(this.symbol_value + " is not a valid identifier for multiple assignment.");
                    return false;
                }

                let v = this.get_variable_by_name(this.last_symbol_value)
                if (v == null) {
                    this.error("Multiple assignment statement failed. Identifier: " + 
                        this.last_symbol_value + " not found");
                    return false;
                }
                vars.push(v);

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

            let i = 0;
            // value {, value}
            do {
                if (!this.accept(Symbols.input)) {
                    this.error("Invalid value. This value is a keyword or is otherwise invalid. Value: " + this.symbol_value);
                    return false;
                }

                
                // TODO: value type checking (after LINT refactor)
                push_instruction(Instructions.LIT, 0, this.last_symbol_value);
                push_instruction(Instructions.STO, vars[i].level, vars[i].position);

                ident_counter--;
                i++;
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
                this.error("Call failed because identifier: " + this.last_symbol_value + " is invalid.");
                return false;
            }

            let context_index = this.get_context_index_by_name(this.last_symbol_value);
            if (context_index < 0) {
                this.error("Call failed because identifier: " + this.last_symbol_value + " does not exist.");
                return false;
            }

            // except for main - main is always index 0 and is first instruction of the program
            push_instruction(Instructions.CAL, 0, context_index);
            
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