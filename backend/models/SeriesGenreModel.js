const mongoose = require("mongoose");

const seriesGenreSchema = new mongoose.Schema({
  series_id: { type: mongoose.Schema.Types.ObjectId, ref: "Series", required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true }
});

seriesGenreSchema.index({ series_id: 1, genre_id: 1 }, { unique: true });

module.exports = mongoose.model("SeriesGenre", seriesGenreSchema);