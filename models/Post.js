const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    categories: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
