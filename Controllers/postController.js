const Post = require("../Models/postModel");
const User = require("../Models/userModel");
const mongoose = require("mongoose");

const createpost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Create a new post
    const newPost = new Post({
      content: content,
      user: userId, // Assign the userId to the user field of the post
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        user: savedPost.user, // Return user details
        content: savedPost.content, // Return post content
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const viewpost = async (req, res) => {
  try {
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Fetch posts created by the user with the specified userId, and project only the 'content' field
    const posts = await Post.find({ user: userId }, { content: 1, _id: 0 }); // Include only 'content' field and exclude '_id'

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: {
        userId: userId, // Send the UUID of the user
        posts: posts.map((post) => post.content), // Extract 'content' from each post
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const updatepost = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Check if the user has permission to update the post
    const post = await Post.findOne({ _id: postId, user: userId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or user does not have permission to update",
      });
    }

    // Update the content of the post
    post.content = content;
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        postId: post._id,
        content: post.content,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const deletepost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Check if the user has permission to delete the post
    const post = await Post.findOne({ _id: postId, user: userId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or user does not have permission to delete",
      });
    }

    // Delete the post
    await Post.deleteOne({ _id: postId });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: {
        postId: postId,
        postContent: post.content,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const getLatestPosts = async (req, res) => {
  try {
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Find the user document corresponding to the userId
    const user = await User.findOne({ uuid: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get the IDs of users the current user is following
    const followingIds = user.following;

    // Retrieve the latest posts from users the current user is following
    const latestPosts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 }) // Sort posts by createdAt in descending order to get the latest ones
      .limit(10); // Limit the number of posts to fetch, adjust as needed

    res.status(200).json({
      success: true,
      latestPosts: latestPosts,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};


module.exports = {
  createpost,
  viewpost,
  updatepost,
  deletepost,
  getLatestPosts,
};