// backend/routes/config.js
const express = require('express');
const fs = require('fs');
const router = express.Router();

const CONFIG_PATH = './config.json';

// Carregar configuração atual
function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { initialBalance: 1000, maxSimultaneousTrades: 1 }; // padrão
  }
}

// Salvar configuração
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// GET
router.get('/', (req, res) => {
  const config = loadConfig();
  res.json(config);
});

// POST
router.post('/', (req, res) => {
  const { initialBalance, maxSimultaneousTrades } = req.body;

  if (
    typeof initialBalance !== 'number' ||
    typeof maxSimultaneousTrades !== 'number'
  ) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const config = { initialBalance, maxSimultaneousTrades };
  saveConfig(config);
  res.json({ success: true, config });
});

module.exports = router;
