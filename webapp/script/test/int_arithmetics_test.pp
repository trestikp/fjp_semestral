(* all procedures called and gave expected results *)
const t = 10, f = 5;
var res1a, res1b, res2a, res2b, res3a, res3b, res4a, res4b;

procedure plus;
    var x;
    begin
        x := 5;
        res1a := x + t; (* 15 in a *)
        res1b := x + 3; (* 8 in b*)
    end;

procedure minus;
    var x;
    begin
        x := 5;
        res2a := x - t; (* -5 in a *)
        res2b := x - 3; (* 2 in b *)
    end;

procedure mult;
    var x;
    begin
        x := 5;
        res3a := x * f; (* 25 in a *)
        res3b := x * 3; (* 15 in b *)
    end;

procedure div;
    var x;
    begin
        x := 5;
        res4a := x / f; (* 1 in a *)
        res4b := x / 3; (* 1 in b *)
    end;

begin
    call plus;
    call minus;
    call mult;
    call div;
end.