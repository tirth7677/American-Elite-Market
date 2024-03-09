const express = require("express");
const router = express.Router();
const { validateToken } = require("../Middleware/validateTokenHandler");
const { followUser, unfollowUser, getdetailofFF} = require("../Controllers/Follow&followingController");

// Follow a user
router.post("/follow", validateToken, followUser);

// Unfollow a user
router.post("/unfollow", validateToken, unfollowUser);

// Retrieve list of users the current user is following
router.get("/detailFF", validateToken, getdetailofFF);

module.exports = router;