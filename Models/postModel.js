const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        ref: 'User',
        required:true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);