const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  biography: String,
  avatar_url: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Author", authorSchema);