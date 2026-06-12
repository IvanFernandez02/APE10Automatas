package com.ape10.cfg.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Nodo del árbol de derivación.
 * Cada nodo representa un símbolo (terminal o no terminal)
 * y sus hijos representan la expansión de una producción.
 */
public class TreeNode {

    private String id;
    private String label;       // Nombre del no-terminal o terminal
    private String value;       // Valor literal (solo para terminales con valor)
    private String productionId; // ID de la producción aplicada (P1-P12), null para terminales
    private String type;        // "terminal" o "nonterminal"
    private List<TreeNode> children;

    public TreeNode() {
        this.children = new ArrayList<>();
    }

    public TreeNode(String id, String label, String type) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.children = new ArrayList<>();
    }

    public TreeNode(String id, String label, String value, String type) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.type = type;
        this.children = new ArrayList<>();
    }

    public void addChild(TreeNode child) {
        this.children.add(child);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getProductionId() { return productionId; }
    public void setProductionId(String productionId) { this.productionId = productionId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<TreeNode> getChildren() { return children; }
    public void setChildren(List<TreeNode> children) { this.children = children; }
}
