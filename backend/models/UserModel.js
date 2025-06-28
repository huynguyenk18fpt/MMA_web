const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    trim: true,
    unique: true,
    minlength: 5,
    lowercase: true
  },
  password: {
    type: String,
    trim: true,
    select: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    select: false
  },
  verificationCodeValidation: {
    type: String,
    select: false
  },
  forgotPasswordCode: {
    type: String,
    select: false
  },
  forgotPasswordCodeValidation: {
    type: Number,
    select: false
  },
  loginToken: {
    type: String,
    select: false
  },
  googleId: {
    type: String,
    select: false
  },
  avatar: {
    type: String
  },
  name: {
    type: String,
    required: [true, "Name is required!"]
  },
  role: {
    type: String,
    enum: ["User", "Author", "Admin"],
    default: "User"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active"
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  bannedUntil: Date,
  isMuted: {
    type: Boolean,
    default: false
  },
  muteReason: String,
  mutedUntil: Date,
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
