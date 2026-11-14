const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
}

exports.register = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }
    const exists = await User.findOne({ username: username.trim().toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'Ese usuario ya existe.' });
    }
    const user = await User.create({
      username: username.trim().toLowerCase(),
      password,
      name: name || username,
    });
    await Progress.create({ user: user._id });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }
    const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, username: user.username, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};