const upper = 8;
var res1, res2, res3, res4;

procedure testWhile;
    var i;
    begin
        i := 0;
        while i < upper do
            i := i + 1;
        res1 := i;

        (* expected result: 8 *)
    end;

procedure testFor;
    var i;
    begin
        i := 0;
        (* |3 - 8| *)
        for 3 to upper do
            i := i + 1;
        res2 := i;

        i := 0;
        
        for upper to 3 do
            i := i + 1;
        res2 := res2 + i;

        (* expected result: |3 - 8| * 2 = 10 *)
    end;

procedure testWhileNested;
    var i1, i2;
    begin
        res3 := 0;
        i1 := 0;
        
        while i1 < 3 do
        begin
            i2 := 0;
            
            while i2 <= 3 do
            begin
                i2 := i2 + 1;
                res3 := res3 + 1;
            end;
            
            i1 := i1 + 1;
        end;

        (* expected result: 3 * 4 = 12 *)
    end;

procedure testForNested;
    begin
        res4 := 0;

        (* |0 - 3| = 3 *)
        for 0 to 3 do
            for 0 to 4 do
                for 0 to 2 do
                    res4 := res4 + 1;

        (* expected result: 3 * 4 * 2 = 24 *)
    end;

begin
    call testWhile;
    call testFor;
    call testWhileNested;
    call testForNested;

    (* Expects 8 in res1, 10 in res2, 12 in res3, 24 in res4 *)
end.
