const express = require("express");
const router = express.Router();

const isAdmin = require("../middleware/isAdmin"); // <- dòng bạn hỏi
const userController = require("../controllers/userController");
const warningController = require("../controllers/warningController") 

const User = require("../models/UserModel");
// Route GET /admin/ - chỉ admin được phép xem danh sách user
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password_hash");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route GET /admin/users coi danh sách user
router.get("/users/", userController.getAllUsers);

router.get("/warningTemplates/", warningController.getAllWarningTemplate)

router.post("/sentWarning/", warningController.sendWarning)

module.exports = router;
