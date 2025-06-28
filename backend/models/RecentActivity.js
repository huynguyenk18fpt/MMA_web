const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
  type: { type: String, enum: ["ban", "approval", "warning", "announcement"] },
  description: String,
  timestamp: String,
  color: String
});

module.exports = mongoose.model("RecentActivity", recentActivitySchema);
