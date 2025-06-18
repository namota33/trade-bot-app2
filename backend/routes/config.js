const express = require('express');
const router = express.Router();

let config = {
  modo: 'demo',
  alavancagem: 10,
  entradaSimultanea: 1,
};

router.get('/', (req, res) => {
  res.json(config);
});

router.post('/', (req, res) => {
  config = { ...config, ...req.body };
  res.json({ message: 'Configuração atualizada!', config });
});

module.exports = router;
