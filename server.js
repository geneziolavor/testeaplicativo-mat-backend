require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// String de conexão do MongoDB
const uri = process.env.MONGO_URI || "mongodb+srv://itaprojetotablet:EEXwWI9BWReU8Cyc@clusterappmat.z19hs.mongodb.net/?retryWrites=true&w=majority&appName=Clusterappmat";

// Conectar ao MongoDB
mongoose.connect(uri)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Configura o servidor para servir arquivos estáticos da pasta "frontend"
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'math-competition-fixed.html'));
});

// Rotas da API
app.use('/api', apiRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor.', details: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'math-competition-fixed.html'));
});
});