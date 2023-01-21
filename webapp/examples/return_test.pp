var res;

procedure integer onePlusOne;
    begin
        return 1+1;
    end;

procedure assignOnePlusOne;
    begin
        res := call onePlusOne;
    end;

begin
    call assignOnePlusOne;
end.