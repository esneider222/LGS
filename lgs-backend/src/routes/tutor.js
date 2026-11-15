const express = require('express');
const rateLimit = require('express-rate-limit');
const { tutorStatus, askTutor } = require('../controllers/tutorController');
const { protect } = require('../middleware/auth');

const router = express.Router();
const tutorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Alcanzaste el límite temporal de consultas al tutor. Inténtalo más tarde.' },
});

router.use(protect);
router.get('/', tutorStatus);
router.post('/', tutorLimiter, askTutor);

module.exports = router;
