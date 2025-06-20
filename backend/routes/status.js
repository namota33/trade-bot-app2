// backend/routes/status.js
const express = require('express');
const router = express.Router();

let status = {
  running: false,
  pairs: ['BTC/USDT', 'ETH/USDT'],
  openPositions: 0
};

router.get('/', (req, res) => {
  res.json(status);
});

router.post('/start', (req, res) => {
  status.running = true;
  res.json({ message: 'Robô iniciado' });
});

router.post('/stop', (req, res) => {
  status.running = false;
  res.json({ message: 'Robô parado' });
});

module.exports = router;