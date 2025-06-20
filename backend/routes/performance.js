// backend/routes/performance.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    totalTrades: 0,
    winRate: 0,
    profit: 0,
  });
});

module.exports = router;
