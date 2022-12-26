id                      [a-zA-Z][a-zA-Z0-9]*
integer                 [-+]?[0-9]+ // allows leading zeros - this is by design
float                   [+-]?([0-9]+[.]([0-9]*)?|[.][0-9]+) // https://stackoverflow.com/questions/9043551/regex-that-matches-integers-in-between-whitespace-or-start-end-of-string-only
bool                    ("true"|"false")
string                  \"(.*?)\"

%%
\s+                     { /* skip whitespaces */ }
"+"                     return Symbols.plus;
"-"                     return Symbols.minus;
"*"                     return Symbols.star;
"/"                     return Symbols.slash;
{bool}                  { symbol_input_type = Symbols_Input_Type.boolean; return Symbols.input; }
{float}                 { symbol_input_type = Symbols_Input_Type.float; return Symbols.input; }
{integer}               { symbol_input_type = Symbols_Input_Type.integer; return Symbols.input; }
{string}                { symbol_input_type = Symbols_Input_Type.string; return Symbols.input; }
"begin"                 return Symbols.begin;
"call"                  return Symbols.call;
"const"                 return Symbols.const;
"do"                    return Symbols.do;
"else"                  return Symbols.else
"end"                   return Symbols.end;
"foreach"               return Symbols.foreach;
"for"                   return Symbols.for;
"if"                    return Symbols.if;
"in"                    return Symbols.in;
"odd"                   return Symbols.odd;
"procedure"             return Symbols.procedure;
"return"                return Symbols.return;
"then"                  return Symbols.then;
"to"                    return Symbols.to;
"var"                   return Symbols.var;
"while"                 return Symbols.while;
"(*"                    return Symbols.comment_start;
"*)"                    return Symbols.comment_end;
":="                    return Symbols.assignment;
":"                     return Symbols.colon;
";"                     return Symbols.semicolon;
","                     return Symbols.comma;
"."                     return Symbols.dot;
"("                     return Symbols.open_bra;
")"                     return Symbols.close_bra;
"{"                     return Symbols.open_curl;
"}"                     return Symbols.close_curl;
"?"                     return Symbols.quest_mark;
"!"                     return Symbols.excl_mark;
"#"                     return Symbols.hash_mark;
"="                     return Symbols.eq;
"<="                    return Symbols.lte;
"<"                     return Symbols.lt;
">="                    return Symbols.gte;
">"                     return Symbols.gt;
{id}                    return Symbols.ident;
.                       return Symbols.ERR;