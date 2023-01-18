(* all procedures called and gave expected results *)
const t = 10, f = 5;
var a, b;

procedure plus;
    var x;
    begin
        x := 5;
        a := x + t; (* 15 in a *)
        b := x + 3; (* 8 in b*)
    end;

procedure minus;
    var x;
    begin
        x := 5;
        a := x - t; (* -5 in a *)
        b := x - 3; (* 2 in b *)
    end;

procedure mult;
    var x;
    begin
        x := 5;
        a := x * f; (* 25 in a *)
        b := x * 3; (* 15 in b *)
    end;

procedure div;
    var x;
    begin
        x := 5;
        a := x / f; (* 1 in a *)
        b := x / 3; (* 1 in b *)
    end;

begin
    call plus;
    call minus;
    call mult;
    call div;
end.