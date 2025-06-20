// backend/routes/mode.js
const express = require('express');
const router = express.Router();

let currentMode = 'demo'; // valor inicial

router.get('/', (req, res) => {
  res.json({ mode: currentMode });
});

router.post('/', (req, res) => {
  const { mode } = req.body;
  if (mode === 'demo' || mode === 'real') {
    currentMode = mode;
    res.json({ message: `Modo alterado para ${mode}` });
  } else {
    res.status(400).json({ error: 'Modo inválido' });
  }
});

module.exports = router;