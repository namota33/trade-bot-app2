const axios = require('axios');
let running = false;
let trades = [];
let performance = [];
let balance = 1000;
let openPositions = 0;
let pairs = [];

const getCandles = async (symbol) => {
  try {
    const res = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol,
        interval: '5m',
        limit: 100
      }
    });
    return res.data.map(candle => ({
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }));
  } catch (err) {
    console.error(`Erro ao buscar candles de ${symbol}:`, err.message);
    return null;
  }
};

const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  let emaArray = [];
  let ema = data.slice(0, period).reduce((sum, v) => sum + v, 0) / period;

  emaArray[period - 1] = ema;

  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emaArray[i] = ema;
  }

  return emaArray;
};

const shouldEnterTrade = async (symbol) => {
  const candles = await getCandles(symbol);
  if (!candles || candles.length < 50) return false;

  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  const rsiSource = closes.slice(-14);
  const gains = rsiSource.map((v, i) => (i === 0 ? 0 : Math.max(v - rsiSource[i - 1], 0)));
  const losses = rsiSource.map((v, i) => (i === 0 ? 0 : Math.max(rsiSource[i - 1] - v, 0)));
  const avgGain = gains.reduce((a, b) => a + b, 0) / 14;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / 14;
  const rs = avgGain / (avgLoss || 1);
  const rsi = 100 - (100 / (1 + rs));

  const ema50 = calculateEMA(closes, 50).at(-1);
  const ema200 = calculateEMA(closes, 200).at(-1);
  const lastClose = closes.at(-1);

  const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const lastVolume = volumes.at(-1);

  const valid = rsi < 30 && ema50 > ema200 && lastVolume > avgVolume;

  if (valid) {
    console.log(`✅ ENTRADA ENCONTRADA: ${symbol} | RSI: ${rsi.toFixed(2)} | EMA50 > EMA200 | VOL OK`);
  } else {
    console.log(`❌ SEM ENTRADA: ${symbol} | RSI: ${rsi.toFixed(2)}, EMA50=${ema50}, EMA200=${ema200}, VOL=${lastVolume}`);
  }

  return valid;
};

const generateRandomTrade = (pair) => {
  const entryPrice = Math.random() * 100 + 10;
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const gain = Math.random() < 0.75;
  const result = gain ? 0.03 : -0.015;
  const profit = balance * result;

  balance += profit;
  performance.push({
    date: new Date().toISOString().slice(0, 10),
    profit: parseFloat(profit.toFixed(2))
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
      .slice(0, 25); // agora top 25

    pairs = topPairs.map(p => p.symbol);

    for (const symbol of pairs) {
      const valid = await shouldEnterTrade(symbol);
      if (valid) {
        const trade = generateRandomTrade(symbol);
        trades.push(trade);
        console.log(`💰 Trade simulado em ${symbol}: ${trade.result} | Lucro: ${trade.profit}`);
      }
    }

  } catch (err) {
    console.error('Erro na simulação:', err.message);
  }

  setTimeout(simulate, 10000); // a cada 10s
};

module.exports = {
  start: () => {
    running = true;
    simulate();
  },
  stop: () => {
    running = false;
  },
  getStatus: () => ({
    running,
    pairs,
    openPositions: 0,
  }),
  getTrades: () => trades,
  getPerformance: () => performance,
  reset: () => {
    trades = [];
    performance = [];
    balance = 1000;
  }
};