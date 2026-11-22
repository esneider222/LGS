const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: { error: 'Demasiadas solicitudes de recuperación. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, me);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;
