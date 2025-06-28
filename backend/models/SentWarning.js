const mongoose = require('mongoose');

const sentWarningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: String, // giữ tĩnh tại thời điểm gửi
  templateId: String,
  customContent: String,
  sentAt: { type: Date, default: Date.now },
  sentBy: String
});

module.exports = mongoose.model("SentWarning", sentWarningSchema);
