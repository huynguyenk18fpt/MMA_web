const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  recipients: String,
  recipientGroups: [String],
  status: { type: String, enum: ["Sent", "Draft"], default: "Draft" },
  priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
  sentAt: Date,
  readCount: Number,
  createdBy: String
});

module.exports = mongoose.model("Announcement", announcementSchema);
