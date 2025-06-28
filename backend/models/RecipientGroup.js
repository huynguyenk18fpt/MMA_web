const mongoose = require('mongoose');

const recipientGroupSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  label: String,
  count: Number
});

module.exports = mongoose.model("RecipientGroup", recipientGroupSchema);
