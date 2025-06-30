// backend/routes/status.js
const express = require('express');
const router = express.Router();
const getTopPairs = require('../utils/marketScanner');
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
    pairs = await getTopPairs(25); // Varrer os 25 pares de maior volume
    openPositions = 0;
    demoSimulator.setPairs(pairs);
    demoSimulator.start();

    res.json({ success: true, message: 'Robô iniciado com dados reais da Binance', pairs });
  } catch (error) {
    console.error('Erro ao iniciar robô:', error.message);
    res.status(500).json({ error: 'Falha ao iniciar robô' });
  }
});

router.post('/stop', (req, res) => {
  running = false;
  demoSimulator.stop();
  pairs = [];
  openPositions = 0;
  res.json({ success: true, message: 'Robô parado' });
});

module.exports = router;