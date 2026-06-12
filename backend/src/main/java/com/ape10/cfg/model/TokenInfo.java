package com.ape10.cfg.model;

/**
 * DTO para información de un token reconocido por el Lexer.
 */
public class TokenInfo {

    private String type;    // Tipo de token (SAY, IF, STRING_LITERAL, etc.)
    private String value;   // Valor del token
    private int line;       // Línea donde se encontró
    private int column;     // Columna donde se encontró
    private String category; // Categoría: KEYWORD, LITERAL, DELIMITER

    public TokenInfo() {}

    public TokenInfo(String type, String value, int line, int column, String category) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
        this.category = category;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public int getLine() { return line; }
    public void setLine(int line) { this.line = line; }

    public int getColumn() { return column; }
    public void setColumn(int column) { this.column = column; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
