const express = require("express");
const router = express.Router();
const { validateToken } = require("../Middleware/validateTokenHandler");
const {
  followUser,
  unfollowUser,
  getdetailofFF,
} = require("../Controllers/Follow&followingController");

// Route to follow a user
router.post("/follow", validateToken, followUser);

// Route to unfollow a user
router.post("/unfollow", validateToken, unfollowUser);

// Route to retrieve details of followers and followings of the current user
router.get("/detailFF", validateToken, getdetailofFF);

// Export the router
module.exports = router;