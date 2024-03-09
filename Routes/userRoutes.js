const express = require("express");
const router = express.Router();
const {
  currentUser,
  updateUser,
  deleteUser,
} = require("../Controllers/UserController");
const { validateToken } = require("../Middleware/validateTokenHandler");

router.get("/currentuser", validateToken, currentUser);
router.put("/updateuser", validateToken, updateUser);
router.delete("/deleteuser", validateToken, deleteUser);

module.exports = router;