const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPayment,
  deletePayment,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Payment
router.post("/", authMiddleware, createPayment);

// Get Logged-in User Payments
router.get("/", authMiddleware, getPayments);

// Get Single Payment
router.get("/:id", authMiddleware, getPayment);

// Delete Payment
router.delete("/:id", authMiddleware, deletePayment);

module.exports = router;