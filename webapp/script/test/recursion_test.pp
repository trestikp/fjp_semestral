var i;

procedure callMe;
    begin
        i := i - 1;
        if i > 0 then call callMe;
    end;

begin
    i := 5;
    call callMe;

    (* recursion DOES NOT WORK!!! - expected *)
end.