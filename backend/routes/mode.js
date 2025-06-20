const express = require('express');
const router = express.Router();
const { getMode, setMode } = require('../mode');

router.get('/', (req, res) => {
  res.json({ mode: getMode() });
});

router.post('/', (req, res) => {
  const { mode } = req.body;
  if (['demo', 'real'].includes(mode)) {
    setMode(mode);
    res.json({ success: true, mode });
  } else {
    res.status(400).json({ success: false, error: 'Modo inválido' });
  }
});

module.exports = router;
