const express = require("express");
const router = express.Router();

const isAdmin = require("../middleware/isAdmin"); // <- dòng bạn hỏi
const userController = require("../controllers/userController");
const warningController = require("../controllers/warningController") 
const userActivityController = require("../controllers/userActivityController")
const reportController = require("../controllers/reportController.js")
const muteAndBanController = require("../controllers/muteAndBanController.js")
const contentController = require("../controllers/contentController.js")
const annoucementController = require("../controllers/annoucementController.js")


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
// Route GET /admin/users/ coi danh sách user
router.get("/users/", userController.getAllUsers);

// Route này dùng để làm việc với cảnh cáo
router.get("/warningTemplates/", warningController.getAllWarningTemplate)
router.get("/getSentWarning/", warningController.getAllSentWarning)
router.post("/sentWarning/", warningController.sendWarning)

//Route này dùng để làm việc với check hoạt động của user được select với hệ thống
router.get("/userActivity/", userActivityController.getUserActivities);

//Route này dùng để làm việc với report
router.get("/report/", reportController.getAllReports)
router.put("/report/:id", reportController.updateReportStatus)


//Route này dùng để làm việc với mute và ban Users
router.get("/reportWithExtend/", muteAndBanController.getAllReportWithExtend)
router.put("/mute/:userId/", muteAndBanController.updateMuteStatus)
router.put("/ban/:userId", muteAndBanController.updateBanStatus)

//Route này dùng để làm việc với xử lý content
router.get("/content/", contentController.getAllContent)
router.put("/content/:id", contentController.updateContentById)

//Route này dùng để làm việc với thông báo toàn server
router.get("/announcement/", annoucementController.getAllAnnoucement)
router.get("/announcement/recipient-groups/", annoucementController.getRecipientGroups)
router.post("/announcement/", annoucementController.createAnnoucement)

module.exports = router;
