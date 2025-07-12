const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['content', 'user', 'spam', 'copyright'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content', // cho phép ref đến nhiều collection như Story hoặc Comment
    default: null,
  },
  contentTitle: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'rejected'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  category: {
    type: String,
    required: true,
  },
  resolution: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Report', reportSchema)
