package com.ape10.cfg.service;

import com.ape10.cfg.model.*;
import com.ape10.cfg.model.GrammarInfo.ProductionInfo;
import com.ape10.cfg.lexer.RpgLexer;
import com.ape10.cfg.parser.CfgParser;
import com.ape10.cfg.parser.sym;

import java_cup.runtime.Symbol;

import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.util.*;

/**
 * Servicio que coordina el análisis léxico (JFlex) y sintáctico (CUP).
 */
@Service
public class ParserService {

    /**
     * Realiza el análisis léxico y sintáctico completo.
     */
    public ParseResult parse(String input) {
        ParseResult result = new ParseResult();

        // Fase 1: Análisis Léxico - recolectar tokens
        try {
            List<TokenInfo> tokens = tokenize(input);
            result.setTokens(tokens);
        } catch (Exception e) {
            result.getErrors().add("Error léxico: " + e.getMessage());
            result.setSuccess(false);
            return result;
        }

        // Fase 2: Análisis Sintáctico - construir árbol de derivación
        try {
            RpgLexer lexer = new RpgLexer(new StringReader(input));
            CfgParser parser = new CfgParser(lexer);

            Symbol parseResult = parser.parse();

            if (parseResult != null && parseResult.value instanceof TreeNode) {
                result.setTree((TreeNode) parseResult.value);
                result.setDerivationSteps(parser.getDerivationSteps());
                result.setSuccess(true);
            } else {
                result.getErrors().add("El parser no produjo un árbol de derivación válido.");
                result.setSuccess(false);
            }

            // Agregar errores del parser si los hay
            if (!parser.getErrors().isEmpty()) {
                result.getErrors().addAll(parser.getErrors());
                result.setSuccess(false);
            }

        } catch (Exception e) {
            result.getErrors().add(e.getMessage());
            result.setSuccess(false);
        }

        return result;
    }

    /**
     * Realiza solo el análisis léxico y devuelve la lista de tokens.
     */
    public List<TokenInfo> tokenize(String input) throws Exception {
        List<TokenInfo> tokens = new ArrayList<>();
        RpgLexer lexer = new RpgLexer(new StringReader(input));

        Symbol token;
        while (true) {
            token = lexer.next_token();
            if (token.sym == sym.EOF) break;

            String typeName = getTokenName(token.sym);
            String category = getTokenCategory(token.sym);
            String value = token.value != null ? token.value.toString() : "";

            tokens.add(new TokenInfo(typeName, value, token.left, token.right, category));
        }

        return tokens;
    }

    /**
     * Devuelve la definición formal de la gramática G=(V,Σ,P,S).
     */
    public GrammarInfo getGrammarInfo() {
        GrammarInfo info = new GrammarInfo();

        // V (No Terminales)
        info.setNonTerminals(new LinkedHashSet<>(Arrays.asList(
            "Diálogo", "ListaSentencias", "Sentencia", "Condición",
            "Consecuencia", "ListaAcciones", "Acción"
        )));

        // Σ (Terminales)
        info.setTerminals(new LinkedHashSet<>(Arrays.asList(
            "SAY", "IF", "THEN", "ELSE", "GIVE", "AND",
            "PLAYER_HAS", "STRING_LITERAL", ";"
        )));

        // S (Símbolo inicial)
        info.setStartSymbol("Diálogo");

        // P (Producciones)
        List<ProductionInfo> productions = new ArrayList<>();
        productions.add(new ProductionInfo("P1", "Diálogo", "ListaSentencias", "Símbolo inicial"));
        productions.add(new ProductionInfo("P2", "ListaSentencias", "Sentencia ;", "Una sola sentencia"));
        productions.add(new ProductionInfo("P3", "ListaSentencias", "Sentencia ; ListaSentencias", "Recursión a la derecha"));
        productions.add(new ProductionInfo("P4", "Sentencia", "SAY STRING_LITERAL", "Acción de hablar"));
        productions.add(new ProductionInfo("P5", "Sentencia", "GIVE STRING_LITERAL", "Acción de dar objeto"));
        productions.add(new ProductionInfo("P6", "Sentencia", "IF Condición THEN Consecuencia ELSE ListaAcciones", "Condicional completo"));
        productions.add(new ProductionInfo("P7", "Condición", "PLAYER_HAS STRING_LITERAL", "Verificación de inventario"));
        productions.add(new ProductionInfo("P8", "Consecuencia", "Acción", "Una acción en el THEN"));
        productions.add(new ProductionInfo("P9", "ListaAcciones", "Acción", "Una acción en el ELSE"));
        productions.add(new ProductionInfo("P10", "ListaAcciones", "Acción AND ListaAcciones", "AND recursivo"));
        productions.add(new ProductionInfo("P11", "Acción", "SAY STRING_LITERAL", "Acción tipo SAY"));
        productions.add(new ProductionInfo("P12", "Acción", "GIVE STRING_LITERAL", "Acción tipo GIVE"));
        info.setProductions(productions);

        return info;
    }

    /**
     * Obtiene el nombre legible de un tipo de token.
     */
    private String getTokenName(int symType) {
        switch (symType) {
            case sym.SAY: return "SAY";
            case sym.IF: return "IF";
            case sym.THEN: return "THEN";
            case sym.ELSE: return "ELSE";
            case sym.GIVE: return "GIVE";
            case sym.AND: return "AND";
            case sym.PLAYER_HAS: return "PLAYER_HAS";
            case sym.SEMICOLON: return "SEMICOLON";
            case sym.STRING_LITERAL: return "STRING_LITERAL";
            default: return "UNKNOWN";
        }
    }

    /**
     * Obtiene la categoría de un token (KEYWORD, LITERAL, DELIMITER).
     */
    private String getTokenCategory(int symType) {
        switch (symType) {
            case sym.SAY:
            case sym.IF:
            case sym.THEN:
            case sym.ELSE:
            case sym.GIVE:
            case sym.AND:
            case sym.PLAYER_HAS:
                return "KEYWORD";
            case sym.STRING_LITERAL:
                return "LITERAL";
            case sym.SEMICOLON:
                return "DELIMITER";
            default:
                return "UNKNOWN";
        }
    }
}
