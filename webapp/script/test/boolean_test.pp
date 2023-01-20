const t: boolean = true, tt: boolean = true, f: boolean = false, ff: boolean = false;
var res0p, res0n, res1, res2, res3, res4;

procedure ineqAndEq;
    begin
        if t = t    then res0p := res0p + 1;
        if t = tt   then res0p := res0p + 10;
        if t = f    then res0p := res0p + 100;
        if t = true then res0p := res0p + 1000;

        if f = f     then res0p := res0p + 1;
        if f = ff    then res0p := res0p + 10;
        if f = t     then res0p := res0p + 100;
        if f = false then res0p := res0p + 1000;

        if true  = true  then res0p := res0p + 10000;
        if false = false then res0p := res0p + 10000;
        if true  = false then res0p := res0p + 10000;
        if false = true  then res0p := res0p + 10000;

        if t # t    then res0n := res0n + 1;
        if t # tt   then res0n := res0n + 10;
        if t # f    then res0n := res0n + 100;
        if t # true then res0n := res0n + 1000;

        if f # f     then res0n := res0n + 1;
        if f # ff    then res0n := res0n + 10;
        if f # t     then res0n := res0n + 100;
        if f # false then res0n := res0n + 1000;

        if true  # true  then res0n := res0n + 10000;
        if false # false then res0n := res0n + 10000;
        if true  # false then res0n := res0n + 10000;
        if false # true  then res0n := res0n + 10000;

        (* expected p = 22022, n = 20200 *)
    end;

procedure negation;
    var tmp: boolean;
    begin
        tmp := ~f;
        if tmp = true then res1 := res1 + 1;
        tmp := ~t;
        if tmp = true then res1 := res1 + 10;

        (* expected result 1 *)
    end;

procedure and;
    var tmp: boolean;
    begin
        tmp := t & t;
        if tmp = true then res2 := res2 + 1;
        tmp := t & f;
        if tmp = true then res2 := res2 + 10;
        tmp := f & f;
        if tmp = true then res2 := res2 + 100;
        tmp := f & t;
        if tmp = true then res2 := res2 + 1000;
        tmp := t & ~f;
        if tmp = true then res2 := res2 + 10000;

        (* expected result 10001 *)
    end;

procedure or;
    var tmp: boolean;
    begin
        tmp := t | t;
        if tmp = true then res3 := res3 + 1;
        tmp := t | f;
        if tmp = true then res3 := res3 + 10;
        tmp := f | f;
        if tmp = true then res3 := res3 + 100;
        tmp := f | t;
        if tmp = true then res3 := res3 + 1000;
        tmp := t | ~f;
        if tmp = true then res3 := res3 + 10000;
        tmp := ~t | f;
        if tmp = true then res3 := res3 + 100000;

        (* expected result 011011 *)
    end;

procedure complex;
    begin
        if t | f & f | f = true then res4 := res4 + 1;
        if t | f & ~(f | f) = true then res4 := res4 + 10;
        if t | f & ~(f | f) & tt | ff = true then res4 := res4 + 100;

        (* expected result 110 *)
    end;

begin
    call ineqAndEq;
    call negation;
    call and;
    call or;
    call complex;
end.