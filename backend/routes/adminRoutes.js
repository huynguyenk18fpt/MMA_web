const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const isAdmin = require("../middleware/isAdmin"); // <- dòng bạn hỏi

// Route GET /admin/users - chỉ admin được phép xem danh sách user
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password_hash");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
