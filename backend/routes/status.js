// backend/routes/status.js
const express = require('express');
const router = express.Router();
const getTopPairs = require('../utils/marketScanner'); // usa setup técnico
const demoSimulator = require('../utils/demoTradeSimulator');

let running = false;
let pairs = [];
let openPositions = 0;
let currentMode = 'demo'; // valor inicial por padrão

// Carrega o modo atual a partir do route/mode
const modeRouter = require('./mode');
modeRouter.get('/', (req, res) => {
  currentMode = res.locals?.mode || 'demo';
});

router.get('/', (req, res) => {
  res.json({ running, pairs, openPositions });
});

router.post('/start', async (req, res) => {
  try {
    running = true;
    pairs = await getTopPairs(); // coleta dados reais com base no setup
    openPositions = 0;

    if (currentMode === 'demo') {
      demoSimulator.setPairs(pairs); // passa os pares pro simulador
      demoSimulator.start(); // inicia simulação com base em dados reais
    }

    res.json({
      success: true,
      message: `Robô iniciado no modo ${currentMode.toUpperCase()}`,
      pairs
    });
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