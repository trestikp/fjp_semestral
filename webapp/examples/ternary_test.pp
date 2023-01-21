var res;

begin
    (1 < 2) ? begin res := 5; return res; end; : begin res := 8; return res; end;;
end.