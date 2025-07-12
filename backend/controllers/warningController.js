const warningService = require('../services/warningService')
const User = require("../models/UserModel");
const SentWarning = require("../models/SentWarning")

exports.getAllWarningTemplate = async (req, res) => {
    try {
        const template = await warningService.getAllWarningTemplate()
        res.status(200).json({ success: true,  message: "Get all warning template successfully", template })
    } catch (error) {
        console.error("Error fetching warning template:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getAllSentWarning = async (req, res) => {
    try {
        const sentWarning = await warningService.getAllSentWarning()
        res.status(200).json({ success: true,  message: "Get all sent warning successfully", sentWarning })
    } catch (error) {
        console.error("Error fetching sent warning:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const mongoose = require("mongoose");

exports.sendWarning = async (req, res) => {
  try {
    const { userId, templateId, customContent, sentBy } = req.body;

    console.log("userId:", userId, typeof userId)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newWarning = new SentWarning({
      userId: user._id,
      userName: user.name,
      templateId,
      customContent,
      sentBy
    });

    await newWarning.save();

    res.status(201).json({ success: true, message: "Warning sent successfully", warning: newWarning });
  } catch (err) {
    console.error("Error sending warning:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};