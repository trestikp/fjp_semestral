const a = 5, b = 2;
var res, res2;

begin
    res  := 0;
    res2 := 0;

    if a =  5  then res := res + 1;  (* true     *)
    if a <  5  then res := res + 1;  (* false    *)
    if a >  5  then res := res + 1;  (* false    *)
    if a <= 5  then res := res + 1;  (* true     *)
    if a >= 5  then res := res + 1;  (* true     *)
    if a #  5  then res := res + 1;  (* false    *)
    if a # -1  then res := res + 1;  (* true     *)

    if a =  b then res2 := res2 + 1; (* false    *)
    if a <  b then res2 := res2 + 1; (* false    *)
    if a >  b then res2 := res2 + 1; (* true     *)
    if a <= b then res2 := res2 + 1; (* false    *)
    if a >= b then res2 := res2 + 1; (* true     *)
    if a #  b then res2 := res2 + 1; (* true     *)

    (* at the end res = 4, res2 = 3 *)
end.