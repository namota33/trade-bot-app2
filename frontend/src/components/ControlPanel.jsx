// src/components/ControlPanel.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ControlPanel({ backendURL }) {
  const [mode, setMode] = useState(null); // 'demo' ou 'real'
  const [status, setStatus] = useState(null); // status do robô
  const [loading, setLoading] = useState(false);
  const [initialBalance, setInitialBalance] = useState('');
  const [maxEntries, setMaxEntries] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchMode();
    fetchStatus();
    fetchConfig();
  }, [backendURL]);

  const fetchMode = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/mode`);
      setMode(res.data.mode);
    } catch (err) {
      console.error("Erro ao buscar modo:", err);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/status`);
      setStatus(res.data);
    } catch (err) {
      console.error("Erro ao buscar status:", err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setInitialBalance(res.data.initialBalance || '');
      setMaxEntries(res.data.maxSimultaneousEntries || '');
    } catch (err) {
      console.error("Erro ao buscar config:", err);
    }
  };

  const toggleMode = async () => {
    if (!mode) return;
    const newMode = mode === 'demo' ? 'real' : 'demo';
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/mode`, { mode: newMode });
      setMode(newMode);
    } catch (err) {
      console.error('Erro ao alternar modo:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRobot = async () => {
    if (!status) return;
    setLoading(true);
    try {
      const endpoint = status.running ? 'stop' : 'start';
      await axios.post(`${backendURL}/api/status/${endpoint}`);
      await fetchStatus();
    } catch (err) {
      console.error('Erro ao alternar robô:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/config`, {
        initialBalance: parseFloat(initialBalance),
        maxSimultaneousEntries: parseInt(maxEntries)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Erro ao salvar configuração:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Controle do Robô</h3>

      {/* Alternância de modo */}
      {mode ? (
        <>
          <p><strong>Modo atual:</strong> {mode.toUpperCase()}</p>
          <button onClick={toggleMode} disabled={loading}>
            Alternar para {mode === 'demo' ? 'REAL' : 'DEMO'}
          </button>
        </>
      ) : (
        <p>Carregando modo...</p>
      )}

      <hr />

      {/* Início/parada do robô */}
      {status ? (
        <>
          <p><strong>Status do robô:</strong> {status.running ? '🟢 Rodando' : '🔴 Parado'}</p>
          <button onClick={toggleRobot} disabled={loading}>
            {status.running ? 'Parar Robô' : 'Iniciar Robô'}
          </button>
        </>
      ) : (
        <p>Carregando status do robô...</p>
      )}

      <hr />

      {/* Configurações iniciais */}
      <div>
        <h4>Configuração do Modo DEMO</h4>
        <label>Saldo Inicial Fictício: </label>
        <input
          type="number"
          value={initialBalance}
          onChange={e => setInitialBalance(e.target.value)}
        /> <br />
        <label>Entradas Simultâneas: </label>
        <input
          type="number"
          value={maxEntries}
          onChange={e => setMaxEntries(e.target.value)}
        /> <br />
        <button onClick={saveConfig} disabled={loading}>
          Salvar Configurações
        </button>
        {saved && <p style={{ color: 'green' }}>Configurações salvas!</p>}
      </div>
    </div>
  );
}

export default ControlPanel;