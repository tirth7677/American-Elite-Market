const User = require("../Models/userModel");

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const userId = req.user.uuid; // Convert userId to string

    // Check if the user to follow exists
    const userToFollow = await User.findOne({
      uuid: userIdToFollow,
    }); // Convert userIdToFollow to string
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found",
      });
    }

    // Update the current user's following list
    await User.findOneAndUpdate(
      { uuid: userId },
      { $addToSet: { following: userIdToFollow } }
    ); // Convert userIdToFollow to string

    // Update the user to follow's followers list
    await User.findOneAndUpdate(
      { uuid: userIdToFollow },
      { $addToSet: { followers: userId } }
    );

    res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userIdToUnfollow } = req.body;
    const userId = req.user.uuid; // Convert userId to string

    // Check if the user to unfollow exists
    const userToUnfollow = await User.findOne({ uuid: userIdToUnfollow });
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: "User to unfollow not found",
      });
    }

    // Update the current user's following list
    await User.findOneAndUpdate(
      { uuid: userId },
      { $pull: { following: userIdToUnfollow } }
    );

    // Update the user to unfollow's followers list
    await User.findOneAndUpdate(
      { uuid: userIdToUnfollow },
      { $pull: { followers: userId } }
    );

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

const getdetailofFF = async (req, res) => {
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

    // Retrieve the followers and following UUIDs of the user
    const followers = user.followers;
    const following = user.following;

    res.status(200).json({
      success: true,
      followers: followers,
      following: following,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

module.exports = { followUser, unfollowUser, getdetailofFF };
