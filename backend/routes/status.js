const demoSimulator = require('../utils/demoTradeSimulator'); // adicione no topo

router.post('/start', async (req, res) => {
  try {
    running = true;
    pairs = await binanceScanner(); // coleta pares com alto volume
    openPositions = 0;

    // inicia simulação em modo demo
    demoSimulator.start();

    res.json({ success: true, message: 'Robô iniciado', pairs });
  } catch (error) {
    console.error('Erro ao iniciar robô:', error);
    res.status(500).json({ error: 'Falha ao iniciar robô' });
  }
});

router.post('/stop', (req, res) => {
  running = false;
  pairs = [];
  openPositions = 0;

  demoSimulator.stop(); // para a simulação
  res.json({ success: true, message: 'Robô parado' });
});const demoSimulator = require('../utils/demoTradeSimulator'); // adicione no topo

router.post('/start', async (req, res) => {
  try {
    running = true;
    pairs = await binanceScanner(); // coleta pares com alto volume
    openPositions = 0;

    // inicia simulação em modo demo
    demoSimulator.start();

    res.json({ success: true, message: 'Robô iniciado', pairs });
  } catch (error) {
    console.error('Erro ao iniciar robô:', error);
    res.status(500).json({ error: 'Falha ao iniciar robô' });
  }
});

router.post('/stop', (req, res) => {
  running = false;
  pairs = [];
  openPositions = 0;

  demoSimulator.stop(); // para a simulação
  res.json({ success: true, message: 'Robô parado' });
});