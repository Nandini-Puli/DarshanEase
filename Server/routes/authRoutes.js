const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/organizer/register", authController.registerOrganizer);

router.post("/organizer/login", authController.loginOrganizer);

router.post("/logout", authController.logout);

module.exports = router;