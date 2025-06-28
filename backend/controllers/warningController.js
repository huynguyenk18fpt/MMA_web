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

exports.sendWarning = async (req, res) => {
  try {
    const { userId, templateId, customContent, sentBy } = req.body;

    // Lấy thông tin user từ userId
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newWarning = new SentWarning({
      userId: user._id,
      userName: user.name, // ghi lại tên tĩnh tại thời điểm gửi
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