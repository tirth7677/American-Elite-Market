const Post = require("../Models/postModel");
const User = require("../Models/userModel");
const mongoose = require("mongoose");

// Function to create a new post
const createpost = async (req, res) => {
  try {
    // Extract content and userId from request body
    const { content } = req.body;
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Create a new post object
    const newPost = new Post({
      content: content,
      user: userId, // Assign the userId to the user field of the post
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    // Respond with success message and post data
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        user: savedPost.user, // Return user details
        content: savedPost.content, // Return post content
      },
    });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to view posts created by the current user
const viewpost = async (req, res) => {
  try {
    // Extract userId of the current user from request
    const userId = req.user.uuid; // Assuming userId is extracted from the token in validateToken middleware

    // Fetch posts created by the user with the specified userId, and project only the 'content' field
    const posts = await Post.find({ user: userId }, { content: 1, _id: 0 }); // Include only 'content' field and exclude '_id'

    // Respond with success message and posts data
    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: {
        userId: userId, // Send the UUID of the user
        posts: posts.map((post) => post.content), // Extract 'content' from each post
      },
    });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to update a post
const updatepost = async (req, res) => {
  try {
    // Extract postId and content from request body
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

    // Respond with success message and updated post data
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        postId: post._id,
        content: post.content,
      },
    });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to delete a post
const deletepost = async (req, res) => {
  try {
    // Extract postId from request body
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

    // Respond with success message and deleted post data
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: {
        postId: postId,
        postContent: post.content,
      },
    });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to get the latest posts from users the current user is following
const getLatestPosts = async (req, res) => {
  try {
    // Extract userId of the current user from request
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

    // Respond with success message and latest posts
    res.status(200).json({
      success: true,
      latestPosts: latestPosts,
    });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Export the functions to be used by other modules
module.exports = {
  createpost,
  viewpost,
  updatepost,
  deletepost,
  getLatestPosts,
};
