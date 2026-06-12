import { useState } from 'react';
import axios from 'axios';
import InputEditor from './components/InputEditor';
import TokenTable from './components/TokenTable';
import DerivationTree from './components/DerivationTree';
import GrammarPanel from './components/GrammarPanel';
import ErrorPanel from './components/ErrorPanel';
import DerivationSteps from './components/DerivationSteps';
import './App.css';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (input) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/parse`, { input });
      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        tokens: [],
        tree: null,
        errors: [error.response?.data?.errors?.[0] || error.message || 'Error de conexión con el servidor'],
        derivationSteps: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>NPC_DIALOG // ANALIZADOR SINTÁCTICO</h1>
        <p className="subtitle">
          ANÁLISIS LÉXICO (JFLEX) + ANÁLISIS SINTÁCTICO (CUP) — ESPECIFICACIÓN RPG NPC DIALOG
        </p>
        <span className="badge">APE 10 // CONTEXTO 4 // G=(V,Σ,P,S)</span>
      </header>

      <div className="main-grid">
        {/* Input Editor - full width */}
        <div className="full-width">
          <InputEditor onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Errors (if any) */}
        {result && !result.success && (
          <ErrorPanel errors={result.errors} />
        )}

        {/* Token Table */}
        <TokenTable tokens={result?.tokens} />

        {/* Derivation Steps */}
        <DerivationSteps steps={result?.derivationSteps} />

        {/* Derivation Tree - full width */}
        <DerivationTree tree={result?.tree} />

        {/* Grammar Panel - full width */}
        <div className="full-width">
          <GrammarPanel />
        </div>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '32px 0 16px',
        color: 'var(--color-text-muted)',
        fontSize: '0.75rem'
      }}>
        <p>APE 10 — Teoría de Autómatas y Computabilidad Avanzada · Ivan Fernandez, Sebastian Narvaez, Juan Alverca · 6to Ciclo</p>
      </footer>
    </div>
  );
}

export default App;
