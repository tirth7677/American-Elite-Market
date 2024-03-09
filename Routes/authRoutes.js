const express = require("express");
const router = express.Router();
const { signUp, Login } = require("../Controllers/authController");

router.post("/signup", signUp);
router.post("/login", Login);

module.exports = router;