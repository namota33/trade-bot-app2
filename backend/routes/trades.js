const express = require('express');
const router = express.Router();

let trades = [];

router.get('/', (req, res) => {
  res.json(trades);
});

router.post('/', (req, res) => {
  const trade = req.body;
  trades.push(trade);
  res.status(201).json({ message: 'Trade registrado!', trade });
});

module.exports = router;
