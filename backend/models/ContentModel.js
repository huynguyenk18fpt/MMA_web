const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const contentSchema = new Schema({
  type: { type: String, enum: ["story", "comment"], required: true },
  title: String,
  author: { type: Types.ObjectId, ref: "User", required: true },  // Liên kết đến người dùng
  content: String,
  status: { 
    type: String, 
    enum: ["flagged", "reported", "under_review", "approved", "removed"], 
    default: "approved" 
  },
  reason: String,
  reportCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  genre: { type: Types.ObjectId, ref: "Genre" }, // Liên kết đến Genre
  wordCount: Number,
  moderationNote: String,
  parentContent: { type: Types.ObjectId, ref: "Content" } // Chỉ áp dụng nếu là comment
});

module.exports = mongoose.model("Content", contentSchema);
