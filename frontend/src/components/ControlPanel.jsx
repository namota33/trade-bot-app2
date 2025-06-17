import axios from 'axios';

function ControlPanel({ backendURL }) {
  const start = () => axios.post(`${backendURL}/api/start`);
  const stop = () => axios.post(`${backendURL}/api/stop`);

  return (
    <div>
      <button onClick={start}>Iniciar Robô</button>
      <button onClick={stop}>Parar Robô</button>
    </div>
  );
}

export default ControlPanel;
