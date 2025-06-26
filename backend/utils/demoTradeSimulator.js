// utils/demoTradeSimulator.js
const axios = require('axios');
const fs = require('fs');
const path = './data/trades.json';

let running = false;
let trades = [];
let balance = 1000;
let config = { initialBalance: 1000, maxSimultaneousTrades: 1 };
let openPositions = [];

const loadConfig = () => {
  try {
    const data = fs.readFileSync('./config.json', 'utf8');
    config = JSON.parse(data);
    balance = config.initialBalance;
  } catch {
    config = { initialBalance: 1000, maxSimultaneousTrades: 1 };
    balance = 1000;
  }
};

const fetchTopPairs = async () => {
  const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
  return res.data
    .filter(p => p.symbol.endsWith('USDT'))
    .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, 10)
    .map(p => p.symbol);
};

const getCurrentPrice = async (symbol) => {
  const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  return parseFloat(res.data.price);
};

const openTrade = async (symbol) => {
  const entryPrice = await getCurrentPrice(symbol);
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const stop = direction === 'LONG'
    ? entryPrice * 0.985
    : entryPrice * 1.015;
  const target = direction === 'LONG'
    ? entryPrice * 1.03
    : entryPrice * 0.97;

  openPositions.push({
    symbol,
    entryPrice,
    direction,
    stop,
    target,
    timestamp: Date.now()
  });
};

const checkPositions = async () => {
  const now = Date.now();
  const closedTrades = [];

  for (let i = openPositions.length - 1; i >= 0; i--) {
    const pos = openPositions[i];
    const currentPrice = await getCurrentPrice(pos.symbol);
    let result = null;

    if (
      (pos.direction === 'LONG' && currentPrice >= pos.target) ||
      (pos.direction === 'SHORT' && currentPrice <= pos.target)
    ) {
      result = 'GAIN';
    } else if (
      (pos.direction === 'LONG' && currentPrice <= pos.stop) ||
      (pos.direction === 'SHORT' && currentPrice >= pos.stop)
    ) {
      result = 'LOSS';
    }

    if (result) {
      const profit = result === 'GAIN'
        ? balance * 0.03
        : -balance * 0.015;

      balance += profit;
      const trade = {
        ...pos,
        exitPrice: currentPrice,
        result,
        profit: parseFloat(profit.toFixed(2)),
        timestamp: new Date().toISOString()
      };
      trades.push(trade);
      closedTrades.push(trade);
      openPositions.splice(i, 1);
    }
  }

  if (closedTrades.length > 0) {
    fs.writeFileSync(path, JSON.stringify(trades, null, 2));
  }
};

const simulate = async () => {
  if (!running) return;

  loadConfig();

  if (openPositions.length < config.maxSimultaneousTrades) {
    const topPairs = await fetchTopPairs();
    for (let pair of topPairs) {
      if (openPositions.length < config.maxSimultaneousTrades) {
        await openTrade(pair);
      } else break;
    }
  }

  await checkPositions();
  setTimeout(simulate, 5000);
};

module.exports = {
  start: () => {
    running = true;
    loadConfig();
    trades = [];
    openPositions = [];
    simulate();
  },
  stop: () => {
    running = false;
  },
  getStatus: () => ({
    running,
    openPositions: openPositions.length,
  }),
  getTrades: () => trades,
  reset: () => {
    trades = [];
    openPositions = [];
    balance = config.initialBalance;
    fs.writeFileSync(path, JSON.stringify([], null, 2));
  }
};