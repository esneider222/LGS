const express = require('express');
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getProgress);
router.put('/', updateProgress);

module.exports = router;