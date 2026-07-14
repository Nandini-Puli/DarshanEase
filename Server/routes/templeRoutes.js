const express = require("express");
const router = express.Router();

const {
  addTemple,
  getTemples,
  getTemple,
  updateTemple,
  deleteTemple,
} = require("../controllers/templeController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("organizer"),
  addTemple
);

router.get("/", getTemples);

router.get("/:id", getTemple);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("organizer"),
  updateTemple
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("organizer"),
  deleteTemple
);

module.exports = router;