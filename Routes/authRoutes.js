const express = require("express");
const router = express.Router();
const { signUp, Login } = require("../Controllers/authController");

// Route to handle user signup
router.post("/signup", signUp);

// Route to handle user login
router.post("/login", Login);

// Export the router
module.exports = router;