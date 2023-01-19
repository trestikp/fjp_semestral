id                      [a-zA-Z][a-zA-Z0-9]*
// removed options of +25, +1.01 etc., because f it
//integer                 [+-]?[0-9]+ // allows leading zeros - this is by design
//float                   [+-]?([0-9]+[.]([0-9]*)?|[.][0-9]+) // https://stackoverflow.com/questions/9043551/regex-that-matches-integers-in-between-whitespace-or-start-end-of-string-only
// not allowing sings, because signs are grammar symbols
integer                 [0-9]+ // allows leading zeros - this is by design
float                   ([0-9]+[.]([0-9]*)?|[.][0-9]+) // https://stackoverflow.com/questions/9043551/regex-that-matches-integers-in-between-whitespace-or-start-end-of-string-only
bool                    ("true"|"false")
string                  \"(.*?)\"

%%
\s+                     { /* skip whitespaces */ }
"(*"                    return Symbols.comment_start;
"*)"                    return Symbols.comment_end;
"*"                     return Symbols.star;
"/"                     return Symbols.slash;
"+"                     return Symbols.plus;
"-"                     return Symbols.minus;
"&"                     return Symbols.ampersand;
"|"                     return Symbols.pipe;
"~"                     return Symbols.tilde;
{bool}                  { symbol_input_type = Symbols_Input_Type.boolean;   return Symbols.input; }
{float}                 { symbol_input_type = Symbols_Input_Type.float;     return Symbols.input; }
{integer}               { symbol_input_type = Symbols_Input_Type.integer;   return Symbols.input; }
{string}                { symbol_input_type = Symbols_Input_Type.string;    return Symbols.input; }
"begin"                 return Symbols.begin;
"call"                  return Symbols.call;
"const"                 return Symbols.const;
"do"                    return Symbols.do;
"else"                  return Symbols.else
"end"                   return Symbols.end;
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
"boolean"               return Symbols.data_type;
"integer"               return Symbols.data_type;
"float"                 return Symbols.data_type;
"string"                return Symbols.data_type;
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