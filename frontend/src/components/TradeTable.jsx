function TradeTable({ trades }) {
  if (!trades.length) return <p>Nenhuma operação ainda.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Par</th>
          <th>Tipo</th>
          <th>Resultado</th>
          <th>Lucro</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t, i) => (
          <tr key={i}>
            <td>{t.pair}</td>
            <td>{t.type}</td>
            <td>{t.result}</td>
            <td>{t.profit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TradeTable;
