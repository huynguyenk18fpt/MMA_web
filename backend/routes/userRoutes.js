const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const isAdmin = require("../middleware/isAdmin"); // <- dòng bạn hỏi
const authController = require("../controllers/userController");
// Route GET /admin/users - chỉ admin được phép xem danh sách user
router.get("/", authController.getAllUsers);


module.exports = router;