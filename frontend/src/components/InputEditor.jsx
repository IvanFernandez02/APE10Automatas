import { useState } from 'react';

const EXAMPLES = [
  {
    label: 'SAY simple',
    code: 'SAY "Bienvenido";'
  },
  {
    label: 'Dos sentencias',
    code: 'SAY "Hola aventurero";\nGIVE "Pocion";'
  },
  {
    label: 'Condicional completo',
    code: 'SAY "Bienvenido";\nIF PLAYER_HAS "Espada" THEN SAY "Ve a luchar" ELSE GIVE "Espada" AND SAY "Toma esto";'
  },
  {
    label: 'Múltiples acciones',
    code: 'IF PLAYER_HAS "Llave" THEN SAY "Puedes pasar" ELSE GIVE "Llave" AND SAY "Necesitas esto" AND GIVE "Mapa";'
  }
];

export default function InputEditor({ onAnalyze, loading }) {
  const [code, setCode] = useState(EXAMPLES[2].code);

  const handleAnalyze = () => {
    if (code.trim() && !loading) {
      onAnalyze(code);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleExample = (example) => {
    setCode(example.code);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyze();
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>TERMINAL DE ENTRADA</h2>
        <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
          CTRL+ENTER PARA ANALIZAR
        </span>
      </div>
      <div className="panel-body">
        <textarea
          id="code-editor"
          className="editor-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="INGRESE SCRIPT RPG AQUÍ...&#10;EJEMPLO: SAY &quot;Bienvenido&quot;;"
          spellCheck={false}
        />
        <div className="editor-actions">
          <button
            id="btn-analyze"
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
          >
            {loading ? <span className="spinner"></span> : ''}
            {loading ? 'ANALIZANDO...' : 'EJECUTAR ANALISIS'}
          </button>
          <button
            id="btn-clear"
            className="btn btn-secondary"
            onClick={handleClear}
          >
            LIMPIAR ENTRADA
          </button>
          <div style={{ flex: 1 }}></div>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="btn btn-example"
              onClick={() => handleExample(ex)}
              title={ex.code}
            >
              [{ex.label}]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
