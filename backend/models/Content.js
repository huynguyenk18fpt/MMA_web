const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: { type: String, enum: ["story", "comment"], required: true },
  title: String,
  author: String,
  content: String,
  status: { type: String, enum: ["flagged", "reported", "under_review", "approved"], default: "approved" },
  reason: String,
  reportCount: Number,
  createdAt: { type: Date, default: Date.now },
  lastModified: Date,
  genre: String,
  wordCount: Number,
  moderationNote: String,
  parentContent: String // only used for comments
});

module.exports = mongoose.model("Content", contentSchema);
