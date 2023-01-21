(* last case in div fails. Note: all variables must have type 'float' specified, 
   because by default variables are integer. All values must have decimal point specified, 
   otherwise they are considered as integers. 
*)
const t: float = 1.000, f: float = 0.0001;
var a: float, b: float;

procedure plus;
    var x: float;
    begin
        x := 0.01;
        a := x + t; (* 1.01 in a *)
        a := x + t + f; (* 1.0101 in a *)
        b := x + 3.0; (* 3.01 in b*)
    end;

procedure minus;
    var x: float;
    begin
        x := 0.01;
        a := t - x; (* 0.99 in a *)
        b := x - 3.0; (* -2.99 in b *)
    end;

procedure mult;
    var x: float;
    begin
        x := 0.5;
        a := x * t; (* 0.5 in a *)
        b := x * 3.0; (* 1.5 in b *)
    end;

procedure div;
    var x: float;
    begin
        x := 1.0;
        a := x / f; (* 10000 in a *)
        b := x / 3.0; (* 0.333 in b TODO: this results in 0 *)
    end;

begin
    call plus;
    call minus;
    call mult;
    call div;
end.