import { useState } from 'react';
import axios from 'axios';

function ConfigForm({ backendURL, config }) {
  const [localConfig, setLocalConfig] = useState(config || {});

  const handleChange = (e) => {
    setLocalConfig({ ...localConfig, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.post(`${backendURL}/api/config`, localConfig);
  };

  return (
    <div>
      <h3>Configurações</h3>
      <input name="maxPairs" placeholder="Pares" value={localConfig.maxPairs || ''} onChange={handleChange} />
      <input name="allocation" placeholder="Alocação (%)" value={localConfig.allocation || ''} onChange={handleChange} />
      <input name="leverage" placeholder="Alavancagem" value={localConfig.leverage || ''} onChange={handleChange} />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}

export default ConfigForm;
