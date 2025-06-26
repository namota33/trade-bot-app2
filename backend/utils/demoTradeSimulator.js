const fs = require('fs');
const axios = require('axios');
const configPath = './config.json';

let running = false;
let pairs = [];
let trades = [];
let performance = [];
let balance = 1000;
let openPositions = 0;
let maxSimultaneousTrades = 1;

// Carrega configuração inicial
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

function saveTrades() {
  fs.writeFileSync('./data/trades.json', JSON.stringify(trades, null, 2));
}

// Simula trade com 75~80% winrate baseado no setup
function simulateTrade(pair) {
  const entryPrice = Math.random() * 100 + 10;
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';

  // 75 a 80% winrate usando lógica randômica ajustada
  const winRate = 0.75 + Math.random() * 0.05; // entre 0.75 e 0.80
  const gain = Math.random() < winRate;

  const result = gain ? 0.03 : -0.015; // 3% gain, 1.5% loss
  const profit = balance * result;

  balance += profit;
  openPositions++;

  const trade = {
    pair,
    direction,
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    result: gain ? 'GAIN' : 'LOSS',
    profit: parseFloat(profit.toFixed(2)),
    timestamp: new Date().toISOString()
  };

  trades.push(trade);

  const dateKey = new Date().toISOString().slice(0, 10);
  performance.push({
    date: dateKey,
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

  setTimeout(loop, 5000); // repete a cada 5 segundos
}

module.exports = {
  start: () => {
    running = true;
    loadConfig();
    trades = [];
    performance = [];
    openPositions = 0;
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