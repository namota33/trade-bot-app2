// src/components/ControlPanel.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ControlPanel({ backendURL }) {
  const [mode, setMode] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ initialBalance: 1000, maxSimultaneousTrades: 1 });
  const [saving, setSaving] = useState(false);

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
      console.error('Erro ao buscar modo:', err);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/status`);
      setStatus(res.data);
    } catch (err) {
      console.error('Erro ao buscar status:', err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setConfig(res.data);
    } catch (err) {
      console.error('Erro ao buscar config:', err);
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

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await axios.post(`${backendURL}/api/config`, {
        initialBalance: Number(config.initialBalance),
        maxSimultaneousTrades: Number(config.maxSimultaneousTrades),
      });
      alert("Configurações salvas com sucesso.");
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Robô de Trade</h2>

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

      {status ? (
        <>
          <p><strong>Status:</strong> {status.running ? '🟢 Rodando' : '🔴 Parado'}</p>
          <p><strong>Pares:</strong> {status.pairs?.join(', ') || 'Nenhum par'}</p>
          <p><strong>Posições abertas:</strong> {status.openPositions || 0}</p>
          <button onClick={toggleRobot} disabled={loading}>
            {status.running ? 'Parar Robô' : 'Iniciar Robô'}
          </button>
        </>
      ) : (
        <p>Carregando status do robô...</p>
      )}

      <hr />

      <h3>Configurações (Modo DEMO)</h3>
      <label>Saldo Inicial Fictício (USDT):</label><br />
      <input
        type="number"
        value={config.initialBalance}
        onChange={e => setConfig({ ...config, initialBalance: e.target.value })}
      /><br /><br />

      <label>Entradas Simultâneas:</label><br />
      <input
        type="number"
        value={config.maxSimultaneousTrades}
        onChange={e => setConfig({ ...config, maxSimultaneousTrades: e.target.value })}
      /><br /><br />

      <button onClick={handleSaveConfig} disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </div>
  );
}

export default ControlPanel;