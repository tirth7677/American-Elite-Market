const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv");
const authRouter = require("./Routes/authRoutes");
const userRouter = require("./Routes/userRoutes");
const postRouter = require("./Routes/postRouters");
const FollowFollowingRouter = require("./Routes/follower&followingRoutes");

const app = express();
app.use(cors((origin = "http://localhost:3000")));
app.use(express.json());
dotenv.config();

const port = process.env.PORT;

app.use("/v1/api/auth", authRouter);
app.use("/v1/api/user", userRouter);
app.use("/v1/api/post", postRouter);
app.use("/v1/api/FF", FollowFollowingRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDb();
  console.log("Connected to the database");
});
