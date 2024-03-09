const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

// Function to handle user registration
const signUp = async (req, res) => {
  try {
    // Extracting user data from the request body
    const { username, email, bio, profile_picture, password } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // Create a new user object with hashed password
    const newUser = new User({
      username,
      email,
      bio,
      password: hashedPassword,
      profile_picture,
    });

    // Save the new user to the database
    const data = await newUser.save();
    const { password: pass, ...rest } = data._doc;

    // Respond with success message and user data
    res.status(201).json({
      success: true,
      message: "New User create successfully",
      data: {
        rest,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the registration process
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Function to handle user login
const Login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if a user with the provided email exists in the database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // If user not found, return error
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials !",
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordValid = await bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!passwordValid) {
      // If passwords don't match, return error
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials !",
      });
    }

    // If credentials are valid, generate an access token for the user
    const { password: pass, ...rest } = existingUser._doc;
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        uuid: existingUser.uuid,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with success message, user data, and access token
    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: {
        rest,
        accessToken,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the login process
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Export signUp and Login functions for use in other modules
module.exports = { signUp, Login };