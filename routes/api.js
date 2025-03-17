const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Rota para cadastrar um usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, school, grade, age } = req.body;
        const user = new User({ name, email, password, school, grade, age });
        await user.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

// Rota para fazer login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: 'Login realizado com sucesso!', user });
        } else {
            res.status(400).json({ error: 'Email ou senha inválidos.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Erro ao fazer login.' });
    }
});

// Rota para atualizar a pontuação
router.put('/update-score', async (req, res) => {
    try {
        const { userId, score } = req.body;
        const user = await User.findByIdAndUpdate(userId, { score }, { new: true });
        res.status(200).json({ message: 'Pontuação atualizada!', user });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar pontuação.' });
    }
});

// Rota para obter o ranking
router.get('/ranking', async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao obter ranking.' });
    }
});

module.exports = router;