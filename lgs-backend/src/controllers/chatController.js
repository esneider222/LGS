const Chat = require('../models/Chat');

const MAX_MESSAGES = 40;

exports.getChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }
    res.json({ messages: chat.messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages debe ser un arreglo.' });
    }
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = new Chat({ user: req.user._id });
    }
    chat.messages = messages.slice(-MAX_MESSAGES);
    await chat.save();
    res.json({ messages: chat.messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearChat = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { user: req.user._id },
      { messages: [] },
      { upsert: true }
    );
    res.json({ messages: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};