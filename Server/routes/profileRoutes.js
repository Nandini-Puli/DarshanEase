const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

module.exports = router;
