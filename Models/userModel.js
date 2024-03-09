const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    uuid: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    bio: {
      type: String,
      unique: true,
    },
    profile_picture: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [{ type: Number, ref: "User" }],
    following: [{ type: Number, ref: "User" }],
  },
  { timestamps: true }
);

// Pre-save hook to generate auto-incrementing uuid
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const lastUser = await this.constructor.findOne(
        {},
        {},
        { sort: { uuid: -1 } }
      ); // Find the last user
      const newUuid = lastUser ? lastUser.uuid + 1 : 1; // Increment the last uuid or set to 1 if there's no user yet
      this.uuid = newUuid;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
