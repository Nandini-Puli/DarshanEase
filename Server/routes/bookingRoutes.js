const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Booking
router.post("/", authMiddleware, createBooking);

// Get Logged-in User Bookings
router.get("/", authMiddleware, getBookings);

// Get Single Booking
router.get("/:id", authMiddleware, getBookingById);

// Update Booking
router.put("/:id", authMiddleware, updateBooking);

// Delete Booking
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;
