# This compiler must be backwards-compatible to original PL/0 language syntax!
[PL/0 Wiki](https://en.wikipedia.org/wiki/PL/0)
PL/0 Gramatika v EBNF (Extended Backus-Naur Form)
```
program = blok "." .

blok = [ "const" ident "=" číslo {"," ident "=" číslo} ";"]
       [ "var" ident {"," ident} ";"]
       { "procedure" ident ";" blok ";" } příkaz .

příkaz = [ ident ":=" výraz | "call" ident 
           | "?" ident | "!" výraz 
           | "begin" příkaz {";" příkaz } "end" 
           | "if" podmínka "then" příkaz 
           | "while" podmínka "do" příkaz ].

podmínka = "odd" výraz |
           výraz ("="|"#"|"<"|"<="|">"|">=") výraz .

výraz = [ "+"|"-"] term { ("+"|"-") term}.

term = faktor {("*"|"/") faktor}.

faktor = ident | číslo | "(" výraz ")".
```
#### programs ends with '.' (a_lot_of_meaningful_code.)
#### all "command" code must be wrapped between **begin** and **end** (including main block)


### code example (hopefully including all features)
```pascal
const global_2 : string;
var global_1 : integer;

procedure max(num1, num2 : integer) : integer;
  var proc_only_1 : integer;
  begin
    if num1 > num2  then
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
