const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin", "user"),
  getDashboardStats
);

module.exports = router;