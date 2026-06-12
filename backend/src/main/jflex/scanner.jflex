package com.ape10.cfg.lexer;

import java_cup.runtime.*;
import com.ape10.cfg.parser.sym;

%%

%class RpgLexer
%public
%unicode
%cup
%line
%column

%{
    private Symbol symbol(int type) {
        return new Symbol(type, yyline + 1, yycolumn + 1);
    }

    private Symbol symbol(int type, Object value) {
        return new Symbol(type, yyline + 1, yycolumn + 1, value);
    }
%}

/* Macros */
LineTerminator  = \r|\n|\r\n
WhiteSpace      = {LineTerminator} | [ \t\f]
StringLiteral   = \"[^\"]*\"

%%

/* Keywords - Terminales del Contexto 4: RPG NPC Dialog */
"SAY"           { return symbol(sym.SAY, yytext()); }
"IF"            { return symbol(sym.IF, yytext()); }
"THEN"          { return symbol(sym.THEN, yytext()); }
"ELSE"          { return symbol(sym.ELSE, yytext()); }
"GIVE"          { return symbol(sym.GIVE, yytext()); }
"AND"           { return symbol(sym.AND, yytext()); }
"PLAYER_HAS"    { return symbol(sym.PLAYER_HAS, yytext()); }

/* Delimitadores */
";"             { return symbol(sym.SEMICOLON, yytext()); }

/* Literales */
{StringLiteral} { return symbol(sym.STRING_LITERAL, yytext()); }

/* Espacios en blanco - ignorados */
{WhiteSpace}    { /* ignore */ }

/* Error: carácter no reconocido */
[^]             { throw new RuntimeException("Error léxico: carácter ilegal <" + yytext() + "> en línea " + (yyline + 1) + ", columna " + (yycolumn + 1)); }
