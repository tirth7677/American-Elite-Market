const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware function to validate JWT token
const validateToken = (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header is present and starts with "Bearer"
    if (authHeader && authHeader.startsWith("Bearer")) {
      // Extract token from Authorization header
      token = authHeader.split(" ")[1];

      // Verify the token using the secret key from environment variables
      jwt.verify(token, process.env.TOKEN_SECERT, (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(401);
          throw new Error("Person is not authorized");
        }
        // Set decoded user information in the request object
        req.user = decoded;
        // Call next middleware
        next();
      });
    } else {
      // If Authorization header is missing or token does not start with "Bearer", return unauthorized error
      res.status(401);
      throw new Error("Person is not authorized or token is missing");
    }
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
};

// Export the validateToken middleware function
module.exports = { validateToken };
