(function ($) {
    let Examples = {};

    /**
     * List of example codes that might be loaded from the UI
     */
    let ExampleOptions = {
        "Boolean": 'const t: boolean = true, tt: boolean = true, f: boolean = false, ff: boolean = false;\nvar res0p, res0n, res1, res2, res3, res4;\n\nprocedure ineqAndEq;\n\tbegin\n\t\tif t = t\tthen res0p := res0p + 1;\n\t\tif t = tt   then res0p := res0p + 10;\n\t\tif t = f\tthen res0p := res0p + 100;\n\t\tif t = true then res0p := res0p + 1000;\n\n\t\tif f = f\t then res0p := res0p + 1;\n\t\tif f = ff\tthen res0p := res0p + 10;\n\t\tif f = t\t then res0p := res0p + 100;\n\t\tif f = false then res0p := res0p + 1000;\n\n\t\tif true  = true  then res0p := res0p + 10000;\n\t\tif false = false then res0p := res0p + 10000;\n\t\tif true  = false then res0p := res0p + 10000;\n\t\tif false = true  then res0p := res0p + 10000;\n\n\t\tif t # t\tthen res0n := res0n + 1;\n\t\tif t # tt   then res0n := res0n + 10;\n\t\tif t # f\tthen res0n := res0n + 100;\n\t\tif t # true then res0n := res0n + 1000;\n\n\t\tif f # f\t then res0n := res0n + 1;\n\t\tif f # ff\tthen res0n := res0n + 10;\n\t\tif f # t\t then res0n := res0n + 100;\n\t\tif f # false then res0n := res0n + 1000;\n\n\t\tif true  # true  then res0n := res0n + 10000;\n\t\tif false # false then res0n := res0n + 10000;\n\t\tif true  # false then res0n := res0n + 10000;\n\t\tif false # true  then res0n := res0n + 10000;\n\n\t\t(* expected p = 22022, n = 20200 *)\n\tend;\n\nprocedure negation;\n\tvar tmp: boolean;\n\tbegin\n\t\ttmp := ~f;\n\t\tif tmp = true then res1 := res1 + 1;\n\t\ttmp := ~t;\n\t\tif tmp = true then res1 := res1 + 10;\n\n\t\t(* expected result 1 *)\n\tend;\n\nprocedure and;\n\tvar tmp: boolean;\n\tbegin\n\t\ttmp := t & t;\n\t\tif tmp = true then res2 := res2 + 1;\n\t\ttmp := t & f;\n\t\tif tmp = true then res2 := res2 + 10;\n\t\ttmp := f & f;\n\t\tif tmp = true then res2 := res2 + 100;\n\t\ttmp := f & t;\n\t\tif tmp = true then res2 := res2 + 1000;\n\t\ttmp := t & ~f;\n\t\tif tmp = true then res2 := res2 + 10000;\n\n\t\t(* expected result 10001 *)\n\tend;\n\nprocedure or;\n\tvar tmp: boolean;\n\tbegin\n\t\ttmp := t | t;\n\t\tif tmp = true then res3 := res3 + 1;\n\t\ttmp := t | f;\n\t\tif tmp = true then res3 := res3 + 10;\n\t\ttmp := f | f;\n\t\tif tmp = true then res3 := res3 + 100;\n\t\ttmp := f | t;\n\t\tif tmp = true then res3 := res3 + 1000;\n\t\ttmp := t | ~f;\n\t\tif tmp = true then res3 := res3 + 10000;\n\t\ttmp := ~t | f;\n\t\tif tmp = true then res3 := res3 + 100000;\n\n\t\t(* expected result 011011 *)\n\tend;\n\nprocedure complex;\n\tbegin\n\t\tif t | f & f | f = true then res4 := res4 + 1;\n\t\tif t | f & ~(f | f) = true then res4 := res4 + 10;\n\t\tif t | f & ~(f | f) & tt | ff = true then res4 := res4 + 100;\n\n\t\t(* expected result 110 *)\n\tend;\n\nbegin\n\tcall ineqAndEq;\n\tcall negation;\n\tcall and;\n\tcall or;\n\tcall complex;\nend.',
        "Condition Concating": "const a = 5, b = 5, c = 8, d = 5;\nvar res1, res2, res3, res4;\n\nprocedure negation;\n\tbegin\n\t\tres1 := 0;\n\t\t(* false *)\n\t\tif ~ a = b \n\t\t\tthen res1 := res1 + 1;\n\t\t(* false *)\n\t\tif ~a = b \n\t\t\tthen res1 := res1 + 1;\n\t\t(* true *)\n\t\tif ~a = c\n\t\t\tthen res1 := res1 + 1;\n\n\t\t(* expects res = 1 *)\n\tend;\n\nprocedure and;\n\tbegin\n\t\tres2 := 0;\n\t\t(* true *)\n\t\tif a = b & b = d \n\t\t\tthen res2 := res2 + 1;\n\t\t(* false *)\n\t\tif a = b & ~b = d \n\t\t\tthen res2 := res2 + 1;\n\t\t(* false *)\n\t\tif ~a = b & b = d \n\t\t\tthen res2 := res2 + 1;\n\t\t(* true *)\n\t\tif a = b & ~b = c\n\t\t\tthen res2 := res2 + 1;\n\n\t\t(* expects res = 2 *)\n\tend;\n\nprocedure or;\n\tbegin\n\t\tres3 := 0;\n\t\t(* true *)\n\t\tif a = b | b = d \n\t\t\tthen res3 := res3 + 1;\n\t\t(* true *)\n\t\tif a = b | ~b = d \n\t\t\tthen res3 := res3 + 1;\n\t\t(* true *)\n\t\tif ~a = b | b = d \n\t\t\tthen res3 := res3 + 1;\n\t\t(* false *)\n\t\tif a = c | b = c\n\t\t\tthen res3 := res3 + 1;\n\n\t\t(* expects res = 3 *)\n\tend;\n\nprocedure complex;\n\tbegin\n\t\tres4 := 0;\n\t\t(* true *)\n\t\tif a = b & b = d & ~b = c | c = d\n\t\t\tthen res4 := res4 + 1;\n\t\t(* true *)\n\t\tif a = c & b = c | ~c = d\n\t\t\tthen res4 := res4 + 1;\n\t\t(* false *)\n\t\tif a = c & b = c | c = d\n\t\t\tthen res4 := res4 + 1;\n\n\t\t(* expects res = 2 *)\n\tend;\n\nbegin\n\tcall negation;\n\tcall and;\n\tcall or;\n\tcall complex;\nend.",
        "Float arithmetics": "(* last case in div fails. Note: all variables must have type 'float' specified, \n   because by default variables are integer. All values must have decimal point specified, \n   otherwise they are considered as integers. \n*)\nconst t: float = 1.000, f: float = 0.0001;\nvar a: float, b: float;\n\nprocedure plus;\n\tvar x: float;\n\tbegin\n\t\tx := 0.01;\n\t\ta := x + t; (* 1.01 in a *)\n\t\ta := x + t + f; (* 1.0101 in a *)\n\t\tb := x + 3.0; (* 3.01 in b*)\n\tend;\n\nprocedure minus;\n\tvar x: float;\n\tbegin\n\t\tx := 0.01;\n\t\ta := t - x; (* 0.99 in a *)\n\t\tb := x - 3.0; (* -2.99 in b *)\n\tend;\n\nprocedure mult;\n\tvar x: float;\n\tbegin\n\t\tx := 0.5;\n\t\ta := x * t; (* 0.5 in a *)\n\t\tb := x * 3.0; (* 1.5 in b *)\n\tend;\n\nprocedure div;\n\tvar x: float;\n\tbegin\n\t\tx := 1.0;\n\t\ta := x / f; (* 10000 in a *)\n\t\tb := x / 3.0; (* 0.333 in b TODO: this results in 0 *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.",
        "Float conditions": "const a: float = 5.01, b: float = 2.87331;\nvar res, res2;\n\nbegin\n\tres  := 0;\n\tres2 := 0;\n\n\tif a =  5.01  then res := res + 1;  (* true\t *)\n\tif a <  5.01  then res := res + 1;  (* false\t*)\n\tif a >  5.01  then res := res + 1;  (* false\t*)\n\tif a <= 5.01  then res := res + 1;  (* true\t *)\n\tif a >= 5.01  then res := res + 1;  (* true\t *)\n\tif a #  5.01  then res := res + 1;  (* false\t*)\n\tif a # -0.674 then res := res + 1;  (* true\t *)\n\n\tif a =  b then res2 := res2 + 1; (* false\t*)\n\tif a <  b then res2 := res2 + 1; (* false\t*)\n\tif a >  b then res2 := res2 + 1; (* true\t *)\n\tif a <= b then res2 := res2 + 1; (* false\t*)\n\tif a >= b then res2 := res2 + 1; (* true\t *)\n\tif a #  b then res2 := res2 + 1; (* true\t *)\n\n\t(* at the end res = 4, res2 = 3 *)\nend.",
        "If else": "var res;\n\nbegin\n\tres := 0;\n\n(* +1 *)\nif 1 = 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1000 *)\n\tif 1 # 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1000 *)\n\tif 1 < 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1 *)\n\tif 1 <= 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1000 *)\n\tif 1 > 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1 *)\n\tif 1 >= 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\n\tif odd 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\n\t(* expected res value: 3004*)\nend.",
        "Int arithmetics": "(* all procedures called and gave expected results *)\nconst t = 10, f = 5;\nvar a, b;\n\nprocedure plus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x + t; (* 15 in a *)\n\t\tb := x + 3; (* 8 in b*)\n\tend;\n\nprocedure minus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x - t; (* -5 in a *)\n\t\tb := x - 3; (* 2 in b *)\n\tend;\n\nprocedure mult;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x * f; (* 25 in a *)\n\t\tb := x * 3; (* 15 in b *)\n\tend;\n\nprocedure div;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x / f; (* 1 in a *)\n\t\tb := x / 3; (* 1 in b *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.",
        "Int conditions": "const a = 5, b = 2;\nvar res, res2;\n\nbegin\n\tres  := 0;\n\tres2 := 0;\n\n\tif a =  5  then res := res + 1;  (* true\t *)\n\tif a <  5  then res := res + 1;  (* false\t*)\n\tif a >  5  then res := res + 1;  (* false\t*)\n\tif a <= 5  then res := res + 1;  (* true\t *)\n\tif a >= 5  then res := res + 1;  (* true\t *)\n\tif a #  5  then res := res + 1;  (* false\t*)\n\tif a # -1  then res := res + 1;  (* true\t *)\n\n\tif a =  b then res2 := res2 + 1; (* false\t*)\n\tif a <  b then res2 := res2 + 1; (* false\t*)\n\tif a >  b then res2 := res2 + 1; (* true\t *)\n\tif a <= b then res2 := res2 + 1; (* false\t*)\n\tif a >= b then res2 := res2 + 1; (* true\t *)\n\tif a #  b then res2 := res2 + 1; (* true\t *)\n\n\t(* at the end res = 4, res2 = 3 *)\nend.",
        "Loop test": "const upper = 8;\nvar res1, res2;\n\nprocedure testWhile;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\twhile i < upper do\n\t\t\ti := i + 1;\n\t\tres1 := i;\n\tend;\n\nprocedure testFor;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\tfor 3 to upper do\n\t\t\ti := i + 1;\n\t\tres2 := i;\n\tend;\n\nbegin\n\t(* call testWhile; *)\n\tcall testFor;\n\n\t(* Expects 8 in res1 and 5 in res2 *)\nend.\n",
        "Parallel Assignment": "var int: integer, fl: float, bool: boolean, bool2: boolean;\n\nbegin\n\t{int, fl, bool, bool2} := {5, 2.345, false, true};\n\n\t(* expects the variables to have 5, 2.345, 0 *)\nend.",
        "Procedures": "const a1 = 5;\nvar resFloat1: float;\n\nprocedure test;\n\tbegin\n\tend;\n\nprocedure float returnTest;\n\treturn 2.5;\n\nprocedure paramSimpleTest(p1, p2: float, p3: boolean);\n\tbegin\n\tend;\n\nbegin\n\tcall test;\n\tresFloat1 := call returnTest;\n\tcall paramSimpleTest(a1, 2.8, true);\nend.",
        "Return": "var res;\n\nprocedure integer onePlusOne;\n\tbegin\n\t\treturn 1+1;\n\tend;\n\nprocedure assignOnePlusOne;\n\tbegin\n\t\tres := call onePlusOne;\n\tend;\n\nbegin\n\tcall assignOnePlusOne;\nend.",
        "Ternary": "var res;\n\nbegin\n\t(1 < 2) ? begin res := 5; return res; end; : begin res := 8; return res; end;;\nend."
    }

    /** 
     * Event listener that binds all parsing functions to one public namespace.
     */
    window.addEventListener("load", function() {
        initExampleSelector();

        //Store the methods to public namespace.
        window["Examples"] = Examples;
    });

    //=======================================================
    //                  Initialize functions 
    //=======================================================

    /**
     * Initialize the selector with data from the examples above
     */
    function initExampleSelector() {
        let exampleSelector = document.getElementById("exampleSelector");

        for (let key in ExampleOptions) {
            let currentOption = document.createElement("option")
            currentOption.innerHTML = key;

            exampleSelector?.append(currentOption);
        }
    }


    //=======================================================
    //                  Public methods
    //=======================================================

    /**
     * Loads selected example into the input editor
     */
    Examples.loadExample = function() {
        const key = document.getElementById("exampleSelector").value;

        Parser.setInputValue(ExampleOptions[key]);
    }
})($);