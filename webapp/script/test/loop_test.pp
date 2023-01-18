const upper = 8;
var res1, res2;

procedure testWhile;
    var i;
    begin
        i := 0;
        while i < upper do
            i := i + 1;
        res1 := i;
    end;

procedure testFor;
    var i;
    begin
        i := 0;
        for 3 to upper do
            i := i + 1;
        res2 := i;
    end;

begin
    (* call testWhile; *)
    call testFor;

    (* Expects 8 in res1 and 5 in res2 *)
end.
