const express = require("express");
const router = express.Router();

const {
  getOrganizers,
  getOrganizer,
  updateOrganizer,
  deleteOrganizer,
  getDashboardStats,
  getBookings,
  getBookingExport,
} = require("../controllers/organizerController");
const { getProfile, updateProfile } = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("organizer"),
  getDashboardStats
);
router.get("/bookings/export", authMiddleware, roleMiddleware("organizer"), getBookingExport);
router.get("/bookings", authMiddleware, roleMiddleware("organizer"), getBookings);
router.get("/profile", authMiddleware, roleMiddleware("organizer"), getProfile);
router.put("/profile", authMiddleware, roleMiddleware("organizer"), updateProfile);
router.patch("/bookings/:id/status", authMiddleware, roleMiddleware("organizer"), require("../controllers/organizerController").updateBookingStatus);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "user"),
  getOrganizers
);

router.get(
  "/:id",
  authMiddleware,
  getOrganizer
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("organizer", "admin"),
  updateOrganizer
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "user"),
  deleteOrganizer
);

module.exports = router;
