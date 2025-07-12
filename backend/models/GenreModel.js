const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, unique: true, unique: true },
  description: String,
  storyCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Genre", genreSchema);
