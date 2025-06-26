// utils/marketScanner.js
const axios = require('axios');

async function getTopPairs() {
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'volume_desc',
        per_page: 10,
        page: 1,
        sparkline: false
      }
    });

    // CoinGecko retorna lista com id, symbol e volume. Vamos retornar só os símbolos
    return res.data.map(item => item.symbol.toUpperCase() + '/USDT'); // simula como par da Binance
  } catch (err) {
    console.error('Erro ao buscar dados do CoinGecko:', err.message);
    return [];
  }
}

module.exports = getTopPairs;