(*
This example is happy day for following features

3. **integer** variable and constant (whole number) (not sure if this isn't basically done by the language itself)
4. **assignments** defined in original PL/0
5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** 
6. **loops** - one is compulsory. Other loop types are for bonus points. For now lets try **for, while, foreach (if we will have arrays)**
7. **simple condition** without
8. **subprogram definition** function/ procedure and its call
9. bonus (1pt): **else**
10. bonus (1pt): **other loop types**
11. bonus (1pt): **boolean and related operation**
12. bonus (1pt): **data type: real (with integer functionality) - aka. floating point**
13. bonus (1pt): **string with concat operator**
TODO: 14. bonus (1pt): **switch** (we dont have switch for now)
15. bonus (1pt): **multiple assignment** - "a = b = c = d = 3"
16. bonus (1pt): **ternary operator** - " (a < b) ? a : b;"
17. bonus (1pt): **parallel assignment** - "{a, b, c, d} = {1, 2, 3, 4}"
18. bonus (2pt): **string comparison operator**
19. bonus (2pt): **subprogram parameters by value**
20. bonus (2pt): **subprogram return value**
*)

(* constants *)
const hello_c = "hello", world_c = "world", num_c : integer = 57; 

(* variables - x is assumed to be integer *)
var x, y: integer, z: float, w: string;

(* procedures *)    
procedure does_nothing:
    const nothing_constant = 5;
    var a, b;
    begin
        if odd a then b := a;
        else a := b;
        
        if nothing_constant != 5 then
        begin
            a := b := nothing_constant;
        end;
    end;

procedure takes_params(i1, f1, a1):
    var a, b: float , c: string;
    begin
        a := i1;
        b := f1;
        c := a1;
    end;

procedure integer addition(num1, num2: integer):
    return num1 + num2;

procedure test_operators:
    const a: integer = 5, b: integer = 4;
    var control, tmp;
    begin
        control := 0;
        (* 5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** *)
        if 5 == 5 then control := control + 1;
        if 5 <= 5 then control := control + 1;
        if 4 <= 5 then control := control + 1;
        if 5 < 5 then control := control + 1; (* false *)
        if 4 < 5 then control := control + 1;
        if 5 > 5 then control := control + 1; (* false *)
        if 6 > 5 then control := control + 1;
        if 5 >= 5 then control := control + 1;
        if 6 >= 5 then control := control + 1;

        tmp := a + b;
        if tmp == 9 then control := control + 1;
        tmp := a - b;
        if tmp == 1 then control := control + 1;
        tmp := a * b;
        if tmp == 20 then control := control + 1;
        tmp := a / b; (* TODO: define this behaviour *)
        if tmp == 1 then control := control + 1;

        tmp := a & b;
        if tmp == 4 then control := control + 1;
        tmp := a | b;
        if tmp == 5 then control := control + 1;
        tmp := a ^ b;
        if tmp == 4 then control := control + 1;

        (* control should be 14 at this point - if all features work correctly *)
    end;

procedure test_loops:
    var wi, fi;
    begin
        wi := 0; fi := 0;
        while wi < 10 do
            wi := wi + 2;
        for 5 to 10 do
            fi := fi + 5;
        
        (* wi should be 10, fi whould be 25 *)
    end;

procedure test_boolean:
    var b: boolean, control;
    begin
        b := true; control := 0;
        if b then control := control + 1;
        if b == true 
            then b := false;
            else b := true;
        if b == true 
            then b := false;
            else b := true;
    end;

procedure test_floats:
    const a = 5.1, b = 3.7;
    var control, tmp: float;
    begin
        control := 0;
        (* 5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** *)
        if 5.5 == 5.5 then control := control + 1;
        if 5.8 <= 5.8 then control := control + 1;
        if 4.1 <= 4.11 then control := control + 1;
        if 5.1 < 5.1 then control := control + 1; (* false *)
        if 4.1 < 4.11 then control := control + 1;
        if 5.1 > 5.1 then control := control + 1; (* false *)
        if 5.11 > 5.1 then control := control + 1;
        if 5.11 >= 5.11 then control := control + 1;
        if 5.11 >= 5.05 then control := control + 1;

        tmp := a + b;
        if tmp == 8.8 then control := control + 1;
        tmp := a - b;
        if tmp == 1.4 then control := control + 1;
        tmp := a * b;
        if tmp == 18.87 then control := control + 1;
        tmp := a / b; (* TODO: define this behaviour *)
        if tmp == 1.3783783783783783 then control := control + 1;

        (* UNSUPPORTED FOR FLOAT!!!!! *)
        // tmp := a & b;
        // if tmp == 4 then control := control + 1;
        // tmp := a | b;
        // if tmp == 5 then control := control + 1;
        // tmp := a ^ b;
        // if tmp == 4 then control := control + 1;

        (* control should be 11 at this point - if all features work correctly *)
    end;

procedure test_assignments:
    var a, b, c;
    begin
        a := b := c := 5;
        (* a, b, c should be 5 now *)
        {a, b, c} = {1, 2, 3}
        (* a should be 1, b should be 2, c should be 3 *)
    end;

procedure test_additional_comparisons:
    const a = "test", b = "test", x = 5, y 5;
    var control;
    begin
        control := 0;
        (* string comparison *)
        if a == b then control := control + 1;
        (* ternary operator *)
        (x == y) ? control := control + 10; : control := control + 20;

        (* control should be 21 *)
    end;

(* main *)
begin
    z := 5;
    y := 1;
    w := "Hello, ";
    w := w + "World!";

    call test_operators;
    call test_loops;
    call test_boolean;
    call test_floats;
    call does_nothing;
    call takes_params(5555, z, w);
    x := call addition(y, num_c);
end.