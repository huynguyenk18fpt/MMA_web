const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");
// Route GET /admin/users - chỉ admin được phép xem danh sách user
router.get("/", authController.getAllUsers);


module.exports = router;