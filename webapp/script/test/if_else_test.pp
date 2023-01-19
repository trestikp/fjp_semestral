var res;

begin
    res := 0;

    (* +1 *)
    if 1 = 1 then res := res + 1;
             else res := res + 1000;
    (* +1000 *)
    if 1 # 1 then res := res + 1;
             else res := res + 1000;
    (* +1000 *)
    if 1 < 1 then res := res + 1;
             else res := res + 1000;
    (* +1 *)
    if 1 <= 1 then res := res + 1;
             else res := res + 1000;
    (* +1000 *)
    if 1 > 1 then res := res + 1;
             else res := res + 1000;
    (* +1 *)
    if 1 >= 1 then res := res + 1;
             else res := res + 1000;

    if odd 1 then res := res + 1;
             else res := res + 1000;

    (* expected res value: 3004*)
end.