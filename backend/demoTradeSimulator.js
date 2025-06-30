// backend/utils/demoTradeSimulator.js
const axios = require('axios');
const fs = require('fs');
const configPath = './config.json';

let running = false;
let pairs = [];
let trades = [];
let performance = [];
let balance = 1000;
let openPositions = 0;
let maxSimultaneousTrades = 1;

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

function calculateRSI(closes) {
  if (closes.length < 4) return 50;
  const deltas = closes.slice(1).map((c, i) => c - closes[i]);
  const gains = deltas.filter(d => d > 0).reduce((a, b) => a + b, 0) / 3;
  const losses = deltas.filter(d => d < 0).reduce((a, b) => a + b, 0) / -3;
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function calculateBollinger(closes) {
  const avg = closes.reduce((a, b) => a + b) / closes.length;
  const stdDev = Math.sqrt(closes.map(c => (c - avg) ** 2).reduce((a, b) => a + b) / closes.length);
  return {
    upper: avg + 2 * stdDev,
    lower: avg - 2 * stdDev,
    middle: avg
  };
}

async function analyzeAndTrade(pair) {
  try {
    const { data } = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1m&limit=20`
    );
    const closes = data.map(c => parseFloat(c[4]));
    const rsi = calculateRSI(closes);
    const bb = calculateBollinger(closes);
    const lastClose = closes[closes.length - 1];

    const entryCondition = rsi < 10 && lastClose < bb.lower;

    if (entryCondition && openPositions < maxSimultaneousTrades) {
      const gain = Math.random() < 0.75;
      const result = gain ? 0.03 : -0.015;
      const profit = balance * result;
      balance += profit;
      openPositions++;

      const trade = {
        pair,
        direction: 'LONG',
        entryPrice: parseFloat(lastClose.toFixed(4)),
        result: gain ? 'GAIN' : 'LOSS',
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
  } catch (err) {
    console.error(`Erro ao analisar ${pair}:`, err.message);
  }
}

function loop() {
  if (!running) return;
  loadConfig();
  const selected = pairs.slice(0, 25);
  selected.forEach(analyzeAndTrade);
  setTimeout(loop, 60000); // 1 minuto
}

module.exports = {
  start: () => {
    running = true;
    loadConfig();
    trades = [];
    performance = [];
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