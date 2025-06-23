const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 255 },
  description: String,
  cover_image: String,
  status: { type: String, enum: ["ongoing", "completed", "hiatus"], default: "ongoing" },
  type: { type: String, enum: ["manga", "light_novel"], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Series", seriesSchema);