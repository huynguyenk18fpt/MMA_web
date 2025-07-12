const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'reported'],
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
  parentContent: {
    type: String,
    default: null,
  },
  moderationNote: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Comment', commentSchema)
