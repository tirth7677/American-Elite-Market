const User = require("../Models/userModel");
const bcrypt = require("bcrypt");

// Function to get details of the current user
const currentUser = async (req, res) => {
  try {
    // Assuming you have extracted user information from the token in a middleware
    // The user information might be available in req.user
    const userId = req.user.id;

    // Find the user by ID and exclude the password field
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Respond with success message and user details
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to update details of the current user
const updateUser = async (req, res) => {
  try {
    // Extract userId from the request
    const userId = req.user.id;
    // Extract update fields from request body
    const { username, email, bio, profile_picture, password } = req.body;
    // Prepare update fields based on whether password is provided or not
    const updateFields = password
      ? {
          username,
          email,
          bio,
          profile_picture,
          password: await bcrypt.hash(password, 10), // Hash the password
        }
      : { username, email, bio, profile_picture };

    // Find the user by ID and update their details
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true, // Return the updated user document
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Respond with success message and updated user details
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to delete the current user
const deleteUser = async (req, res) => {
  try {
    // Extract userId from the request
    const userId = req.user.id;

    // Find the user by ID and delete them
    const user = await User.findByIdAndDelete(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Respond with success message and deleted user details
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully.", user });
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Export the currentUser, updateUser, and deleteUser functions
module.exports = { currentUser, updateUser, deleteUser };
