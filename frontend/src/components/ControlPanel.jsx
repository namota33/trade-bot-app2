import { useState, useEffect } from 'react';
import axios from 'axios';

function ControlPanel({ backendURL }) {
  const [mode, setMode] = useState(null); // 'demo' ou 'real'
  const [status, setStatus] = useState(null); // { running: true/false, ... }
  const [loading, setLoading] = useState(false);

  // Carrega o modo e o status atual ao montar
  useEffect(() => {
    fetchMode();
    fetchStatus();
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
      await fetchStatus(); // Atualiza o status após ação
    } catch (err) {
      console.error('Erro ao alternar robô:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Controle</h3>

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
          <p><strong>Status do robô:</strong> {status.running ? '🟢 Rodando' : '🔴 Parado'}</p>
          <button onClick={toggleRobot} disabled={loading}>
            {status.running ? 'Parar Robô' : 'Iniciar Robô'}
          </button>
        </>
      ) : (
        <p>Carregando status do robô...</p>
      )}
    </div>
  );
}

export default ControlPanel;