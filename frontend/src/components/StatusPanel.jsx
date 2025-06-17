function StatusPanel({ status }) {
  if (!status) return <p>Carregando status...</p>;
  return (
    <div>
      <p><strong>Status:</strong> {status.running ? '🟢 Rodando' : '🔴 Parado'}</p>
      <p><strong>Pares:</strong> {status.pairs.join(', ')}</p>
      <p><strong>Posições abertas:</strong> {status.openPositions}</p>
    </div>
  );
}

export default StatusPanel;
