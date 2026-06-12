export default function DerivationSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>TRAZA DE DERIVACION</h2>
        <span className="status-indicator success">
          <span className="status-dot success"></span>
          PASOS: {steps.length}
        </span>
      </div>
      <div className="panel-body" style={{ padding: 0 }}>
        <div className="derivation-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className="derivation-step fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="derivation-step-number">{index + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
