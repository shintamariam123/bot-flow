const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  startBotTitle: { type: String, unique: true },
  nodes: Array,
  edges: Array,
}, { timestamps: true });

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;
