// symbols used in grammar -- used by tokenizer (lexer) to return parsed token
const Symbols = {
    // constant symbols - keywords and such
    begin:          "begin",
    call:           "call",
    const:          "const",
    do:             "do",
    else:           "else",
    end:            "end", 
    foreach:        "foreach", // NOTE: must be matched before "for" -- cancelled
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
    comment_start:  "(*",
    comment_end:    "*)",
    ampersand:      "&",
    pipe:           "|",
    tilde:          "~",
    // dynamic inputs (dependant on input) - must read input
    ident:          "id",
    input:          "input",
    data_type:      "data_type",
    // error symbols
    ERR:            "ERR",
    EOF:            "EOF",
}

let symbol_input_type;
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

// https://usermanual.wiki/Pdf/PL020Users20Manual.15518986/help
// const OPR = {
//     return:             0,
//     negation:           1,
//     addition:           2,
//     subtraction:        3,
//     multiplication:     4,
//     division:           5,
//     odd:                6,
//     modulo:             7,
//     equality:           8,
//     inequality:         9,
//     less_than:          10,
//     less_then_equal:    11,
//     greater_than:       12,
//     greater_than_equal: 13,
// }

// operations according to the online interpret for KIV/FJP (some operations are under different number)
const OPR = {
    return:             0,
    negation:           1,
    addition:           2,
    subtraction:        3,
    multiplication:     4,
    division:           5,
    odd:                7, // WARNING: interpreter swapped odd with modulo compared to the manual
    modulo:             6, // WARNING: same as odd
    equality:           8,
    inequality:         9,
    less_than:          10,
    less_then_equal:    13, // WARNING: changed compared to manual
    greater_than:       12,
    greater_than_equal: 11, // WARNING: changed compared to manual
}

// used to verify what operations are permitted with what data type
const dtype_operations = new Map();
dtype_operations.set(Symbols_Input_Type.integer, [Symbols.plus, Symbols.minus, Symbols.star, Symbols.slash, Symbols.eq, 
                                                  Symbols.hash_mark, Symbols.less_than, Symbols.less_then_equal, 
                                                  Symbols.greater_than, Symbols.greater_than_equal]);
dtype_operations.set(Symbols_Input_Type.float,   [Symbols.plus, Symbols.minus, Symbols.star, Symbols.slash, Symbols.eq, 
                                                  Symbols.hash_mark, Symbols.less_than, Symbols.less_then_equal, 
                                                  Symbols.greater_than, Symbols.greater_than_equal]);
dtype_operations.set(Symbols_Input_Type.boolean, [Symbols.eq, Symbols.hash_mark, Symbols.tilde, Symbols.ampersand, 
                                                  Symbols.pipe]);
dtype_operations.set(Symbols_Input_Type.string,  [Symbols.eq, Symbols.hash_mark, Symbols.plus]);

// resulting instructions
let instruction_list = [];

/**
 * Used for inserting instructions to instruction_list. Creates object for instruction.
 * @param {*} inst type (from Instructions enum)
 * @param {*} par1 first parameter
 * @param {*} par2 second parameter
 * @returns 
 */
function push_instruction(inst = Instructions.ERR, par1 = -1, par2 = -1) {
    if (inst === Instructions.ERR) {
        // TODO: when this fails, the compilation continues...
        console.log("ERROR - tried to push instructions without specifing all parameters");
        return;
    }

    instruction_list.push({inst, par1, par2});
}

/**
 * Calls push_instructions and additionaly returns newly constructed instruction.
 * @param {*} inst type (from Instructions enum)
 * @param {*} par1 first parameter
 * @param {*} par2 second parameter
 * @returns 
 */
function push_instruction_and_return(inst = Instructions.ERR, par1 = -1, par2 = -1) {
    push_instruction(inst, par1, par2);
    return instruction_list[instruction_list.length - 1];
}

/**
 * Pushes instruction to the start of the list. DOES NOT offset jumps in the list.
 * @param {*} inst type (from Instructions enum)
 * @param {*} par1 first parameter
 * @param {*} par2 second parameter
 * @returns 
 */
function push_instruction_to_start(inst = Instructions.ERR, par1 = -1, par2 = -1) {
    if (inst === Instructions.ERR) {
        console.log("ERROR - tried to push instructions without specifing all parameters");
        return;
    }

    instruction_list.unshift({inst, par1, par2});
}

/**
 * Outputs the instruction list to GUI.
 */
function print_instruction_list() {
    let textArea = document.getElementById("editor-out");
    textArea.innerHTML = ""; // clear the text area
    let line;

    for (let i = 0; i < instruction_list.length; i++) {
        line = i + " " + instruction_list[i].inst + "\t" + 
                         instruction_list[i].par1 + "\t" + 
                         instruction_list[i].par2 + "\n";
        textArea.innerHTML += line;
    }
}

/**
 * The compiler's main "object"
 */
