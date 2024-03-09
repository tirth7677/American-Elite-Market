const express = require("express");
const router = express.Router();
const {
  currentUser,
  updateUser,
  deleteUser,
} = require("../Controllers/UserController");
const { validateToken } = require("../Middleware/validateTokenHandler");

// Route to get details of the current user
router.get("/currentuser", validateToken, currentUser);

// Route to update details of the current user
router.put("/updateuser", validateToken, updateUser);

// Route to delete the current user
router.delete("/deleteuser", validateToken, deleteUser);

// Export the router
module.exports = router;