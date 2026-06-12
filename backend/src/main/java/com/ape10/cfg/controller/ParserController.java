package com.ape10.cfg.controller;

import com.ape10.cfg.model.*;
import com.ape10.cfg.service.ParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller para el Motor de Derivación CFG.
 */
@RestController
@RequestMapping("/api")
public class ParserController {

    private final ParserService parserService;

    public ParserController(ParserService parserService) {
        this.parserService = parserService;
    }

    /**
     * POST /api/parse
     * Realiza el análisis léxico y sintáctico completo.
     * Retorna tokens, árbol de derivación, pasos de derivación y errores.
     */
    @PostMapping("/parse")
    public ResponseEntity<ParseResult> parse(@RequestBody Map<String, String> request) {
        String input = request.getOrDefault("input", "");
        if (input.isBlank()) {
            ParseResult result = new ParseResult();
            result.setSuccess(false);
            result.getErrors().add("La entrada no puede estar vacía.");
            return ResponseEntity.badRequest().body(result);
        }

        ParseResult result = parserService.parse(input);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/tokenize
     * Realiza solo el análisis léxico.
     * Retorna la lista de tokens reconocidos.
     */
    @PostMapping("/tokenize")
    public ResponseEntity<?> tokenize(@RequestBody Map<String, String> request) {
        String input = request.getOrDefault("input", "");
        if (input.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La entrada no puede estar vacía."));
        }

        try {
            List<TokenInfo> tokens = parserService.tokenize(input);
            return ResponseEntity.ok(Map.of("tokens", tokens));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/grammar
     * Retorna la definición formal de la gramática G=(V,Σ,P,S).
     */
    @GetMapping("/grammar")
    public ResponseEntity<GrammarInfo> getGrammar() {
        return ResponseEntity.ok(parserService.getGrammarInfo());
    }
}
