const mongoose = require("mongoose");

// Define the schema for a User
const UserSchema = new mongoose.Schema(
  {
    // Define the username field of the user
    username: {
      type: String, // Username is a string
      unique: true, // Username must be unique
      required: true, // Username is required
    },
    // Define the uuid field of the user
    uuid: {
      type: Number, // UUID is a number
      unique: true, // UUID must be unique
    },
    // Define the email field of the user
    email: {
      type: String, // Email is a string
      required: true, // Email is required
      unique: true, // Email must be unique
      trim: true, // Trim whitespace from email
      lowercase: true, // Convert email to lowercase
      // Validate email format using regex
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Regex pattern for email validation
        },
        message: "Invalid email format", // Error message for invalid email format
      },
    },
    // Define the bio field of the user
    bio: {
      type: String, // Bio is a string
      unique: true, // Bio must be unique
    },
    // Define the profile_picture field of the user
    profile_picture: {
      type: String, // Profile picture is a string (URL or path)
    },
    // Define the password field of the user
    password: {
      type: String, // Password is a string
      required: true, // Password is required
    },
    // Define the followers field of the user, referencing the User model
    followers: [{ type: Number, ref: "User" }],
    // Define the following field of the user, referencing the User model
    following: [{ type: Number, ref: "User" }],
  },
  { timestamps: true } // Include timestamps for createdAt and updatedAt
);

// Pre-save hook to generate auto-incrementing uuid
UserSchema.pre("save", async function (next) {
  // Check if the user is new (not existing)
  if (this.isNew) {
    try {
      // Find the last user in the collection
      const lastUser = await this.constructor.findOne(
        {},
        {},
        { sort: { uuid: -1 } }
      );
      // Increment the last uuid or set to 1 if there's no user yet
      const newUuid = lastUser ? lastUser.uuid + 1 : 1;
      this.uuid = newUuid; // Set the generated uuid to the user
    } catch (error) {
      return next(error); // Return error if there's an issue
    }
  }
  next(); // Continue with the save operation
});

// Export the mongoose model for the User schema
module.exports = mongoose.model("User", UserSchema);