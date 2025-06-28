const mongoose = require('mongoose');

const warningTemplateSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  content: String
});

module.exports = mongoose.model("WarningTemplate", warningTemplateSchema);
