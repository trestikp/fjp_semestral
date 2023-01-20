const a1 = 5;
var resFloat1: float;

procedure test;
    begin
    end;

procedure float returnTest;
    return 2.5;

procedure paramSimpleTest(p1, p2: float, p3: boolean);
    begin
    end;

begin
    call test;
    resFloat1 := call returnTest;
    call paramSimpleTest(a1, 2.8, true);
end.