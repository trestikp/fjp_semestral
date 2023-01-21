const a1 = 5;
var resFloat1: float, resInt1, resInt2, resNestInt;

procedure test;
    begin
        (* doesnt do anything - it just must compile and run *)
    end;

procedure float returnTest;
    (* only returns 2.5 - must compile and run *)
    return 2.5;

procedure paramSimpleTest(p1, p2: float, p3: boolean);
    const c = 50;
    var notC;
    begin
        notC := 2;
        if p3 = true then return c + notC + p1;
              else return c - notC - p1;
    end;

procedure integer paramReturnTest(p1, p2: float, p3: boolean);
    const c = 20;
    var notC;
    begin
        notC := 5;
        if p3 = true then return c + notC + p1;
              else return c - notC - p1;
    end;

procedure integer nestTest(p1);
    const c = 5;
    var tripleA;
    
    procedure integer innerNestTest(innerP);
        const d = 3;
        var res;
        begin
            res := a1 + c + d + innerP; (* 5 + 3 + 5 + innerP *)
            return res;
        end;

    begin
        tripleA := call innerNestTest(p1);
        return tripleA;
    end;

begin
    call test;
    resFloat1 := call returnTest;
    call paramSimpleTest(a1, 2.8, true);
    resInt1 := call paramReturnTest(a1, 3.0, true); (* Int1 = 30 *)
    resInt2 := call paramReturnTest(a1, 3.0, false); (* Int2 = 10 *)
    resNestInt := call nestTest(17); (* 30 *)
    (* resFail := call innerNestTest(7); // 20 - but shouldn't compile because its out of scope! this is a negative test *)
end.