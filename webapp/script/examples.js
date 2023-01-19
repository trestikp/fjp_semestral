(function ($) {
    let Examples = {};

    let ExampleOptions = {
        "All features": '(*\nThis example is happy day for following features\n\n3. **integer** variable and constant (whole number) (not sure if this is not basically done by the language itself)\n4. **assignments** defined in original PL/0\n5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** \n6. **loops** - one is compulsory. Other loop types are for bonus points. For now lets try **for, while, foreach (if we will have arrays)**\n7. **simple condition** without\n8. **subprogram definition** function/ procedure and its call\n9. bonus (1pt): **else**\n10. bonus (1pt): **other loop types**\n11. bonus (1pt): **boolean and related operation**\n12. bonus (1pt): **data type: real (with integer functionality) - aka. floating point**\n13. bonus (1pt): **string with concat operator**\nTODO: 14. bonus (1pt): **switch** (we dont have switch for now)\n15. bonus (1pt): **multiple assignment** - "a = b = c = d = 3"\n16. bonus (1pt): **ternary operator** - " (a < b) ? a : b;"\n17. bonus (1pt): **parallel assignment** - "{a, b, c, d} = {1, 2, 3, 4}"\n18. bonus (2pt): **string comparison operator**\n19. bonus (2pt): **subprogram parameters by value**\n20. bonus (2pt): **subprogram return value**\n*)\n\n(* constants *)\nconst hello_c = "hello", world_c = "world", num_c : integer = 57; \n\n(* variables - x is assumed to be integer *)\nvar x, y: integer, z: float, w: string;\n\n(* procedures *)\nprocedure does_nothing:\n\tconst nothing_constant = 5;\n\tvar a, b;\n\tbegin\n\t\tif odd a then b := a;\n\t\telse a := b;\n\t\t\n\t\tif nothing_constant != 5 then\n\t\tbegin\n\t\t\ta := b := nothing_constant;\n\t\tend;\n\tend;\n\nprocedure takes_params(i1, f1, a1):\n\tvar a, b: float , c: string;\n\tbegin\n\t\ta := i1;\n\t\tb := f1;\n\t\tc := a1;\n\tend;\n\nprocedure integer addition(num1, num2: integer):\n\treturn num1 + num2;\n\nprocedure test_operators:\n\tconst a: integer = 5, b: integer = 4;\n\tvar control, tmp;\n\tbegin\n\t\tcontrol := 0;\n\t\t(* 5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** *)\n\t\tif 5 == 5 then control := control + 1;\n\t\tif 5 <= 5 then control := control + 1;\n\t\tif 4 <= 5 then control := control + 1;\n\t\tif 5 < 5 then control := control + 1; (* false *)\n\t\tif 4 < 5 then control := control + 1;\n\t\tif 5 > 5 then control := control + 1; (* false *)\n\t\tif 6 > 5 then control := control + 1;\n\t\tif 5 >= 5 then control := control + 1;\n\t\tif 6 >= 5 then control := control + 1;\n\n\t\ttmp := a + b;\n\t\tif tmp == 9 then control := control + 1;\n\t\ttmp := a - b;\n\t\tif tmp == 1 then control := control + 1;\n\t\ttmp := a * b;\n\t\tif tmp == 20 then control := control + 1;\n\t\ttmp := a / b; (* TODO: define this behaviour *)\n\t\tif tmp == 1 then control := control + 1;\n\n\t\ttmp := a & b;\n\t\tif tmp == 4 then control := control + 1;\n\t\ttmp := a | b;\n\t\tif tmp == 5 then control := control + 1;\n\t\ttmp := a ^ b;\n\t\tif tmp == 4 then control := control + 1;\n\n\t\t(* control should be 14 at this point - if all features work correctly *)\n\tend;\n\nprocedure test_loops:\n\tvar wi, fi;\n\tbegin\n\t\twi := 0; fi := 0;\n\t\twhile wi < 10 do\n\t\t\twi := wi + 2;\n\t\tfor 5 to 10 do\n\t\t\tfi := fi + 5;\n\t\t\n\t\t(* wi should be 10, fi whould be 25 *)\n\tend;\n\nprocedure test_boolean:\n\tvar b: boolean, control;\n\tbegin\n\t\tb := true; control := 0;\n\t\tif b then control := control + 1;\n\t\tif b == true \n\t\t\tthen b := false;\n\t\t\telse b := true;\n\t\tif b == true \n\t\t\tthen b := false;\n\t\t\telse b := true;\n\tend;\n\nprocedure test_floats:\n\tconst a = 5.1, b = 3.7;\n\tvar control, tmp: float;\n\tbegin\n\t\tcontrol := 0;\n\t\t(* 5. **basic operations (+,-,*,/,&,|,^,())(==, <=, <, >, >=)** *)\n\t\tif 5.5 == 5.5 then control := control + 1;\n\t\tif 5.8 <= 5.8 then control := control + 1;\n\t\tif 4.1 <= 4.11 then control := control + 1;\n\t\tif 5.1 < 5.1 then control := control + 1; (* false *)\n\t\tif 4.1 < 4.11 then control := control + 1;\n\t\tif 5.1 > 5.1 then control := control + 1; (* false *)\n\t\tif 5.11 > 5.1 then control := control + 1;\n\t\tif 5.11 >= 5.11 then control := control + 1;\n\t\tif 5.11 >= 5.05 then control := control + 1;\n\n\t\ttmp := a + b;\n\t\tif tmp == 8.8 then control := control + 1;\n\t\ttmp := a - b;\n\t\tif tmp == 1.4 then control := control + 1;\n\t\ttmp := a * b;\n\t\tif tmp == 18.87 then control := control + 1;\n\t\ttmp := a / b; (* TODO: define this behaviour *)\n\t\tif tmp == 1.3783783783783783 then control := control + 1;\n\n\t\t(* UNSUPPORTED FOR FLOAT!!!!! *)\n\t\t// tmp := a & b;\n\t\t// if tmp == 4 then control := control + 1;\n\t\t// tmp := a | b;\n\t\t// if tmp == 5 then control := control + 1;\n\t\t// tmp := a ^ b;\n\t\t// if tmp == 4 then control := control + 1;\n\n\t\t(* control should be 11 at this point - if all features work correctly *)\n\tend;\n\nprocedure test_assignments:\n\tvar a, b, c;\n\tbegin\n\t\ta := b := c := 5;\n\t\t(* a, b, c should be 5 now *)\n\t\t{a, b, c} = {1, 2, 3}\n\t\t(* a should be 1, b should be 2, c should be 3 *)\n\tend;\n\nprocedure test_additional_comparisons:\n\tconst a = "test", b = "test", x = 5, y 5;\n\tvar control;\n\tbegin\n\t\tcontrol := 0;\n\t\t(* string comparison *)\n\t\tif a == b then control := control + 1;\n\t\t(* ternary operator *)\n\t\t(x == y) ? control := control + 10; : control := control + 20;\n\n\t\t(* control should be 21 *)\n\tend;\n\n(* main *)\nbegin\n\tz := 5;\n\ty := 1;\n\tw := "Hello, ";\n\tw := w + "World!";\n\n\tcall test_operators;\n\tcall test_loops;\n\tcall test_boolean;\n\tcall test_floats;\n\tcall does_nothing;\n\tcall takes_params(5555, z, w);\n\tx := call addition(y, num_c);\nend.',
        "Float arithmetics": "(* last case in div fails. Note: all variables must have type 'float' specified, \n   because by default variables are integer. All values must have decimal point specified, \n   otherwise they are considered as integers. \n*)\nconst t: float = 1.000, f: float = 0.0001;\nvar a: float, b: float;\n\nprocedure plus;\n\tvar x: float;\n\tbegin\n\t\tx := 0.01;\n\t\ta := x + t; (* 1.01 in a *)\n\t\ta := x + t + f; (* 1.0101 in a *)\n\t\tb := x + 3.0; (* 3.01 in b*)\n\tend;\n\nprocedure minus;\n\tvar x: float;\n\tbegin\n\t\tx := 0.01;\n\t\ta := t - x; (* 0.99 in a *)\n\t\tb := x - 3.0; (* -2.99 in b *)\n\tend;\n\nprocedure mult;\n\tvar x: float;\n\tbegin\n\t\tx := 0.5;\n\t\ta := x * t; (* 0.5 in a *)\n\t\tb := x * 3.0; (* 1.5 in b *)\n\tend;\n\nprocedure div;\n\tvar x: float;\n\tbegin\n\t\tx := 1;\n\t\ta := x / f; (* 10000 in a *)\n\t\tb := x / 3.0; (* 0.333 in b TODO: this results in 0 *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.",
        "If else": "var res;\n\nbegin\n\tres := 0;\n\n\t(* +1 *)\n\tif 1 = 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1000 *)\n\tif 1 # 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1000 *)\n\tif 1 < 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1 *)\n\tif 1 <= 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1000 *)\n\tif 1 > 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\t(* +1 *)\n\tif 1 >= 1 then res := res + 1;\n\t\t\t else res := res + 1000;\n\n\t(* expected res value: 3003*)\nend.",
        "Int arithmetics": "(* all procedures called and gave expected results *)\nconst t = 10, f = 5;\nvar a, b;\n\nprocedure plus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x + t; (* 15 in a *)\n\t\tb := x + 3; (* 8 in b*)\n\tend;\n\nprocedure minus;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x - t; (* -5 in a *)\n\t\tb := x - 3; (* 2 in b *)\n\tend;\n\nprocedure mult;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x * f; (* 25 in a *)\n\t\tb := x * 3; (* 15 in b *)\n\tend;\n\nprocedure div;\n\tvar x;\n\tbegin\n\t\tx := 5;\n\t\ta := x / f; (* 1 in a *)\n\t\tb := x / 3; (* 1 in b *)\n\tend;\n\nbegin\n\tcall plus;\n\tcall minus;\n\tcall mult;\n\tcall div;\nend.",
        "Int conditions": "const a = 5, b = 2;\nvar res, res2;\n\nbegin\n\tres  := 0;\n\tres2 := 0;\n\n\tif a =  5  then res := res + 1;  (* true\t *)\n\tif a <  5  then res := res + 1;  (* false\t*)\n\tif a >  5  then res := res + 1;  (* false\t*)\n\tif a <= 5  then res := res + 1;  (* true\t *)\n\tif a >= 5  then res := res + 1;  (* true\t *)\n\tif a #  5  then res := res + 1;  (* false\t*)\n\tif a # -1  then res := res + 1;  (* true\t *)\n\n\tif a =  b then res2 := res2 + 1; (* false\t*)\n\tif a <  b then res2 := res2 + 1; (* false\t*)\n\tif a >  b then res2 := res2 + 1; (* true\t *)\n\tif a <= b then res2 := res2 + 1; (* false\t*)\n\tif a >= b then res2 := res2 + 1; (* true\t *)\n\tif a #  b then res2 := res2 + 1; (* true\t *)\n\n\t(* at the end res = 4, res2 = 3 *)\nend.",
        "Loop test": "const upper = 8;\nvar res1, res2;\n\nprocedure testWhile;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\twhile i < upper do\n\t\t\ti := i + 1;\n\t\tres1 := i;\n\tend;\n\nprocedure testFor;\n\tvar i;\n\tbegin\n\t\ti := 0;\n\t\tfor 3 to upper do\n\t\t\ti := i + 1;\n\t\tres2 := i;\n\tend;\n\nbegin\n\t(* call testWhile; *)\n\tcall testFor;\n\n\t(* Expects 8 in res1 and 5 in res2 *)\nend.\n"
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

    Examples.loadExample = function() {
        const key = document.getElementById("exampleSelector").value;

        Parser.setInputValue(ExampleOptions[key]);
    }
})($);