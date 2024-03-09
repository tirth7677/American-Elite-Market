const User = require("../Models/userModel");
const bcrypt = require("bcrypt");

const currentUser = async (req, res) => {
  try {
    // Assuming you have extracted user information from the token in a middleware
    // The user information might be available in req.user
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, bio, profile_picture, password } = req.body;
    const updateFields = password
      ? {
          username,
          email,
          bio,
          profile_picture,
          password: await bcrypt.hash(password, 10),
        }
      : { username, email, bio, profile_picture };

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID and delete them
    const user = await User.findByIdAndDelete(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully.", user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

module.exports = { currentUser, updateUser, deleteUser };
