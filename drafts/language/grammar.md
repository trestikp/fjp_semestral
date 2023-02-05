# Grammar draft
## This compiler must be backwards-compatible to original PL/0 language syntax! 
- this is additional requirement for us (wanting to create JS compiler to go with already existing JS debugger)
- [PL/0 Wiki](https://en.wikipedia.org/wiki/PL/0)  
- PL/0 grammar in EBNF (Extended Backus-Naur Form)  
```
program = block "." ;

block = [ "const" ident "=" number {"," ident "=" number} ";"]
        [ "var" ident {"," ident} ";"]
        { "procedure" ident ";" block ";" } statement ;

statement = [ ident ":=" expression 
              | "call" ident 
              | "?" ident 
              | "!" expression 
              | "begin" statement {";" statement } "end" 
              | "if" condition "then" statement 
              | "while" condition "do" statement ];

condition = "odd" expression |
            expression ("="|"#"|"<"|"<="|">"|">=") expression ;

expression = [ "+"|"-"] term { ("+"|"-") term};

term = factor {("*"|"/") factor};

factor = ident | number | "(" expression ")";
```
## Extended Backus-Naur Form
- https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form
- [ ... ] - optional - 0 or 1
- { ... } - "optional" repetition - 0 or ***n*** times
## Available instructions
- debugger source: https://home.zcu.cz/~lipka/fjp/pl0/
- compiled program should be able to run in this debugger (possibly add integration from created compiler to this debugger)
<table class="table"><thead><tr><th style="width: 35px;"></th><th style="width: 50px;">Instruction</th><th style="width: 35px;">Level</th><th style="width: 35px;">Par</th><th>Explanation</th></tr></thead><tbody><tr><td></td><td>LIT</td><td>0</td><td>value</td><td>Pushes value to the top of the stack</td></tr><tr><td></td><td>INT</td><td>0</td><td>value</td><td>Increases or decreases the stack pointer. Increasing beyond already generated stack creates 0s. Cannot decrease stack pointer under the current stack frame or under -1.</td></tr><tr><td></td><td>OPR</td><td>0</td><td>operation</td><td>Performs operation (logic or arithmetic). The instruction behaves just like the referece interpreter (operations 1 - 13). If the operation uses two values from stack, the first value is the one with the lower index and the second value is the one on top of the stack.</td></tr><tr><td></td><td>JMP</td><td>0</td><td>address</td><td>Jumps to the instruction specified by address. If the jump would end up on a non-existent instruction, an exception is thrown.</td></tr><tr><td></td><td>JMC</td><td>0</td><td>address</td><td>If there is 0 on the top of the stack, jumps to the instruction specified by the address. If the jump would end up on a non-existent instruction, an exception is thrown.</td></tr><tr><td></td><td>LOD</td><td>level</td><td>address</td><td>Loads a value from level, address on the stack and pushes it into the stack. If the level is too high (the target stack frame would end up under the first stack frame) an exception is thrown.</td></tr><tr><td></td><td>STO</td><td>level</td><td>address</td><td>Stores the value on top of the stack to level, address on stack. If the level is too high (the target stack frame would end up under the first stack frame) an exception is thrown.</td></tr><tr><td></td><td>CAL</td><td>level</td><td>address</td><td><p>Creates a new stack frame with static base (SB) at relative index 0, dynamic base (DB) at relative index 1 and program counter at relative index 2 (PC).</p><p>The static base is set levels down, so when the level is 0, the static base is set as the caller's current base, and when the level is 1 the static base is set as the current caller's static base. Otherwise, the static base is resolved by iterating over the static bases of the stack frames under the caller.</p><p>The dynamic base is set as the caller's current base. The program counter is set as the next instruction to be executed (PC + 1).</p><p>Then a jump is made to the instruction specified by address. The stack pointer has to be increased trough the INT instruction (same as the reference interpreter).</p></td></tr><tr><td></td><td>RET</td><td>0</td><td>0</td><td><p>Sets the program counter (PC) to the value stored on the stack frame's index 2. Sets the stack pointer to current base - 1 (the top of previous stack frame). Sets the current base to the dynamic base (DB) stored on the stack frame's index 1.</p><p>If the instruction is executed while the current base is 0 (aka the first stack frame), the program exits.</p></td></tr><tr><td></td><td>REA</td><td>0</td><td>0</td><td><p>Reads one character from the input field, converts is to a number and pushes it into the stack. The character is expected to be ASCII (or Extended ASCII, simply 8 bit value). If there is no character in the input field or the character is not Extended ASCII character, an exception is thrown.</p></td></tr><tr><td></td><td>WRI</td><td>0</td><td>0</td><td><p>Writes the value from the top of the stack into the output field as a character. If the value is not in range &lt;0, 255&gt;, an exception is thrown.</p></td></tr><tr><td></td><td>NEW</td><td>0</td><td>0</td><td><p>Takes the value on top of the stack as the number of heap cells to allocate. Allocates that many cells continuously (in one continuous block) and pushes the address of the block onto the stack. If the cells cannot be allocated, -1 is pushed onto the stack (e.g. not enough free cells, invalid value).</p></td></tr><tr><td></td><td>DEL</td><td>0</td><td>0</td><td><p>Takes the value on top of the stack as the address of the heap block to deallocate. The heap block is deallocated in its entirety. On failure throws an exception.</p></td></tr><tr><td></td><td>LDA</td><td>0</td><td>0</td><td><p>Takes the value on top of the stack as the address of the heap cell. Pushes the value in the heap cell onto the stack. Throws an exception on failure.</p></td></tr><tr><td></td><td>STA</td><td>0</td><td>0</td><td><p>Takes the value on top of the stack as the value to store and the value under it (SP - 1) as the address to store it at. Stores the value at the address in heap. On failure throws an exception.</p></td></tr><tr><td></td><td>PLD</td><td>0</td><td>0</td><td><p>Essentially a dynamic LOD, where the level is the value on top of the stack and the address the value under it (SP - 1). Pushes the value on level, address of the stack onto the stack.</p></td></tr><tr><td></td><td>PST</td><td>0</td><td>0</td><td><p>Essentially a dynamic STO, where the level is the value on top of the stack, the address the value under it (SP - 1) and the value to be stored is on the index SP - 2. Stores the value into level, address of the stack.</p></td></tr></tbody></table>

## Grammar for this project
- expression can be a result of "call" ident, but ident must have a return
- TODO: determine procedure return type
- statement = ident and factor = ident are creating a collision, that has to be handled
```
    program = block "." ;

    block = [ "const" ident [":" data_type] "=" value {"," ident [":" data_type] "=" value} ";"]
            [ "var" ident [":" data_type] {"," ident [":" data_type]} ";"]
            { "procedure" ident [ "(" ident [ : data_type ] {"," ident [ : data_type ]} ")" ] ";" block ";" } statement ;

                (* assignment with possibility of multiple assignment *)
    statement = [ ident ":=" {ident ":="} expression 
                    (* parallel assignment - number of values must match number of idents *)
                  | "{" ident {, ident} "} := {" value{, value} "}" 
                    (* call to a procedure - reads expected number of parameters from stack. Return value is saved to stack. *)
                  | "call" ident
                    (* no idea what this does *)
                  | "?" ident
                    (* negation? - or no idea *)
                  | "!" expression 
                    (* "block" of statements - allows multiple statements in place of one *)
                  | "begin" statement {";" statement } "end" 
                    (* if (+if-else) *)
                  | "if" condition "then" statement [ "else" statement ]
                    (* ternary operator *)
                  | "(" condition ") ? " "return" statement ":" "return" statement
                    (* while loop *)
                  | "while" condition "do" statement
                    (* simple for loop with step of 1 *)
                  | "for" number "to" number "do" statement
                    (* for-each loop *)
                  | "foreach" ident "in" array_ident "do" statement ]
                    (* procedure (and statement) return - end of procedure (statement) *)
                  | "return" value;

    condition = "odd" expression |
                expression ("="|"#"|"<"|"<="|">"|">=") expression ;

    expression = [ "+"|"-"] term { ("+"|"-") term};

    term = factor {("*"|"/") factor};

    factor = ident | number | value | "(" expression ")";
```
## Grammar fixed up (fixes for errors discovered during implementation) - final version
```
    program = block "." ;

    block = [ "const" ident [":" data_type] "=" value {"," ident [":" data_type] "=" value} ";"]
            [ "var" ident [":" data_type] {"," ident [":" data_type]} ";"]
            { "procedure" [data_type] ident [ "(" ident [ : data_type ] {"," ident [ : data_type ]} ")" ] ";" block ";" } statement ;

    statement = [ ident ":=" expression 
                  | "{" ident {, ident} "} := {" value{, value} "}" 
                  | "call" ident ["(" expression {"," expression } ")"]
                  | "?" ident
                  | "!" expression 
                  | "begin" statement {";" statement } "end" 
                  | "if" condition_expression "then" statement [ "else" statement ]
                  | "(" condition_expression ") ? " statement ":" statement
                  | "while" condition_expression "do" statement
                  | "for" expression "to" expression "do" statement
                  | "return" expression ];

    condition_expression = ["~"] condition { ("&"|"|") ["~"] condition } ;

    condition = "odd" expression |
                expression ("="|"#"|"<"|"<="|">"|">=") expression ;

    expression = ["+"|"-"] term {("+"|"-") term} | "call" ident;

    term = ["~"] factor { ("*"|"/"|"&"|"|") ["~"] factor};

    factor = ident | value | "(" expression ")";
```
