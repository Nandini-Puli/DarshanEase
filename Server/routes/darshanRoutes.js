const express = require("express");
const router = express.Router();

const {
  getDarshans,
  getOrganizerDarshans,
  getDarshan,
  getTempleDarshans,
  createDarshan,
  updateDarshan,
  deleteDarshan,
} = require("../controllers/darshanController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public Routes
router.get("/", getDarshans);

router.get("/temple/:templeId", getTempleDarshans);
router.get(
  "/organizer/mydarshans",
  authMiddleware,
  roleMiddleware("organizer"),
  getOrganizerDarshans
);
router.get("/:id", getDarshan);

// Organizer Routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("organizer"),
  createDarshan
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("organizer"),
  updateDarshan
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("organizer"),
  deleteDarshan
);

module.exports = router;
