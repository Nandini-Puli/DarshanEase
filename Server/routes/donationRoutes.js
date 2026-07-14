const express = require("express");
const router = express.Router();
const {
  createDonation,
  getUserDonations,
  getAllDonations,
  getOrganizerDonations,
} = require("../controllers/donationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, createDonation);
router.get("/user", authMiddleware, getUserDonations);
router.get("/organizer", authMiddleware, roleMiddleware("organizer"), getOrganizerDonations);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllDonations);

module.exports = router;
