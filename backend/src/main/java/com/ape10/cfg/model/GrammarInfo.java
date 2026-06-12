package com.ape10.cfg.model;

import java.util.List;
import java.util.Set;

/**
 * DTO con la definición formal de la gramática G=(V,Σ,P,S).
 */
public class GrammarInfo {

    private Set<String> terminals;        // Σ
    private Set<String> nonTerminals;     // V
    private List<ProductionInfo> productions; // P
    private String startSymbol;           // S

    public GrammarInfo() {}

    // Getters and Setters
    public Set<String> getTerminals() { return terminals; }
    public void setTerminals(Set<String> terminals) { this.terminals = terminals; }

    public Set<String> getNonTerminals() { return nonTerminals; }
    public void setNonTerminals(Set<String> nonTerminals) { this.nonTerminals = nonTerminals; }

    public List<ProductionInfo> getProductions() { return productions; }
    public void setProductions(List<ProductionInfo> productions) { this.productions = productions; }

    public String getStartSymbol() { return startSymbol; }
    public void setStartSymbol(String startSymbol) { this.startSymbol = startSymbol; }

    /**
     * Información de una producción individual.
     */
    public static class ProductionInfo {
        private String id;
        private String leftSide;
        private String rightSide;
        private String description;

        public ProductionInfo() {}

        public ProductionInfo(String id, String leftSide, String rightSide, String description) {
            this.id = id;
            this.leftSide = leftSide;
            this.rightSide = rightSide;
            this.description = description;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getLeftSide() { return leftSide; }
        public void setLeftSide(String leftSide) { this.leftSide = leftSide; }

        public String getRightSide() { return rightSide; }
        public void setRightSide(String rightSide) { this.rightSide = rightSide; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
