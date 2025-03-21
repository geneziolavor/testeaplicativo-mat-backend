const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Rota para cadastrar um usuário
router.post('/register', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, school, grade, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, school, grade, age });
    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar usuário.', details: error.message });
  }
});

// Rota para fazer login
router.post('/login', [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } else {
      res.status(400).json({ error: 'Email ou senha inválidos.' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao fazer login.', details: error.message });
  }
});

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};

// Rota para atualizar a pontuação
router.put('/update-score', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { score }, { new: true });
    res.status(200).json({ message: 'Pontuação atualizada!', user });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar pontuação.', details: error.message });
  }
});

// Rota para obter o ranking
router.get('/ranking', async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 }).limit(10);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter ranking.', details: error.message });
  }
});

// Middleware para tratamento de erros
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor.', details: err.message });
});

module.exports = router;