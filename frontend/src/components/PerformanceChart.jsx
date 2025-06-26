// src/components/PerformanceChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function PerformanceChart({ data }) {
  if (!data || !data.length) return <p>Sem dados de performance.</p>;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Gráfico de Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="profit" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;