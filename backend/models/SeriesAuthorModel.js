const mongoose = require("mongoose");

const seriesAuthorSchema = new mongoose.Schema({
  series_id: { type: mongoose.Schema.Types.ObjectId, ref: "Series", required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true }
});

seriesAuthorSchema.index({ series_id: 1, author_id: 1 }, { unique: true });

module.exports = mongoose.model("SeriesAuthor", seriesAuthorSchema);