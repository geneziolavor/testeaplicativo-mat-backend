require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

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

// Rota para a página inicial
app.get('/', (req, res) => {
  res.send('Bem-vindo à aplicação!');
});

// Rotas da API
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});