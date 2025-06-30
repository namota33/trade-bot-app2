// backend/utils/demoTradeSimulator.js
const fs = require('fs');
const axios = require('axios');
const configPath = './config.json';

let running = false;
let trades = [];
let performance = [];
let balance = 1000;
let openPositions = 0;
let maxSimultaneousTrades = 1;
let pairs = [];

// Carrega config inicial
function loadConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    balance = config.initialBalance || 1000;
    maxSimultaneousTrades = config.maxSimultaneousTrades || 1;
  } catch (err) {
    console.error("Erro ao carregar config:", err.message);
    balance = 1000;
    maxSimultaneousTrades = 1;
  }
}

// Salva trades em arquivo para exibir no frontend
function saveTrades() {
  fs.writeFileSync('./data/trades.json', JSON.stringify(trades, null, 2));
}

// Simula um trade com base no setup
function simulateTrade(pair) {
  const entryPrice = Math.random() * 100 + 10;
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const win = Math.random() < 0.75; // 75% win rate
  const result = win ? 0.03 : -0.015;
  const profit = balance * result;

  balance += profit;
  openPositions++;

  const trade = {
    pair,
    direction,
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    result: win ? 'GAIN' : 'LOSS',
    profit: parseFloat(profit.toFixed(2)),
    timestamp: new Date().toISOString()
  };

  trades.push(trade);

  performance.push({
    date: new Date().toISOString().slice(0, 10),
    profit: parseFloat(profit.toFixed(2))
  });

  saveTrades();
}

function loop() {
  if (!running) return;

  loadConfig();

  const selected = pairs.slice(0, maxSimultaneousTrades);

  for (const p of selected) {
    simulateTrade(p);
  }

  setTimeout(loop, 5000); // Executa a cada 5s
}

module.exports = {
  start: () => {
    running = true;
    trades = [];
    performance = [];
    loadConfig();
    loop();
  },
  stop: () => {
    running = false;
  },
  setPairs: (newPairs) => {
    pairs = newPairs;
  },
  getStatus: () => ({
    running,
    pairs,
    openPositions
  }),
  getTrades: () => trades,
  getPerformance: () => performance,
  reset: () => {
    trades = [];
    performance = [];
    balance = 1000;
    openPositions = 0;
  }
};