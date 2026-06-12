import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export default function GrammarPanel() {
  const [grammar, setGrammar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrammar = async () => {
      try {
        const response = await axios.get(`${API_URL}/grammar`);
        setGrammar(response.data);
      } catch (error) {
        // Use fallback data if backend is not running
        setGrammar({
          startSymbol: 'Diálogo',
          nonTerminals: ['Diálogo', 'ListaSentencias', 'Sentencia', 'Condición', 'Consecuencia', 'ListaAcciones', 'Acción'],
          terminals: ['SAY', 'IF', 'THEN', 'ELSE', 'GIVE', 'AND', 'PLAYER_HAS', 'STRING_LITERAL', ';'],
          productions: [
            { id: 'P1', leftSide: 'Diálogo', rightSide: 'ListaSentencias', description: 'Símbolo inicial' },
            { id: 'P2', leftSide: 'ListaSentencias', rightSide: 'Sentencia ;', description: 'Una sola sentencia' },
            { id: 'P3', leftSide: 'ListaSentencias', rightSide: 'Sentencia ; ListaSentencias', description: 'Recursión a la derecha' },
            { id: 'P4', leftSide: 'Sentencia', rightSide: 'SAY STRING_LITERAL', description: 'Acción de hablar' },
            { id: 'P5', leftSide: 'Sentencia', rightSide: 'GIVE STRING_LITERAL', description: 'Acción de dar objeto' },
            { id: 'P6', leftSide: 'Sentencia', rightSide: 'IF Condición THEN Consecuencia ELSE ListaAcciones', description: 'Condicional completo' },
            { id: 'P7', leftSide: 'Condición', rightSide: 'PLAYER_HAS STRING_LITERAL', description: 'Verificación de inventario' },
            { id: 'P8', leftSide: 'Consecuencia', rightSide: 'Acción', description: 'Una acción en el THEN' },
            { id: 'P9', leftSide: 'ListaAcciones', rightSide: 'Acción', description: 'Una acción en el ELSE' },
            { id: 'P10', leftSide: 'ListaAcciones', rightSide: 'Acción AND ListaAcciones', description: 'AND recursivo' },
            { id: 'P11', leftSide: 'Acción', rightSide: 'SAY STRING_LITERAL', description: 'Acción tipo SAY' },
            { id: 'P12', leftSide: 'Acción', rightSide: 'GIVE STRING_LITERAL', description: 'Acción tipo GIVE' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGrammar();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2>DEFINICION DE GRAMATICA [G=(V,Σ,P,S)]</h2>
        </div>
        <div className="panel-body">
          <div className="empty-state">
            <span className="spinner"></span>
            <p style={{ marginTop: '16px' }}>CARGANDO GRAMATICA...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!grammar) return null;

  const terminals = Array.isArray(grammar.terminals) ? grammar.terminals : Object.values(grammar.terminals || {});
  const nonTerminals = Array.isArray(grammar.nonTerminals) ? grammar.nonTerminals : Object.values(grammar.nonTerminals || {});

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>DEFINICION DE GRAMATICA [G=(V,Σ,P,S)]</h2>
        <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
          CONTEXTO 4 // RPG NPC DIALOG
        </span>
      </div>
      <div className="panel-body">
        {/* Start Symbol */}
        <div className="grammar-section">
          <h3>SIMBOLO INICIAL (S)</h3>
          <div className="symbol-badges">
            <span className="symbol-badge nonterminal" style={{ fontWeight: '700' }}>
              {grammar.startSymbol}
            </span>
          </div>
        </div>

        {/* Non-Terminals */}
        <div className="grammar-section">
          <h3>NO TERMINALES (V) — [{nonTerminals.length}]</h3>
          <div className="symbol-badges">
            {nonTerminals.map((nt, i) => (
              <span key={i} className="symbol-badge nonterminal">{nt}</span>
            ))}
          </div>
        </div>

        {/* Terminals */}
        <div className="grammar-section">
          <h3>TERMINALES (Σ) — [{terminals.length}]</h3>
          <div className="symbol-badges">
            {terminals.map((t, i) => (
              <span key={i} className="symbol-badge terminal">{t}</span>
            ))}
          </div>
        </div>

        {/* Productions */}
        <div className="grammar-section">
          <h3>PRODUCCIONES (P) — [{grammar.productions?.length || 0}]</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="production-table" id="production-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producción</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {grammar.productions?.map((prod, i) => (
                  <tr key={i} className="fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <span className="production-id">{prod.id}</span>
                    </td>
                    <td>
                      <span style={{ color: '#b8a0ff' }}>{prod.leftSide}</span>
                      <span className="production-arrow">→</span>
                      <span style={{ color: '#e8e8f0' }}>{prod.rightSide}</span>
                    </td>
                    <td>
                      <span className="production-desc">{prod.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
