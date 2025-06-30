const express = require('express');
const router = express.Router();
const getTopPairs = require('../utils/marketScanner');
const demoSimulator = require('../utils/demoTradeSimulator');

let running = false;

router.get('/', (req, res) => {
  const status = demoSimulator.getStatus(); // ✅ agora envia os pares ativos
  res.json(status);
});

router.post('/start', async (req, res) => {
  try {
    running = true;
    const pairs = await getTopPairs(); // top 25 moedas
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
  res.json({ success: true, message: 'Robô parado' });
});

module.exports = router;