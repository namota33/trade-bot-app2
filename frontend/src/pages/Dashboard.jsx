import { useState, useEffect } from 'react';
import axios from 'axios';
import StatusPanel from '../components/StatusPanel';
import ControlPanel from '../components/ControlPanel';
import ConfigForm from '../components/ConfigForm';
import TradeTable from '../components/TradeTable';
import PerformanceChart from '../components/PerformanceChart';

function Dashboard() {
  const [status, setStatus] = useState(null);
  const [trades, setTrades] = useState([]);
  const [config, setConfig] = useState({});
  const [performance, setPerformance] = useState([]);
  const [isDemo, setIsDemo] = useState(true); // alternador

  const backendURL = 'https://automatic-spoon-p7rpqjj599xc6v7-3000.app.github.dev';

  useEffect(() => {
    axios.get(`${backendURL}/api/status`).then(res => setStatus(res.data));
    axios.get(`${backendURL}/api/trades`).then(res => setTrades(res.data));
    axios.get(`${backendURL}/api/config`).then(res => setConfig(res.data));
    axios.get(`${backendURL}/api/performance`).then(res => setPerformance(res.data));
  }, []);

  const toggleAccountMode = () => {
    setIsDemo(prev => !prev);
    // Aqui você pode opcionalmente notificar o backend sobre a troca de modo
    console.log('Modo trocado para:', !isDemo ? 'Demo' : 'Real');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Robô de Trade</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={toggleAccountMode}>
          Alternar para conta {isDemo ? 'Real' : 'Demo'}
        </button>
        <p>Modo atual: <strong>{isDemo ? 'Demo' : 'Real'}</strong></p>
      </div>

      <StatusPanel status={status} />
      <ControlPanel backendURL={backendURL} />
      <ConfigForm backendURL={backendURL} config={config} />
      <PerformanceChart data={performance} />
      <TradeTable trades={trades} />
    </div>
  );
}

export default Dashboard;