// backend/utils/marketScanner.js
const axios = require('axios');

async function getTopPairs() {
  try {
    const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const topPairs = res.data
      .filter(p => p.symbol.endsWith('USDT'))
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 10); // top 10 pares

    return topPairs.map(p => p.symbol);
  } catch (err) {
    console.error('Erro ao buscar pares da Binance:', err.message);
    return [];
  }
}

module.exports = getTopPairs;
