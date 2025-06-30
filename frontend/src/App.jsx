// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  // Se estiver no ambiente local (sem proxy), usa URL do backend real
  // Caso contrário (produção), usa '/api' para ativar o proxy da Vercel
  const isLocalhost = window.location.hostname === 'localhost';
  const backendURL = isLocalhost
    ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    : '/api';

  return (
    <Router>
      <div>
        <nav style={{ backgroundColor: '#111', padding: '10px' }}>
          <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Dashboard</Link>
        </nav>
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard backendURL={backendURL} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;