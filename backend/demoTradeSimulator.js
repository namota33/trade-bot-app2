// utils/demoTradeSimulator.js
const axios = require('axios');

let running = false;
let trades = [];
let performance = [];
let balance = 1000;
let openPositions = 0;
let pairs = [];

const generateRandomTrade = (pair) => {
  const entryPrice = Math.random() * 100 + 10;
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const gain = Math.random() < 0.8;
  const result = gain ? 0.05 : -0.03;
  const profit = balance * result;

  balance += profit;
  performance.push({
    date: new Date().toISOString().slice(0, 10),
    profit: parseFloat(profit.toFixed(2)),
  });

  return {
    pair,
    direction,
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    result: gain ? 'GAIN' : 'LOSS',
    profit: parseFloat(profit.toFixed(2)),
    timestamp: new Date().toISOString(),
  };
};

const simulate = async () => {
  if (!running) return;

  try {
    const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const topPairs = res.data
      .filter(p => p.symbol.endsWith('USDT'))
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 5);

    pairs = topPairs.map(p => p.symbol);

    for (const p of pairs) {
      const trade = generateRandomTrade(p);
      trades.push(trade);
    }

  } catch (err) {
    console.error('Erro na simulação:', err.message);
  }

  setTimeout(simulate, 5000);
};

module.exports = {
  start: () => { running = true; simulate(); },
  stop: () => { running = false; },
  getStatus: () => ({ running, pairs, openPositions }),
  getTrades: () => trades,
  getPerformance: () => performance,
  reset: () => {
    trades = [];
    performance = [];
    balance = 1000;
    openPositions = 0;
  },
};
