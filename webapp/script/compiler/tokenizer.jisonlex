id                      [a-zA-Z][a-zA-Z0-9]*
//number                  [0-9][0-9]* // TODO: this is wrong
//number                  ([0-9].){,1}[0-9]
number                  \d+(?:\.\d+)? // https://stackoverflow.com/questions/14550526/regex-for-both-integer-and-float

%%
\s+                     { /* skip whitespaces */ }
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
"+"                     return Symbols.plus;
"-"                     return Symbols.minus;
"*"                     return Symbols.star;
"/"                     return Symbols.slash;
{id}                    return Symbols.ident;
{number}                return Symbols.number;
.                       return Symbols.input;