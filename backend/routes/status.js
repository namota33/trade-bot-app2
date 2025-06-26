// backend/routes/status.js
const express = require('express');
const router = express.Router();
const binanceScanner = require('../utils/binanceScanner');
const demoSimulator = require('../utils/demoTradeSimulator');

let running = false;
let pairs = [];
let openPositions = 0;

router.get('/', (req, res) => {
  res.json({ running, pairs, openPositions });
});

router.post('/start', async (req, res) => {
  try {
    running = true;
    pairs = await binanceScanner(); // coleta os pares com maior volume
    openPositions = 0;
    demoSimulator.start(); // inicia o simulador
    res.json({ success: true, message: 'Robô iniciado', pairs });
  } catch (error) {
    console.error('Erro ao iniciar robô:', error);
    res.status(500).json({ error: 'Falha ao iniciar robô' });
  }
});

router.post('/stop', (req, res) => {
  running = false;
  pairs = [];
  openPositions = 0;
  demoSimulator.stop(); // para o simulador
  res.json({ success: true, message: 'Robô parado' });
});

module.exports = router;