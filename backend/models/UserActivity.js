
const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["login", "story_post", "comment", "report"] },
  description: String,
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
  contentId: String,
  contentTitle: String,
  reportId: String
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
