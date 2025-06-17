import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function PerformanceChart({ data }) {
  if (!data.length) return <p>Sem dados de performance.</p>;

  return (
    <div>
      <h3>Performance</h3>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="profit" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default PerformanceChart;
