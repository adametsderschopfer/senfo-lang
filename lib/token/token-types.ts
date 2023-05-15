import {TokenType} from "./token-type";

export const tokenTypes = {
    "PRINT_LOG": new TokenType("PRINT_LOG", "print_log"),

    "NUMBER": new TokenType("NUMBER", "[0-9]*"),

    // todo add exclusion words [print_log]
    "VARIABLE": new TokenType("VARIABLE", "[a-z_0-9]*"),

    "SEMICOLON": new TokenType("SEMICOLON", "\;"),
    "SPACE": new TokenType("SPACE", "[ \\n\\r\\t]"),

    "ASSIGN": new TokenType("ASSIGN", "\\="),

    "PLUS": new TokenType("PLUS", "\\+"),
    "MINUS": new TokenType("MINUS", "\\-"),
    "DIVIDE": new TokenType("DIVIDE", "\\/"),
    "MULTIPLY": new TokenType("MULTIPLY", "\\*"),

    "LEFT_PAR": new TokenType("LEFT_PAR", "\\("),
    "RIGHT_PAR": new TokenType("RIGHT_PAR", "\\)"),
};