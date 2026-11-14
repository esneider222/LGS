const express = require('express');
const { getChat, saveChat, clearChat } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getChat);
router.post('/', saveChat);
router.delete('/', clearChat);

module.exports = router;