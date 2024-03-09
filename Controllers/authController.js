const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const signUp = async (req, res) => {
  try {
    const { username, email, bio, profile_picture, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      bio,
      password: hashedPassword,
      profile_picture,
    });
    const data = await newUser.save();
    const { password: pass, ...rest } = data._doc;
    res.status(201).json({
      success: true,
      message: "New User create succesfully",
      data: {
        rest,
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

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials !",
      });
    }
    const passwordvalid = await bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!passwordvalid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials !",
      });
    }
    const { password: pass, ...rest } = existingUser._doc;
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        uuid: existingUser.uuid,
      },
      process.env.TOKEN_SECERT,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success: true,
      message: "User login successfully",
      data: {
        rest,
        accessToken,
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


module.exports = { signUp,Login };