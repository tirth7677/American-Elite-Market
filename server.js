const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv");
const authRouter = require("./Routes/authRoutes");
const userRouter = require("./Routes/userRoutes");
const postRouter = require("./Routes/postRouters");
const FollowFollowingRouter = require("./Routes/follower&followingRoutes");

const app = express();

// Enable CORS for all origins
app.use(cors((origin = "http://localhost:3000")));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT;

// Route handlers
app.use("/v1/api/auth", authRouter); // Authentication routes
app.use("/v1/api/user", userRouter); // User-related routes
app.use("/v1/api/post", postRouter); // Post-related routes
app.use("/v1/api/FF", FollowFollowingRouter); // Follower & Following routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // Connect to the database
  connectDb();
  console.log("Connected to the database");
});