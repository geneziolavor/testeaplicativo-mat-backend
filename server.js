const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://itaprojetotablet:VEcKN7NxbJ1m52sN@cluster0.hmtgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});