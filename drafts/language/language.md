#  Language draft and requirements
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
6. **loops** - one is compulsory. Other loop types are for bonus points. For now lets do **for, while, foreach**
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
  
### Code example (hopefully including most features)  
```pascal  
const global_2 : string;  
var global_1 : integer;  
  
procedure max(num1, num2 : integer) : integer;  
var proc_only_1 : integer;  
begin  
  if num1 > num2 then  
	  begin
			proc_only_1 := num1;  
			return proc_only_1;  
		end;  
  else  
		begin  
			proc_only_1 := num2;  
			return proc_only_1;  
		end;  
	end;  
end;  
  
procedure recursion(letter : string);  
begin  
if letter === 'f' then return;  
else  
  
begin  
  
end.  
```
