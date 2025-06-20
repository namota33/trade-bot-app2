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
  const [mode, setMode] = useState('demo'); // 'demo' ou 'real'
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false); // novo estado para saber se o robô está ativo

  const fetchAll = async () => {
    try {
      const [statusRes, tradesRes, configRes, perfRes] = await Promise.all([
        axios.get(`${backendURL}/api/status`),
        axios.get(`${backendURL}/api/trades`),
        axios.get(`${backendURL}/api/config`),
        axios.get(`${backendURL}/api/performance`)
      ]);
      setStatus(statusRes.data);
      setRunning(statusRes.data.running); // pega status do robô
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

  const toggleRobot = async () => {
    try {
      setLoading(true);
      const route = running ? 'stop' : 'start';
      await axios.post(`${backendURL}/api/${route}`);
      setRunning(!running);
    } catch (err) {
      console.error("Erro ao iniciar/parar robô:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Robô de Trade</h1>

      {/* Alternar entre demo/real */}
      <button onClick={toggleMode} disabled={loading} style={{
        marginBottom: 10,
        padding: '10px 20px',
        backgroundColor: mode === 'demo' ? '#007bff' : '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
      }}>
        Alternar para {mode === 'demo' ? 'REAL' : 'DEMO'}
      </button>

      {/* Botão de start/stop */}
      <button onClick={toggleRobot} disabled={loading} style={{
        marginLeft: 10,
        marginBottom: 15,
        padding: '10px 20px',
        backgroundColor: running ? '#dc3545' : '#ffc107',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
      }}>
        {running ? 'Parar Robô' : 'Iniciar Robô'}
      </button>

      <StatusPanel status={status} />
      <ControlPanel backendURL={backendURL} />
      <ConfigForm backendURL={backendURL} config={config} />
      <PerformanceChart data={performance} />
      <TradeTable trades={trades} />
    </div>
  );
}

export default Dashboard;