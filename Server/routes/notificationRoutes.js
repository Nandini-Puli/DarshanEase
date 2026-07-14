const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
  broadcastNotification,
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getUserNotifications);
router.put("/:id", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteNotification);
router.post("/", authMiddleware, roleMiddleware("admin", "organizer"), createNotification);
router.post("/broadcast", authMiddleware, roleMiddleware("admin"), broadcastNotification);

module.exports = router;
