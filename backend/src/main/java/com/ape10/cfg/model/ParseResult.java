package com.ape10.cfg.model;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO con el resultado completo del análisis léxico y sintáctico.
 */
public class ParseResult {

    private boolean success;
    private List<TokenInfo> tokens;
    private TreeNode tree;
    private List<String> errors;
    private List<String> derivationSteps;

    public ParseResult() {
        this.tokens = new ArrayList<>();
        this.errors = new ArrayList<>();
        this.derivationSteps = new ArrayList<>();
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<TokenInfo> getTokens() { return tokens; }
    public void setTokens(List<TokenInfo> tokens) { this.tokens = tokens; }

    public TreeNode getTree() { return tree; }
    public void setTree(TreeNode tree) { this.tree = tree; }

    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }

    public List<String> getDerivationSteps() { return derivationSteps; }
    public void setDerivationSteps(List<String> derivationSteps) { this.derivationSteps = derivationSteps; }
}
