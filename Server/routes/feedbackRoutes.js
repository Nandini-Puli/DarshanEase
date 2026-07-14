const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getTempleFeedback,
  getAllFeedback,
  getOrganizerFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, createFeedback);
router.get("/temple/:templeId", getTempleFeedback);
router.get("/organizer", authMiddleware, roleMiddleware("organizer"), getOrganizerFeedback);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllFeedback);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteFeedback);

module.exports = router;
