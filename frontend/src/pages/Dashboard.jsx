import { useState, useEffect } from 'react';
import axios from 'axios';
import TradeTable from '../components/TradeTable';
import PerformanceChart from '../components/PerformanceChart';

function Dashboard({ backendURL }) {
  const [mode, setMode] = useState(null);
  const [status, setStatus] = useState(null);
  const [config, setConfig] = useState({ initialBalance: 1000, maxSimultaneousTrades: 1 });
  const [trades, setTrades] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [modeRes, statusRes, configRes, tradesRes, perfRes] = await Promise.all([
        axios.get(`${backendURL}/api/mode`),
        axios.get(`${backendURL}/api/status`),
        axios.get(`${backendURL}/api/config`),
        axios.get(`${backendURL}/api/trades`),
        axios.get(`${backendURL}/api/performance`),
      ]);
      setMode(modeRes.data.mode);
      setStatus(statusRes.data);
      setConfig(configRes.data);
      setTrades(tradesRes.data);
      setPerformance(perfRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err.message);
    }
  };

  const toggleMode = async () => {
    const newMode = mode === 'demo' ? 'real' : 'demo';
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/mode`, { mode: newMode });
      setMode(newMode);
    } catch (err) {
      console.error("Erro ao trocar modo:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRobot = async () => {
    if (!status) return;
    const endpoint = status.running ? 'stop' : 'start';
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/status/${endpoint}`);
      await fetchAll();
    } catch (err) {
      console.error("Erro ao iniciar/parar robô:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const saveConfig = async () => {
    try {
      await axios.post(`${backendURL}/api/config`, config);
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar config:", err.message);
    }
  };

  return (
    <div>
      <h1>Robô de Trade</h1>

      {/* Modo */}
      <div>
        <p><strong>Modo atual:</strong> {mode?.toUpperCase() || 'Carregando...'}</p>
        <button onClick={toggleMode} disabled={loading}>
          Alternar para {mode === 'demo' ? 'REAL' : 'DEMO'}
        </button>
      </div>

      <hr />

      {/* Robô status */}
      <div>
        <p><strong>Status:</strong> {status?.running ? '🟢 Rodando' : '🔴 Parado'}</p>
        <button onClick={toggleRobot} disabled={loading}>
          {status?.running ? 'Parar Robô' : 'Iniciar Robô'}
        </button>
      </div>

      <hr />

      {/* Configurações */}
      <div>
        <h3>Configuração</h3>
        <label>
          Saldo inicial fictício:
          <input
            type="number"
            name="initialBalance"
            value={config.initialBalance}
            onChange={handleConfigChange}
          />
        </label>
        <br />
        <label>
          Entradas simultâneas:
          <input
            type="number"
            name="maxSimultaneousTrades"
            value={config.maxSimultaneousTrades}
            onChange={handleConfigChange}
          />
        </label>
        <br />
        <button onClick={saveConfig}>Salvar Configuração</button>
      </div>

      <hr />

      {/* Mostrar moedas que o robô está analisando */}
      {status?.running && status.pairs?.length > 0 && (
        <div>
          <h3>⛏️ Pares que estão sendo varridos:</h3>
          <ul>
            {status.pairs.map((pair, index) => (
              <li key={index}>{pair}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mensagem aguardando entrada */}
      {trades.length === 0 && (
        <p style={{ fontStyle: 'italic', color: 'gray' }}>
          ⏳ Aguardando condições perfeitas para entrada...
        </p>
      )}

      <hr />

      <PerformanceChart data={performance} />
      <TradeTable trades={trades} />
    </div>
  );
}

export default Dashboard;