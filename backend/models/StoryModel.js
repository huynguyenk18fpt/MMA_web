const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'flagged', 'reported', 'under_review'],
    default: 'approved',
  },
  reason: {
    type: String,
    default: null,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  genre: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  moderationNote: {
    type: String,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'lastModified' },
})

module.exports = mongoose.model('Story', storySchema)
