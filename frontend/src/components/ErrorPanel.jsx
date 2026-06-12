export default function ErrorPanel({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="panel full-width">
      <div className="panel-header">
        <h2>EXCEPCIONES DE SINTAXIS</h2>
        <span className="status-indicator error">
          <span className="status-dot error"></span>
          ERRORES: {errors.length}
        </span>
      </div>
      <div className="panel-body">
        <ul className="error-list" id="error-list">
          {errors.map((error, index) => (
            <li key={index} className="error-item fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="error-icon">[ERR]</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
