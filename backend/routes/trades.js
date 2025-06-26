// routes/trades.js
const express = require('express');
const router = express.Router();
const simulator = require('../utils/demoTradeSimulator');

// Inicia ou para o robô
router.post('/start', (req, res) => {
  simulator.start();
  res.json({ message: 'Robô iniciado' });
});

router.post('/stop', (req, res) => {
  simulator.stop();
  res.json({ message: 'Robô parado' });
});

// Retorna os trades
router.get('/', (req, res) => {
  res.json(simulator.getTrades());
});

// Reseta os dados
router.post('/reset', (req, res) => {
  simulator.reset();
  res.json({ message: 'Dados resetados' });
});

module.exports = router;
