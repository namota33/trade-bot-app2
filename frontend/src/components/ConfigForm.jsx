// src/components/ConfigForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ConfigForm({ backendURL, config }) {
  const [initialBalance, setInitialBalance] = useState(config.initialBalance || 1000);
  const [maxSimultaneousTrades, setMaxSimultaneousTrades] = useState(config.maxSimultaneousTrades || 1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setInitialBalance(config.initialBalance || 1000);
    setMaxSimultaneousTrades(config.maxSimultaneousTrades || 1);
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await axios.post(`${backendURL}/api/config`, {
        initialBalance: Number(initialBalance),
        maxSimultaneousTrades: Number(maxSimultaneousTrades)
      });
      setMessage('Configurações salvas com sucesso!');
    } catch (err) {
      console.error(err);
      setMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>Configurações do Robô</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Saldo Inicial (modo demo):</label><br />
          <input
            type="number"
            value={initialBalance}
            onChange={e => setInitialBalance(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Entradas Simultâneas:</label><br />
          <input
            type="number"
            value={maxSimultaneousTrades}
            onChange={e => setMaxSimultaneousTrades(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ConfigForm;
