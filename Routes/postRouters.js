const express = require("express");
const router = express.Router();
const { validateToken } = require("../Middleware/validateTokenHandler");
const { createpost,viewpost,updatepost,deletepost,getLatestPosts } = require("../Controllers/postController");

router.post("/createpost", validateToken, createpost);
router.get("/viewpost", validateToken, viewpost);
router.put("/updatepost", validateToken, updatepost);
router.delete("/deletepost", validateToken, deletepost);
router.get("/latestpost", validateToken, getLatestPosts);

module.exports = router;