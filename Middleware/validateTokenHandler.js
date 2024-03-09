const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const validateToken = (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_SECERT, (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(401);
          throw new Error("Person is not authorized");
        }
        req.user = decoded;
        next();
      });
    } else {
      res.status(401);
      throw new Error("Person is not authorized or token is missing");
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

module.exports = { validateToken };