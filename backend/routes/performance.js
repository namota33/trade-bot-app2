// backend/routes/performance.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const tradesFile = './data/trades.json';

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(tradesFile)) return res.json([]);

    const trades = JSON.parse(fs.readFileSync(tradesFile, 'utf8'));

    // Agrupa e soma os lucros por dia
    const dailyProfit = {};

    trades.forEach(trade => {
      const date = new Date(trade.timestamp).toISOString().slice(0, 10); // "YYYY-MM-DD"
      if (!dailyProfit[date]) {
        dailyProfit[date] = 0;
      }
      dailyProfit[date] += trade.profit || 0;
    });

    // Converte para formato de gráfico
    const result = Object.entries(dailyProfit).map(([date, profit]) => ({
      date,
      profit: Number(profit.toFixed(2))
    }));

    res.json(result);
  } catch (err) {
    console.error('Erro ao calcular performance:', err);
    res.status(500).json({ error: 'Erro ao calcular performance' });
  }
});

module.exports = router;
