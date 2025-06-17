// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes.jsx'; // importando o arquivo de rotas
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);