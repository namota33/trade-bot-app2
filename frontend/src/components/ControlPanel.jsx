// src/components/ControlPanel.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ControlPanel({ backendURL }) {
  const [mode, setMode] = useState(null); // inicialmente null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${backendURL}/api/mode`)
      .then(res => setMode(res.data.mode))
      .catch(console.error);
  }, [backendURL]);

  const toggleMode = async () => {
    const newMode = mode === 'demo' ? 'real' : 'demo';
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/mode`, { mode: newMode });
      setMode(newMode);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Controle</h3>
      {mode ? (
        <>
          <p>Modo atual: <strong>{mode.toUpperCase()}</strong></p>
          <button onClick={toggleMode} disabled={loading}>
            Alternar para {mode === 'demo' ? 'REAL' : 'DEMO'}
          </button>
        </>
      ) : (
        <p>Carregando modo...</p>
      )}
    </div>
  );
}

export default ControlPanel;
