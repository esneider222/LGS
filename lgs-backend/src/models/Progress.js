const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    career: { type: String, default: null },
    uni: { type: String, default: null },
    studied: {
      type: Map,
      of: Boolean,
      default: {},
    },
    demo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);