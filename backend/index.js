const express = require('express');
const cors = require('cors');
const statusRoutes = require('./routes/status');
const tradesRoutes = require('./routes/trades');
const configRoutes = require('./routes/config');
const performanceRoutes = require('./routes/performance');
const modeRoutes = require('./routes/mode');

const app = express();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/status', statusRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/config', configRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/mode', modeRoutes);

app.get('/', (req, res) => {
  res.send('Backend do Robô de Trade Online!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});