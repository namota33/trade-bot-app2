const express = require('express');
const cors = require('cors');

const statusRoutes = require('./routes/status');
const configRoutes = require('./routes/config');
const tradesRoutes = require('./routes/trades');
const performanceRoutes = require('./routes/performance');
const modeRoutes = require('./routes/mode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas principais da API
app.use('/api/status', statusRoutes);
app.use('/api/config', configRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/mode', modeRoutes);

// Rota padrão (opcional)
app.get('/', (req, res) => {
  res.send('API do Robô de Trade está ativa!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});