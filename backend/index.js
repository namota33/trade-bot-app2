const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const statusRoutes = require('./routes/status');
const tradesRoutes = require('./routes/trades');
const configRoutes = require('./routes/config');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Rotas principais
app.use('/api/status', statusRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => {
  res.send('Servidor backend do TradeBot ativo!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
