# Language draft and requirements
1. This compiler must be backwards-compatible to original PL/0 language syntax! 
- this is additional requirement for us (wanting to create JS compiler to go with already existing JS debugger)
- [PL/0 Wiki](https://en.wikipedia.org/wiki/PL/0)  
- PL/0 grammar in EBNF (Extended Backus-Naur Form)  
```
	program = block "." ;

	block = [ "const" ident "=" number {"," ident "=" number} ";"]
	        [ "var" ident {"," ident} ";"]
	        { "procedure" ident ";" block ";" } statement ;

	statement = [ ident ":=" expression | "call" ident 
	              | "?" ident | "!" expression 
	              | "begin" statement {";" statement } "end" 
	              | "if" condition "then" statement 
	              | "while" condition "do" statement ];

	condition = "odd" expression |
	            expression ("="|"#"|"<"|"<="|">"|">=") expression ;

	expression = [ "+"|"-"] term { ("+"|"-") term};

	term = factor {("*"|"/") factor};

	factor = ident | number | "(" expression ")";
```
3. **integer** variable and constant (whole number) (not sure if this isn't basically done by the language itself)
4.  **assignments** defined in original PL/0
5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** 
6. **loops** - one is compulsory. Other loop types are for bonus points. For now lets try **for, while, foreach (if we will have arrays)**
7. **simple condition** without
8. **subprogram definition** function/ procedure and its call
9. bonus (1pt): **else**
10. bonus (1pt): **other loop types**
11. bonus (1pt): **boolean and related operation**
12. bonus (1pt): **data type: real (with integer functionality) - aka. floating point**
13. bonus (1pt): **string with concat operator**
14. bonus (1pt): **switch**
15. bonus (1pt): **multiple assignment** - "a = b = c = d = 3"
16. bonus (1pt): **ternary operator** - " (a < b) ? a : b;"
17. bonus (1pt): **parallel assignment** - "{a, b, c, d} = {1, 2, 3, 4}"
18. bonus (2pt): **string comparison operator**
19. bonus (2pt): **subprogram parameters by value**
20. bonus (2pt): **subprogram return value**
21. maybe bonus (2pt): **array and related operations**

Required points: 20. Points: 10 (basic required implementation) + 8 (1pt extensions) + 8 (2pt extensions) = 26 pts
This is not including any GUI points.
  
### Code examples (no coherent program, examples of possible structures)
```pascal
(* constants *)
const global_2 : string = "value";
(* variables *)
var global_1 : integer,
(* 
  variable withotu specified type - integer by default?
  notice: var was only said once, and global_2 is separated from global_1 by ','
*)
global_2;

(* 
  procedure ("function") declaration
    + parameters with type 
    + expected return value type
*)
procedure max(num1, num2 : integer) : integer;
  (* procedure local variables and constants *)
  const p1_const;
  var p1_var;
  (* procedure statement block *)
  begin
  end;

(* simple if statement *)
if num1 > num2 then
  call do_something;

(* if statement with else *)
if num1 > num2 then
  (* if statement block (required for multiple statements) *)
  begin
    statement_1;
    statement_2;
    call do_something;
  end;
else
  (* else statement block (required for multiple statements) *)
  begin
    call do_else;
  end;

(* recursion should be possible *)
procedure recursion(num : integer);
  begin
    if num <= 0 then 
	  return;
    else
      call recursion(num - 1);
  end;

(* for loop - only steps by one from start to end (do we want to have custom step?) *)
for 0 to 10 do
  (* statement block (required for multiple statements) *)
  begin
    statements;
  end;

(* while loop - condition should be same as in if *)
while condition do
  (* statement block (required for multiple statements) *)
  begin
    statements;
  end;

(* boolean variable *)
var bool_test : boolean;

(* float variable *)
var float_test : float;

(* string variable *)
var string_test : string;

(* string concat operations *)
string_test := string_test + "second_string";

(* switch statement *)
case expression of
  value_1: statements;
  value_2: begin
             statements;
		   end;
end; (* end of switch *)

(* main program block *)
begin
  statements;
end.

(* 
  OPTIONAL - MAYBE WILL NOT BE IMPLEMENTED

  array
    syntax: array-identifier = array[index-type] of element-type;
*)
arr = array [0..10] of integer;

(* 
  OPTIONAL - MAYBE WILL NOT BE IMPLEMENTED

  for-each loop - for each element in array "arr"
  -- only meaningful if arrays will be implemented!!! 
*)
foreach arr do
  (* statement block (required for multiple statements) *)
  begin
    statements;
  end;
```
