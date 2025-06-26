// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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