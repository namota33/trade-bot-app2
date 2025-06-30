// backend/utils/marketScanner.js
const axios = require('axios');

async function getTopPairs(limit = 25) {
  try {
    const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const topPairs = res.data
      .filter(p => p.symbol.endsWith('USDT') && !p.symbol.includes('BUSD'))
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, limit);

    return topPairs.map(p => p.symbol);
  } catch (error) {
    console.error('Erro ao buscar pares no marketScanner:', error.message);
    return [];
  }
}

module.exports = getTopPairs;