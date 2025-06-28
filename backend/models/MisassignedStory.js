const mongoose = require('mongoose');

const misassignedStorySchema = new mongoose.Schema({
  title: String,
  author: String,
  currentGenre: String,
  suggestedGenre: String,
  reason: String,
  confidence: Number
});

module.exports = mongoose.model("MisassignedStory", misassignedStorySchema);
