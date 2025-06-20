function TradeTable({ trades }) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return <p>Nenhuma operação ainda</p>;
  }

  return (
    <div>
      <h3>Histórico de Operações</h3>
      <table>
        <thead>
          <tr>
            <th>Par</th>
            <th>Direção</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              <td>{trade.pair}</td>
              <td>{trade.direction}</td>
              <td>{trade.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TradeTable;
