
// utils/marketScanner.js
const axios = require('axios');

/**
 * Função para buscar dados de mercado e identificar pares com condições ideais.
 * Setup: RSI(3) < 10, preço abaixo da banda inferior de Bollinger, abaixo da EMA 50.
 */
async function scanForOpportunities() {
  try {
    const candlesRes = await axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=100');
    const klines = candlesRes.data;

    const closes = klines.map(c => parseFloat(c[4]));
    const highs = klines.map(c => parseFloat(c[2]));
    const lows = klines.map(c => parseFloat(c[3]));

    // Cálculo de RSI(3)
    function calculateRSI(values, period = 3) {
      let gains = 0, losses = 0;
      for (let i = values.length - period; i < values.length - 1; i++) {
        const change = values[i + 1] - values[i];
        if (change > 0) gains += change;
        else losses -= change;
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / (avgLoss || 1);
      return 100 - (100 / (1 + rs));
    }

    const rsi = calculateRSI(closes);
    const close = closes[closes.length - 1];

    // Bollinger Bands (20 períodos, desvio padrão 2)
    const period = 20;
    const recent = closes.slice(-period);
    const mean = recent.reduce((a, b) => a + b, 0) / period;
    const variance = recent.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    const lowerBB = mean - 2 * stdDev;

    // EMA 50
    const k = 2 / (50 + 1);
    let ema = closes[0];
    for (let i = 1; i < closes.length; i++) {
      ema = closes[i] * k + ema * (1 - k);
    }

    const setupOK = rsi < 10 && close < lowerBB && close < ema;

    return setupOK ? ['BTCUSDT'] : [];

  } catch (error) {
    console.error('Erro no scanner de mercado:', error.message);
    return [];
  }
}

module.exports = scanForOpportunities;
