const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { type: String, enum: ["content", "user", "spam", "copyright"], required: true },
  title: String,
  description: String,
  reportedBy: String,
  reportedUser: String,
  contentId: String,
  contentTitle: String,
  status: { type: String, enum: ["pending", "investigating", "resolved"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  createdAt: { type: Date, default: Date.now },
  category: String,
  resolution: String
});

module.exports = mongoose.model("Report", reportSchema);