let recursive_descent = (function() {
    /**
     * Makes object holding information about a variable. 
     * Name is required parameter but other parameters have default values.
     */
    function make_var(name, type = Symbols_Input_Type.integer, value = null, constant = false, level = 0, 
                      position = 0, is_param = false)
    {
        if (type == null)
            type = Symbols_Input_Type.integer;
        return {name, type, value, constant, level, position, is_param};
    }

    let descent = ({
        // "constants"
        SB_DB_PC_RV: 4, // basic registers (static base, dynamic base, program counter) + newly added Return Value
        main_context_name: "main",
       
        // lexer variables
        symbol: null,
        last_symbol_value: null,
        symbol_value: null,
        symbol_counter: 0, // increases when lexer parses symbol - can be used to underline syntax errors (should correspond to error word)
        
        // compiler output
        compilationErrors: [],

        // variables and context_list represent symbol table
        // array of arrays (matrix) for constants and variables in a scope - every inner array is one scope of a level (index should correspons to level)
        variables: [],
        context_list: [],

        level_counter: 0,
        for_nest_counter: 0, // holds total number of nested if
        for_var_count: 0, // increses/ decreses when entering/ leaving for loop
        ternary_return_flag: false,
        processing_condition: false, // flag that is true, when processing condition - to determin whether &,| are logic operators or condition concat operators
    
        /**
         * Loads next symbol from lexer (tokenizer) into symbol variable. 
         * Puts Symbols.ERR on error and Symbols.EOF on End of File - input.
         */
        next_sym: function() {
            this.last_symbol_value = tokenizer.yytext;
            let reading_comment = false;
    
            try {
                do {
                    if (this.symbol === Symbols.comment_end)
                        reading_comment = false;

                    do {
                        this.symbol = tokenizer.next();
                    } while (this.symbol === false); // next returns "false" on whitespace

                    if (this.symbol === Symbols.comment_start)
                        reading_comment = true;
                    if (this.symbol === tokenizer.EOF)
                        break; // reached EOF - this is in case EOF is reached in comment
                } while (reading_comment);

                this.symbol_value = tokenizer.yytext;
                this.symbol_counter++;
            } catch(error) {
                this.symbol = Symbols.ERR;
                // probably should do symbol_counter++; for correct highlighting
            }
    
            if (this.symbol === tokenizer.EOF)
                this.symbol = Symbols.EOF; // EOF should throw error anywhere in recursive_descent - MUST NOT BE PART OF GRAMMAR
        },
    
        /**
         * Accepts current symbol loaded by lexer if its equal to @sym and loads next symbol.
         * @param {*} sym expected symbol
         * @returns true if symbol matches, false otherwise
         */
        accept: function(sym) {
            if (this.symbol === sym) {
                this.next_sym();
                return true;
            }
    
            return false;
        },
    
        /**
         * Puts error message into error list to be displayed to user in GUI.
         * @param {*} err_msg message to be displayed
         */
        error: function(err_msg) {
            this.compilationErrors.push({
                line: tokenizer.yylineno + 1,
                err: err_msg,
                // symbol: this.symbol_value
                symbol: this.last_symbol_value
            });
        },

        /**
         * Grammar rule: condition_expression = ["~"] condition { ("&"|"|") ["~"] condition }
         * @returns true on success
         */
        condition_expression: function() {
            this.processing_condition = true;

            if (this.condition_expression_inner() === false) {
                this.error("Failed to parse condition expression.");
                return false;
            }

            let is_true_on_and;
            while (this.accept(Symbols.ampersand) || this.accept(Symbols.pipe)) {
                is_true_on_and = this.last_symbol_value == Symbols.ampersand ? true : false;

                if (this.condition_expression_inner() === false) {
                    this.error("Failed to parse condition expression.");
                    return false;
                }

                if (is_true_on_and) {
                    this.logical_and_inst();
                } else {
                    this.logical_or_inst();
                }
            }

            this.processing_condition = false;

            return true;
        },

        /** 
         * Takes two values at the top of the stack and adds them together. Expects boolean values at the stack (1/0).
         * Then pushes 2 and call operation equality - this consumes 2 values and pushes "1" if the values equal 2
         * => both values were one, so both were true. Pushes "0" otherwise.
         */
        logical_and_inst: function() {
            push_instruction(Instructions.OPR, 0, OPR.addition); // cond1 + cond2
            push_instruction(Instructions.LIT, 0, 2); // push 2
            push_instruction(Instructions.OPR, 0, OPR.equality);
        },

        /**
         * Takes two values at the top of the stack and adds them together. Expects boolean values at the stack (1/0).
         * Then pushes 0 and call operation IN-equality - this consumes 2 values and pushes "1" if the sum does not
         * equal 0, pushes "0" if the sum is 0 => atleast one value has to be true.
         */
        logical_or_inst: function() {
            push_instruction(Instructions.OPR, 0, OPR.addition); // cond1 + cond2
            push_instruction(Instructions.LIT, 0, 0); // push 2
            push_instruction(Instructions.OPR, 0, OPR.inequality); // if not equal to 0, then either (or both) conditions is true - 1 pushed to stack
        },

        /**
         * "Generates" (pushes) instructions that negate result of a condition on top of the stack 
         * (results must be boolean = 1/0).
         */
        negate_condition_inst: function() {
            // result of condition (comparison operator) can only be 1/0
            // (res + 1) % 2 = new_res - should invert truth value
            push_instruction(Instructions.LIT, 0, 1);
            push_instruction(Instructions.OPR, 0, OPR.addition);
            push_instruction(Instructions.OPR, 0, OPR.odd);
        },

        /**
         * Part of grammar rule: condition_expression = ["~"] condition { ("&"|"|") ["~"] condition }.
         * Specifically ["~"] condition.
         * @returns true on success, false on condition compilation failure
         */
        condition_expression_inner: function() {
            let negate_cond = false;

            if (this.accept(Symbols.tilde)) {
                negate_cond = true;
            }

            if (!this.condition()) {
                this.error("Failed to evaluate condition.");
                return false;
            }

            // result of the condition is on stack
            if (negate_cond) {
                this.negate_condition_inst();
            }

            return true;
        },

        /**
         * Grammar rule: condition = "odd" expression | expression ("="|"#"|"<"|"<="|">"|">=") expression ;
         * @returns true on success, false on failure to parse any part of the condition
         */
        condition: function() {
            let expr_type;

            if (this.accept(Symbols.odd)) {
                if ((expr_type = this.expression()) === false) {
                    this.error("Failed to evaluate 'odd' expression.");
                    return false;
                }

                if (expr_type != Symbols_Input_Type.integer) {
                    this.error("Condition cannot be evaluated. 'odd' can only be used with integers");
                    return false;
                }

                // assuming expression result is on top of the stack
                push_instruction(Instructions.OPR, 0, OPR.odd);

                return true;
            } else if ((expr_type = this.expression())) {
                let op_number = 0;

                switch (this.symbol) {
                    case Symbols.eq:
                        this.accept(Symbols.eq);
                        op_number = OPR.equality; // 8 = equal
                        break;
                    case Symbols.hash_mark:
                        this.accept(Symbols.hash_mark);
                        op_number = OPR.inequality; // 9 = inequal
                        break;
                    case Symbols.lt:
                        this.accept(Symbols.lt);
                        op_number = OPR.less_than; // 10 = less than
                        break;
                    case Symbols.lte:
                        this.accept(Symbols.lte);
                        op_number = OPR.less_then_equal; // 11 = less than or equal
                        break;
                    case Symbols.gt:
                        this.accept(Symbols.gt);
                        op_number = OPR.greater_than; // 12 = greater than
                        break;
                    case Symbols.gte:
                        this.accept(Symbols.gte);
                        op_number = OPR.greater_than_equal; // 13 = greater than or equal
                        break;
                    default:
                        this.error("Unrecognized comparison operation.");
                        return false;
                }

                let expr_type2;
                if ((expr_type2 = this.expression()) === false) {
                    this.error("Failed to evaluate second expression.");
                    return false;
                }

                if (expr_type != expr_type2) {
                    this.error("Condition cannot be evaluated. Left and right expressions evaluate into different " + 
                        " data types and therefore cannot be compared.");
                    return false;
                }

                // strings and booleans can only be compared for equality/ inequality
                if (op_number > OPR.inequality && 
                    (expr_type == Symbols_Input_Type.string || expr_type == Symbols_Input_Type.boolean)) 
                {
                    this.error("Condition cannot be evaluated. Strings and boolean can only be " + 
                        " compared for equality/ inequality!");
                    return false;
                }

                switch (expr_type) {
                    case Symbols_Input_Type.string:
                        // TODO: cutom string comparions
                        this.error("Operation with strings is not supported at the moment.");
                        return false;
                    case Symbols_Input_Type.boolean: // boolean is represented as 1/0 - same operations as int
                    case Symbols_Input_Type.integer:
                    case Symbols_Input_Type.float:
                        // assumes that top of stack is results of 2 expressions
                        push_instruction(Instructions.OPR, 0, op_number);
                        break;
                    default:
                        this.error("Unkown data type inside condition. Cannot determine operation.");
                        return false;
                }

                return true;
            }

            this.error("This code is not a condition: " + this.symbol_value);
            return false;
        },

        /**
         * Grammar rule: expression = ["+"|"-"] term {("+"|"-") term} | "call" ident;
         * @returns data type of the expression on success, false otherwise
         */
        expression: function() {
            // expression can be "result" of call, however to use statement_call, we must verify the "call" symbol
            if (this.symbol == Symbols.call) {
                let return_type;

                if ((return_type = this.statement_call())) {
                    push_instruction(Instructions.LOD, 0, 3); // load RV after call - for further work with it
                    // caller should verify, if the data type is correct
                    return return_type;
                }
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

            // check if +/- operations are permitted with this data type --- this should be repalced with map check now
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
                operation = this.last_symbol_value == Symbols.plus ? OPR.addition : OPR.subtraction;

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
                            this.error("Operation with strings is not supported at the moment.");
                            return false;
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

            return term_type;
        },

        /**
         * Grammar rule: term = ["~"] factor { ("*"|"/"|"&"|"|") ["~"] factor};
         * @returns data type of the term on success, false otherwise
         */
        term: function() {
            let inner_type;

            if ((inner_type = this.term_inner()) === false) {
                this.error("Failed to compile term.");
                return false;
            }

            let loop_inner_type;
            let operation;

            // processing condition => &,| are condition concat operators and not expression operators!
            if (this.processing_condition && inner_type != Symbols_Input_Type.boolean) {
                if (this.symbol == Symbols.ampersand || this.symbol == Symbols.pipe)
                    return inner_type;
            }

            while (this.accept(Symbols.star) || this.accept(Symbols.slash) || 
                   this.accept(Symbols.ampersand) || this.accept(Symbols.pipe)) 
            {
                operation = this.last_symbol_value; // JS can work with this as if it was Symbol, altough its string (lexer yytext)
                
                if ((loop_inner_type = this.term_inner()) === false) {
                    this.error("Failed to compile additional term.");
                    return false;
                }

                if (inner_type != loop_inner_type) {
                    this.error("'Term' factors have different data type!" + 
                        " Operations *,/,&,| can only be used on the same data type.");
                    return false;
                }

                if (!this.has_type_action(inner_type, operation)) {
                    this.error("'Term' error. Type: " + inner_type + " does not suppord operation: " + operation);
                    return false;
                }

                switch (operation) {
                    case Symbols.star:
                        push_instruction(Instructions.OPR, 0, OPR.multiplication);
                        break;
                    case Symbols.slash:
                        push_instruction(Instructions.OPR, 0, OPR.division);
                        break;
                    case Symbols.ampersand:
                        // these instructions are used to take 2 boolean values on stack and combine it to AND result
                        this.logical_and_inst();
                        break;
                    case Symbols.pipe:
                        // these instructions are used to take 2 boolean values on stack and combine it to OR result
                        this.logical_or_inst();
                        break;
                    default:
                        this.error("Invalid 'term' operation!");
                        return false;
                }                
            }

            return inner_type;
        },

        /**
         * Part of grammar rule: term = ["~"] factor { ("*"|"/"|"&"|"|") ["~"] factor};
         * Specifically ["~"] factor
         * @returns true on success, false on condition compilation failure
         */
        term_inner: function() {
            let negate = false;

            if (this.accept(Symbols.tilde)) {
                negate = true;
            }

            let factor_type;

            // factor load/ prepares value to stack
            if ((factor_type = this.factor()) === false) {
                this.error("'Term' failed to obtain factor (identifier/ value)");
                return false;
            }

            if (negate) {
                if (!this.has_type_action(factor_type, Symbols.tilde))
                    return false; // error printed by has_type_action
                
                if (factor_type == Symbols_Input_Type.boolean) {
                    // altough the function name says "condition" the principle for inverting boolean is the same => condition is boolean
                    this.negate_condition_inst();
                } else {
                    // this shouldn't occur, unless someone tries to add new data type to the dtype_operations map
                    this.error("Negation '~' is only defined for booleans!");
                    return false;
                }
            }

            return factor_type;
        },

        /**
         * Grammar rule: factor = ident | value | "(" expression ")";
         * @returns data type of the factor on success, false otherwise
         */
        factor: function() {
            if (this.accept(Symbols.ident)) {
                let v = this.get_variable_by_name(this.last_symbol_value);
                if (v == null) {
                    this.error("Could not load variable value, because variable: " + 
                        this.last_symbol_value + " was not found.");
                    return false;
                }

                push_instruction(Instructions.LOD, Math.abs(v.level - this.level_counter), v.position);
                return v.type;
            } else if (this.accept(Symbols.input)) {
                // loading various data types must be handled differently
                switch (symbol_input_type) {
                    case Symbols_Input_Type.boolean:
                        push_instruction(Instructions.LIT, 0, this.get_boolean_as_int(this.last_symbol_value));
                        break;
                    case Symbols_Input_Type.string:
                        {
                            this.error("Operation with strings is not supported at the moment.");
                            // TODO: create string function - function that pushes the string to the memory and returns its address
                            // push_instruction(Instructions.LIT, 0, 123); // address from string init
                            return false;
                        }
                    case Symbols_Input_Type.float:
                    case Symbols_Input_Type.integer:
                        // NOTE: praseFloat should return integer value, if the value doesn't have decimal part
                        push_instruction(Instructions.LIT, 0, parseFloat(this.last_symbol_value));
                        break;
                    default:
                        this.error("Cannot push value to stack. Unrecognized data type for: " + this.last_symbol_value);
                }
                
                return symbol_input_type;
            } else if (this.accept(Symbols.open_bra)) {
                let expression_type;

                if ((expression_type = this.expression()) === false) {
                    this.error("Failed to compile nested expression (inside another expressions factor)");
                    return false;
                }
                if (!this.accept(Symbols.close_bra)) {
                    this.error("Nested expression must be close with closing bracket - ')'");
                    return false;
                }

                return expression_type;
            }

            this.error("Unrecognized factor: " + this.symbol_value);
            return false;
        },

        /**
         * Decider for grammar rule: statement
         * @returns true on success, false on failure, 10 on "end" (statement block end)
         */
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
                    if (this.statement_call() === false) {
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
                case Symbols.return:
                    if (!this.statement_return()) {
                        return false;
                    }
                    break;
                case Symbols.end:
                    if (!this.statement_end()) {
                        return false;
                    }
                    return 10; // special case - returns 10 on true - doesn't return boolean
                default:
                    this.error("Unrecognized statement: " + this.symbol_value);
                    return false;
            }

            this.accept(Symbols.semicolon); // statement can (but doesn't have to be) ended with ';' (no if)

            return true;
        },
    
        /**
         * Grammar rule: block = ...
         * @param {*} params array of variables, that the block takes as parameters
         * @returns position where this block instruction start (int) on success, false otherwise
         */
        block: function(params) {
            let vars = []; // constants and variables of current scope
            let var_obj;

            // if block has params, then push them at the start of all variables
            if (params != undefined && params != null && params.length > 0) {
                for (let i = 0; i < params.length; i++) {
                    vars.push(params[i]);
                }
            }

            // const
            if (this.accept(Symbols.const)) {
                do {
                    if ((var_obj = this.block_const()) === false) 
                        return false; // failed parsing
                        
                    var_obj.position = this.SB_DB_PC_RV + vars.length;
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

                    var_obj.position = this.SB_DB_PC_RV + vars.length;
                    var_obj.level = this.level_counter;
                    vars.push(var_obj);
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.semicolon)) {
                    this.error("Missing semicolon at the end of const section.");
                    return false;
                }
            }

            // must push vars before procedures, so we can use them in procs
            this.variables.push(vars);

            // procedures
            while (this.accept(Symbols.procedure)) {
                if (!this.block_procedure()) {
                    this.error("Failed to compile procedure body.");
                    return false;
                }
            }

            // this value is returned - this is an address where this block instructions start
            let block_start = instruction_list.length;

            // alloc space for variables in current stack frame - number changes after analyzing for loops
            let stac_alloc_inst = push_instruction_and_return(Instructions.INT, 0, 0);

            // if block has params, then push them at the start of all variables
            // param values are resolved before call
            if (params != undefined && params != null && params.length > 0) {

                // load params from previous context
                for (let i = 1; i <= params.length; i++) {
                    // LIT -i loads values from the top of the stack in previous context
                    push_instruction(Instructions.LOD, 0, -i);
                    push_instruction(Instructions.STO, 0, this.SB_DB_PC_RV + params.length - i); // top of the previous stack is last param
                }
            }

            // initialize constant values
            for (let i = 0; i < vars.length; i++) {
                let val = vars[i];
                if (val.constant) {
                    if (val.value == undefined || val.value == null) {
                        this.error("Failed to generate constant initialization instructions. Constant: " + 
                            val.name + " does not have a value!");
                        return false;
                    }

                    switch (val.type) {
                        case Symbols_Input_Type.boolean:
                            push_instruction(Instructions.LIT, 0, this.get_boolean_as_int(val.value));
                            break;
                        // other types (float, string, integer) use raw value (string is a pointer to heap = integer)
                        default:
                            push_instruction(Instructions.LIT, 0, val.value);
                    }
                    
                    // level is always 0, because we are initing constants for current scope (each scope inits its own constants)
                    push_instruction(Instructions.STO, 0, val.position);
                }
            }

            if (!this.statement()) {
                return false;
            }

            // pop variables of this context (so they are not available for other contexts)
            this.variables.pop();

            // setting stack frame allocation AFTER statements, because statements can require "dynamic" number of variables
            stac_alloc_inst.par2 = this.SB_DB_PC_RV + vars.length + this.for_var_count;

            this.for_var_count = 0; // counter reset

            // TODO: this is doubled, when return is last statement (= unreachable - small optimalization = low prio)
            push_instruction(Instructions.RET, 0, 0);

            return block_start;
        },
    
        /**
         * Grammar rule: program = block "." ;
         * Entry point to the compiler. Resets flags, counters etc. on call.
         * @returns compilationErrors list if there are any
         */
        program: function() {
            // reset recursive descent flags
            this.compilationErrors = []; //Empty the errors ftom previous iterations
            this.variables = [];
            this.context_list = [];
            instruction_list = []; // empty instruction list (global)
            this.level_counter = 0;
            this.for_nest_counter = 0;
            this.for_var_count = 0;
            this.ternary_return_flag = false;

            this.next_sym();

            let main_context = this.push_context(this.main_context_name, -1);
            let block_start = 0;
            if ((block_start = this.block()) === false)
                return this.compilationErrors; // failed to parse the body of the program - dot won't be reached by tokenizer (lexer)
            main_context.c_address = block_start;

            if (!this.accept(Symbols.dot))
                this.error("The program MUST end with '.' (dot)");

            // must push in reverse to keep correct order when pushing to start
            for (let i = (this.context_list.length - 1); i >= 0; i--) {
                push_instruction_to_start(Instructions.JMP, 0, this.context_list[i].c_address);
            }

            // all jumps must be offset by |context_list|, because those instructions are inserted to start offseting all other instructions
            let context_list_len = this.context_list.length;
            instruction_list.forEach(function (val, i) {
                if (val.inst == Instructions.JMP || val.inst == Instructions.JMC)
                    val.par2 += context_list_len;
            });

            return this.compilationErrors;
        },
    
        /**************************************************************************************************************\
         * private functions - used in non-terminal function calls                                                    *
        \**************************************************************************************************************/

        /**
         * Pushes new context object to "context_list". Context must contain name and adress. Optionally context return
         * type if present.
         */
        push_context: function(c_name, c_address, c_return_type = null, c_level = 0, c_par_count = 0) {
            this.context_list.push({c_name, c_address, c_return_type, c_level, c_par_count});
            return this.context_list[this.context_list.length - 1];
        },

        /**
         * Searches the context_list. If the list contains object with @c_name returns it. Returns null otherwise.
         */
        get_context_by_name: function (c_name) {
            for (let i in this.context_list) {
                if (this.context_list[i].c_name == c_name) {
                    return this.context_list[i];
                }
            }

            return null;
        },

        /**
         * Searches the context_list. If the list contains object with @c_name returns its index. Returns -1 otherwise.
         * 
         * NOTE: could be replaced with just: get_context_by_name
         */
        get_context_index_by_name: function (c_name) {
            for (let i in this.context_list) {
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
            for (let i = (this.variables.length - 1); i >= 0; i--) {
                let inner_list = this.variables[i];
                // reversing inner list, because constants are at the start of the list, which might not be as desired as variables
                for (let j = (inner_list.length - 1); j >= 0; j--) {
                    if (inner_list[j].name == var_name)
                        return inner_list[j];
                }
            }

            return null;
        },

        /**
         * Resolves "true" into 1, 0 otherwise
         */
        get_boolean_as_int: function(bool_string) {
            return bool_string == "true" ? 1 : 0;
        },

        /**
         * Checks if @input exists in data types
         */
        validate_data_type: function(input) {
            let types = Object.keys(Symbols_Input_Type);
            for (let i = 0; i < types.length; i++) {
                if (types[i] == input)
                    return true;
            }

            return false;
        },

        /**
         * Returns true if @type can perform @action operation. False otherwise
         */
        has_type_action: function(type, action) {
            if (dtype_operations.has(type)) {
                if (dtype_operations.get(type).indexOf(action) >= 0)
                    return true;
        
                this.error("Type: " + type +" does not support action: " + action);
            } else {
                this.error("Cannot verify action for type: " + type + ". This type does not exist.");
            }
        
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
         * Validates wether expected data type was read. Validation is done compared to data type set by lexer. 
         * Lexer can resolve what data type was loaded => improved efficiency.
         */
        validate_last_type_to_expected: function(expected_dtype) {
            return symbol_input_type == expected_dtype;
        },

        /**
         * Accepts identifier and its type (if supplied).
         * @returns object representing variable or false
         */
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
            return make_var(name_and_type[0], name_and_type[1]);
        },
    
        /**
         * Accepts variables, that represent constants. These variables must be initialized with values.
         * @returns "variable object" on success, false otherwise
         */
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

            var_obj.value = this.last_symbol_value;
            var_obj.constant = true;

            return var_obj;
        },

        /**
         * Part of grammar rule block: { "procedure" [data_type] ident [ "(" ident [ : data_type ] {"," ident [ : data_type ]} ")" ] ";" block ";" } statement ;
         * Parses procedures defined in block.
         * @returns true on success, false otherwise
         */
        block_procedure: function() {
            let ident_name;
            let param_count = 0;

            // increase level counter, because we are now "deeper"
            this.level_counter++;

            let return_type;
            if (this.accept(Symbols.data_type)) {
                return_type = Symbols_Input_Type[this.last_symbol_value];
                if (return_type == undefined) {
                    this.error("Failed to determine return type of procedure. Value: " + this.last_symbol_value);
                    return false;
                }
            }

            // ident
            if (!this.accept(Symbols.ident)) {
                this.error("Following identifier is invalid: " + this.last_symbol_value);
                return false;
            }

            ident_name = this.last_symbol_value; // name is valid identifier

            // check if context name is available
            if (this.get_context_by_name(ident_name) != null) {
                this.error("Compilation failed because context with name: " + ident_name + ", already exists." + 
                        " Please ensure name: " + ident_name + " is unique.");
                return false;
            }

            let params = [];
            let var_obj;
            // optionally parameters
            // [ "(" ident [ : data_type ] {"," ident [ : data_type ]} ")" ]
            if (this.accept(Symbols.open_bra)) {
                // param can theorethically be flagged as constant and such as well - but not impelmented
                do {
                    if ((var_obj = this.load_ident_and_type()) === false) 
                        return false; // failed parsing 
    
                    var_obj.position = this.SB_DB_PC_RV + params.length;
                    var_obj.level = this.level_counter;
                    var_obj.is_param = true;
                    params.push(var_obj);
                    param_count++;
                } while (this.accept(Symbols.comma));
                
                // ;
                if (!this.accept(Symbols.close_bra)) {
                    this.error("Procedure paramater declaration must be closed by ')'");
                    return false;
                }
            }

            // ;
            if (!this.accept(Symbols.semicolon)) {
                this.error("Procedure (" + ident_name + ") header (declaration) must end with ';'");
                return false;
            }
            
            // block
            let current_context = this.push_context(ident_name, -1, return_type, this.level_counter, param_count);
            let block_start = 0;
            if ((block_start = this.block(params)) === false) {
                this.error("Failed to compile procedure (" + ident_name + ") body.");
                return false;
            }
            current_context.c_address = block_start;

            // decrease level counter because we are returning
            this.level_counter--;

            return true;
        },

        /**
         * Part of statement grammar: ident ":=" expression 
         * @returns true on success, false otherwise
         */
        statement_ident: function() {
            // simple version: ident := expression; // where ; is checked by caller
            // multiple assignments: ident := ident := ident := expression; // problem: ident can expression - how to determine when it ends?
            
            // TODO: need grammar improvement for multiple assignment and ternary operator to be expression

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

            let expr_type;
            if ((expr_type = this.expression()) === false) {
                this.error("Assignment must end with a valid expression.");
                return false;
            }

            if (variable.type != expr_type) {
                this.error("Assignment failed. Left and right side type mismatch. Cannot store: " + 
                    expr_type + "into: " + variable.type);
                return false;
            }

            // expecting that expression result is at the top of the stack
            push_instruction(Instructions.STO, Math.abs(variable.level - this.level_counter), variable.position);

            return true;
        },

        /**
         * Part of statement grammar: "{" ident {, ident} "} := {" value{, value} "}" 
         * @returns true on success, false otherwise
         */
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
            if (!this.accept(Symbols.close_curl)) {
                this.error("Multiple assignment statement expects '}' to close identifier list.");
                return false;
            }
            if (!this.accept(Symbols.assignment)) {
                this.error("Multiple assignment statement expects assignment symbol.");
                return false;
            }
            if (!this.accept(Symbols.open_curl)) {
                this.error("Multiple assignment statement expects '{' to open value list.");
                return false;
            }

            let i = 0;
            // value {, value}
            do {
                if (ident_counter <= 0) {
                    this.error("Too many values in parallel assignment!");
                    return false;
                }

                if (!this.accept(Symbols.input)) {
                    this.error("Invalid value. This value is a keyword or is otherwise invalid. Value: " + this.symbol_value);
                    return false;
                }

                if (this.validate_last_type_to_expected(vars[i].type) === false) {
                    this.error("Failed to validate value type. Variable type: " + vars[i].type + 
                               ", value type: " + symbol_input_type);
                    return false;
                }
                
                // only boolean needs to be pushed differently... atleast for now
                if (vars[i].type == Symbols_Input_Type.boolean)
                    push_instruction(Instructions.LIT, 0, this.get_boolean_as_int(this.last_symbol_value));
                else
                    push_instruction(Instructions.LIT, 0, this.last_symbol_value);

                push_instruction(Instructions.STO, vars[i].level, vars[i].position);

                ident_counter--;
                i++;
            } while (this.accept(Symbols.comma));

            if (ident_counter != 0) {
                this.error("Multiple assignment statement identifier count and value count do not match.");
                return false;
            }

            // }
            if (!this.accept(Symbols.close_curl)) {
                this.error("Multiple assignment statement expects '}' to close value list.");
                return false;
            }

            return true;
        },

        /**
         * Part of statement grammar: "call" ident ["(" expression {"," expression } ")"]
         * @returns true on success, false otherwise
         */
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

            let context = this.context_list[context_index];

            if (context.c_level > (this.level_counter + 1)) { // its inverse (nested context hash higher level)
                this.error("Cannoc call procedure: " + context.c_name + 
                           " because it cannot be found in current scope.");
                return false;
            }

            /*
                resolve parameters before call - should result in
                stack: 
                    procedure stuff
                    p1
                    p2
                    ...
                    new stack frame (call)
            */
            
            if (this.accept(Symbols.open_bra)) {
                let i = 0;

                do {
                    if(this.expression() === false) {
                        this.error("Failed to evaluate parameter expression.");
                        return false;
                    }

                    i++;
                    if (i > context.c_par_count) {
                        this.error("The call has more parameters then the procedure defines.");
                        return false;
                    }
                } while (this.accept(Symbols.comma));
                
                if (!this.accept(Symbols.close_bra)) {
                    this.error("Parameter list must be ended with ')'");
                    return false;
                }
            }

            // except for main - main is always index 0 and is first instruction of the program
            push_instruction(Instructions.CAL, 0, context_index);
            if (context.c_par_count > 0)
                push_instruction(Instructions.INT, 0, -context.c_par_count); // clear param values from stack after call finished45

            
            return context.c_return_type;
        },

        /**
         * Part of statement grammar: "?" ident
         * NOTE: does nothing. Its for some ancient action. Only kept to have backwards compatibility to PL/0.
         * @returns true on success, false otherwise
         */
        statement_quest_mark: function() {
            // ? verified by caller
            this.accept(Symbols.quest_mark)

            if (!this.accept(Symbols.ident)) {
                this.error("? expected valid identifier.");
                return false;
            }

            // TODO: what to do with this sh*t? We must have it, because it is original PL/0 grammar
            
            return true;
        },

        /**
         * Part of statement grammar: "!" expression
         * NOTE: does nothing. Its for some ancient action. Only kept to have backwards compatibility to PL/0.
         * @returns true on success, false otherwise
         */
        statement_excl_mark: function() {
            // ! verified by caller
            this.accept(Symbols.excl_mark);

            if (!this.expression()) {
                this.error("! doesn't end with valid expression.");
                return false;
            }

            // TODO: what to do with this sh*t? We must have it, because it is original PL/0 grammar
            
            return true;
        },

        /**
         * Part of statement grammar: "begin" statement {";" statement } "end" 
         * @returns true on success, false otherwise
         */
        statement_begin: function() {
            // begin verified by caller
            this.accept(Symbols.begin);
            
            let rv;
            // statement {";" statement}
            do {
                rv = this.statement();
                if (rv === false) {
                    this.error("Failed to process statement in command block.");
                    return false;
                }
            } while (rv !== 10);

            return true;
        },

        /**
         * Part of statement grammar: "if" condition_expression "then" statement [ "else" statement ]
         * @returns true on success, false otherwise
         */
        statement_if: function() {
            // if verified by caller
            this.accept(Symbols.if);

            if (!this.condition_expression()) {
                this.error("Failed to evaluate if condition.");
                return false;
            }

            push_instruction(Instructions.JMC, 0, 0);
            let jmp_to_else = instruction_list[instruction_list.length - 1];

            if (!this.accept(Symbols.then)) {
                this.error("if condition must be followed by 'then' before statement.");
                return false;
            }

            // this generates positive branch instractions
            if (!this.statement()) {
                this.error("Failed to compile positive branch statement.");
                return false;
            }

            // set where to jump, if the condition is false - "false" branch (aka: else)
            jmp_to_else.par2 = instruction_list.length;

            if (this.accept(Symbols.else)) {
                // jump over else branch, if "JMC" doesn't jump (aka: conditions is true)
                push_instruction(Instructions.JMP, 0, 0);
                let jmp_over_else = instruction_list[instruction_list.length - 1];

                jmp_to_else.par2++; // increment jmp_to_else because we added JMP instruction to "true" branch
                
                if (!this.statement()) {
                    this.error("Failed to compile negative branch statement.");
                    return false;
                }

                jmp_over_else.par2 = instruction_list.length;
            }

            return true;
        },

        /**
         * Part of statement grammar: "(" condition_expression ") ? " expression ":" expression
         * @returns true on success, false otherwise
         */
        statement_open_bra: function() {
            // ( verified by caller
            this.accept(Symbols.open_bra);

            this.ternary_return_flag = true;

            // condition
            if (!this.condition_expression()) {
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

            let ternary_branch_jmp = push_instruction_and_return(Instructions.JMC, 0, 0);

            if (!this.statement()) {
                this.error("First expression in the ternary operator failed to execute.");
                return false;
            }

            let jmp_over_negative = push_instruction_and_return(Instructions.JMP, 0, 0);
            ternary_branch_jmp.par2 = instruction_list.length;

            if (!this.accept(Symbols.colon)) {
                this.error("Expected ':' to separate ternary statements. Received: " + this.symbol_value);
                return false;
            }

            if (!this.statement()) {
                this.error("Second statement in the ternary operator failed to execute.");
                return false;
            }

            jmp_over_negative.par2 = instruction_list.length;

            this.ternary_return_flag = false;

            // register 3 (cell 4) is for any use - now primarily for return values
            // push_instruction(Instructions.STO, 0, 3);

            // what to do with RV now? this is a statement - how can we assing it

            return true;
        },

        /**
         * Part of statement grammar: "while" condition_expression "do" statement
         * @returns true on success, false otherwise
         */
        statement_while: function() {
            // while verified by caller
            this.accept(Symbols.while);

            let while_start_addr = instruction_list.length;

            if (!this.condition_expression()) {
                this.error("Failed to compile while condition.");
                return false;
            }

            push_instruction(Instructions.JMC, 0, 0);
            let while_end = instruction_list[instruction_list.length - 1];

            if (!this.accept(Symbols.do)) {
                this.error("Expected 'do' before while statement.");
                return false;
            }

            if (!this.statement()) {
                this.error("Failed to compile while statement.");
                return false;
            }

            push_instruction(Instructions.JMP, 0, while_start_addr);
            while_end.par2 = instruction_list.length;

            return true;
        },

        /**
         * Part of statement grammar: "for" expression "to" expression "do" statement
         * @returns true on success, false otherwise
         */
        statement_for: function() {
            // for verified by caller
            this.accept(Symbols.for);

            this.for_nest_counter++;
            if (this.for_nest_counter > this.for_var_count)
                this.for_var_count = this.for_nest_counter;

            // control variable position (must be -1)
            let cv_position = this.SB_DB_PC_RV + this.variables[this.variables.length - 1].length + 
                              this.for_nest_counter - 1;

            if (this.expression() != Symbols_Input_Type.integer) {
                this.error("Failed to parse starting point of for loop.");
                return false;
            }

            if (!this.accept(Symbols.to)) {
                this.error("For loop needs 'to' before second number.");
                return false;
            }

            if (this.expression() != Symbols_Input_Type.integer) {
                this.error("Failed to parse target point of for loop.");
                return false;
            }

            // === prepare control var
            push_instruction(Instructions.OPR, 0, 3); // expr1 - expr2 = iteration count
            push_instruction(Instructions.STO, 0, cv_position);
            push_instruction(Instructions.LOD, 0, cv_position);
            push_instruction(Instructions.LIT, 0, 0); // push 0 to top of the stack
            push_instruction(Instructions.OPR, 0, OPR.less_than); // test: it_count < 0
            let negate_cv_jump = push_instruction_and_return(Instructions.JMC, 0, 0); // expr2 - expr1 = iteration count
            push_instruction(Instructions.LOD, 0, cv_position);
            push_instruction(Instructions.OPR, 0, OPR.negation); // negate value (it_coutn) if its < 0 (making it positive)
            push_instruction(Instructions.STO, 0, cv_position);
            negate_cv_jump.par2 = instruction_list.length;

            // === for
            let for_start = instruction_list.length;
            push_instruction(Instructions.LOD, 0, cv_position);
            push_instruction(Instructions.LIT, 0, 1);
            push_instruction(Instructions.OPR, 0, OPR.subtraction);
            push_instruction(Instructions.STO, 0, cv_position);
            push_instruction(Instructions.LOD, 0, cv_position);
            push_instruction(Instructions.LIT, 0, 0);
            push_instruction(Instructions.OPR, 0, OPR.greater_than_equal); // doing equal for 1 more it. -> 3-8 = |5| not |4|
            let for_jump_instruction = push_instruction_and_return(Instructions.JMC, 0, 0);

            if (!this.accept(Symbols.do)) {
                this.error("Expected 'do' before for statement.");
                return false;
            }
            if (!this.statement()) {
                this.error("Failed to compile for statement.");
                return false;
            }

            push_instruction(Instructions.JMP, 0, for_start);
            for_jump_instruction.par2 = instruction_list.length;

            this.for_nest_counter--;

            return true;
        },

        /**
         * Part of statement grammar: "return" expression
         * @returns true on success, false otherwise
         */
        statement_return: function() {
            // return verified by caller
            this.accept(Symbols.return);

            if (!this.expression()) {
                this.error("Failed to evaluate expression of 'return' statement.")
                return false;
            }

            if (this.ternary_return_flag) {
                // if its ternary, save value to current context RV and push the value to stack
                // register 3 (cell 4) is for any use - now primarily for return values
                push_instruction(Instructions.STO, 0, 3);
                push_instruction(Instructions.LOD, 0, 3);
            } else {
                // if its not ternary, save value to caller RV and return
                // register 3 (cell 4) is for any use - now primarily for return values
                push_instruction(Instructions.STO, 1, 3);
                push_instruction(Instructions.RET, 0, 0);
            }

            return true;
        },

        /**
         * Part of statement grammar: "begin" statement {";" statement } "end" 
         * NOTE: must be separeted from "begin" to get it to work properly
         * @returns true on success, false otherwise
         */
        statement_end: function() {
            return this.accept(Symbols.end);
        }
    });
    return descent;
}) ();