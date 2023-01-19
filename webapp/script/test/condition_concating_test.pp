const a = 5, b = 5, c = 8, d = 5;
var res1, res2, res3, res4;

procedure negation;
    begin
        res1 := 0;
        (* false *)
        if ~ a = b 
            then res1 := res1 + 1;
        (* false *)
        if ~a = b 
            then res1 := res1 + 1;
        (* true *)
        if ~a = c
            then res1 := res1 + 1;

        (* expects res = 1 *)
    end;

procedure and;
    begin
        res2 := 0;
        (* true *)
        if a = b & b = d 
            then res2 := res2 + 1;
        (* false *)
        if a = b & ~b = d 
            then res2 := res2 + 1;
        (* false *)
        if ~a = b & b = d 
            then res2 := res2 + 1;
        (* true *)
        if a = b & ~b = c
            then res2 := res2 + 1;

        (* expects res = 2 *)
    end;

procedure or;
    begin
        res3 := 0;
        (* true *)
        if a = b | b = d 
            then res3 := res3 + 1;
        (* true *)
        if a = b | ~b = d 
            then res3 := res3 + 1;
        (* true *)
        if ~a = b | b = d 
            then res3 := res3 + 1;
        (* false *)
        if a = c | b = c
            then res3 := res3 + 1;

        (* expects res = 3 *)
    end;

procedure complex;
    begin
        res4 := 0;
        (* true *)
        if a = b & b = d & ~b = c | c = d
            then res4 := res4 + 1;
        (* true *)
        if a = c & b = c | ~c = d
            then res4 := res4 + 1;
        (* false *)
        if a = c & b = c | c = d
            then res4 := res4 + 1;

        (* expects res = 2 *)
    end;

begin
    call negation;
    call and;
    call or;
    call complex;
end.