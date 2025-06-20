import { useState, useEffect } from 'react';
import axios from 'axios';
import StatusPanel from '../components/StatusPanel';
import ControlPanel from '../components/ControlPanel';
import ConfigForm from '../components/ConfigForm';
import TradeTable from '../components/TradeTable';
import PerformanceChart from '../components/PerformanceChart';

function Dashboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [status, setStatus] = useState(null);
  const [trades, setTrades] = useState([]);
  const [config, setConfig] = useState({});
  const [performance, setPerformance] = useState([]);
  const [mode, setMode] = useState('demo');
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    try {
      const [statusRes, tradesRes, configRes, perfRes] = await Promise.all([
        axios.get(`${backendURL}/api/status`),
        axios.get(`${backendURL}/api/trades`),
        axios.get(`${backendURL}/api/config`),
        axios.get(`${backendURL}/api/performance`)
      ]);
      setStatus(statusRes.data);
      setTrades(tradesRes.data);
      setConfig(configRes.data);
      setPerformance(perfRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleMode = async () => {
    const newMode = mode === 'demo' ? 'real' : 'demo';
    try {
      setLoading(true);
      await axios.post(`${backendURL}/api/mode`, { type: newMode });
      setMode(newMode);
    } catch (error) {
      console.error('Erro ao trocar modo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Robô de Trade</h1>

      <StatusPanel status={status} />

      <h2>Controle</h2>
      <p><strong>Modo atual:</strong> {mode.toUpperCase()}</p>
      <button onClick={toggleMode} disabled={loading} style={{
        marginBottom: 15,
        padding: '10px 20px',
        backgroundColor: mode === 'demo' ? '#007bff' : '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
      }}>
        Alternar para {mode === 'demo' ? 'REAL' : 'DEMO'}
      </button>
      <ControlPanel backendURL={backendURL} />

      <h2>Configurações</h2>
      <ConfigForm backendURL={backendURL} config={config} />

      <h2>Performance</h2>
      <PerformanceChart data={performance} />

      <h2>Operações</h2>
      <TradeTable trades={trades} />
    </div>
  );
}

export default Dashboard;