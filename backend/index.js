const express = require('express');
const cors = require('cors');
const statusRoutes = require('./routes/status');
// ... outras rotas

const app = express();
const PORT = process.env.PORT; // sem fallback

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/status', statusRoutes);
// ...

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});