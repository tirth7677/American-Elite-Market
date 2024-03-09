const express = require("express");
const router = express.Router();
const { validateToken } = require("../Middleware/validateTokenHandler");
const { createpost, viewpost, updatepost, deletepost, getLatestPosts } = require("../Controllers/postController");

// Route to create a new post
router.post("/createpost", validateToken, createpost);

// Route to view posts created by the current user
router.get("/viewpost", validateToken, viewpost);

// Route to update a post
router.put("/updatepost", validateToken, updatepost);

// Route to delete a post
router.delete("/deletepost", validateToken, deletepost);

// Route to get the latest posts from users the current user is following
router.get("/latestpost", validateToken, getLatestPosts);

// Export the router
module.exports = router;