const mongoose = require("mongoose");

// Define the schema for a Post
const PostSchema = new mongoose.Schema(
  {
    // Define the content field of the post
    content: {
      type: String, // Content is a string
      required: true, // Content is required
    },
    // Define the user field of the post, referencing the User model
    user: {
      type: String, // User is identified by a string (UUID or similar)
      ref: "User", // Reference the User model
      required: true, // User is required
    },
  },
  { timestamps: true } // Include timestamps for createdAt and updatedAt
);

// Export the mongoose model for the Post schema
module.exports = mongoose.model("Post", PostSchema);
