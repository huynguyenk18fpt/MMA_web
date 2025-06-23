const mongoose = require("mongoose");

const authorFollowerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  followed_at: { type: Date, default: Date.now }
});

authorFollowerSchema.index({ user_id: 1, author_id: 1 }, { unique: true });

module.exports = mongoose.model("AuthorFollower", authorFollowerSchema);