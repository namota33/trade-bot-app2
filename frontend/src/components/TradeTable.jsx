// src/components/TradeTable.jsx
import React from 'react';

function TradeTable({ trades }) {
  if (!trades?.length) return <p>Sem trades registrados ainda.</p>;

  return (
    <div>
      <h3>Trades simulados</h3>
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Par</th>
            <th>Direção</th>
            <th>Preço de Entrada</th>
            <th>Resultado</th>
            <th>Lucro/Prejuízo</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              <td>{trade.pair}</td>
              <td>{trade.direction}</td>
              <td>{trade.entryPrice}</td>
              <td style={{ color: trade.result === 'GAIN' ? 'green' : 'red' }}>{trade.result}</td>
              <td>{trade.profit}</td>
              <td>{new Date(trade.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TradeTable;