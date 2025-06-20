function StatusPanel({ status }) {
  if (!status) return <p>Carregando status...</p>;

  const pares = Array.isArray(status.pairs) ? status.pairs.join(', ') : 'Nenhum par';

  return (
    <div>
      <p><strong>Status:</strong> {status.running ? '🟢 Rodando' : '🔴 Parado'}</p>
      <p><strong>Pares:</strong> {pares}</p>
      <p><strong>Posições abertas:</strong> {status.openPositions}</p>
    </div>
  );
}

export default StatusPanel;