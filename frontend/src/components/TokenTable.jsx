export default function TokenTable({ tokens }) {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2>FLUJO DE TOKENS</h2>
        </div>
        <div className="panel-body">
          <div className="empty-state">
            <p>ESPERANDO SECUENCIA DE ENTRADA PARA ANALISIS LEXICO...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>FLUJO DE TOKENS</h2>
        <span className="status-indicator success">
          <span className="status-dot success"></span>
          TOKENS: {tokens.length}
        </span>
      </div>
      <div className="panel-body">
        <div className="token-table-container">
          <table className="token-table" id="token-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Categoría</th>
                <th>Posición</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index} className="fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                  <td className="token-pos">{index + 1}</td>
                  <td>
                    <span className={`token-badge ${token.category?.toLowerCase() || ''}`}>
                      {token.type}
                    </span>
                  </td>
                  <td className="token-value">{token.value}</td>
                  <td>
                    <span style={{
                      color: token.category === 'KEYWORD' ? '#b8a0ff' :
                        token.category === 'LITERAL' ? '#00e88f' : '#ffb347',
                      fontSize: '0.75rem'
                    }}>
                      {token.category === 'KEYWORD' ? 'KEYWORD' :
                        token.category === 'LITERAL' ? 'LITERAL' :
                          token.category === 'DELIMITER' ? 'DELIMITER' : token.category}
                    </span>
                  </td>
                  <td className="token-pos">L{token.line}:C{token.column}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
