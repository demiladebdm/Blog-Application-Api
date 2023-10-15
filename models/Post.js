// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;

// const PostSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     desc: {
//       type: String,
//       required: true,
//     },
//     photo: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: false,
//     },
//     categories: {
//       type: String,
//       required: true,
//     },
//     author: { type: Schema.Types.ObjectId, ref: "User", required: false },
//   },
//   { timestamps: true }
// );

// const PostModel = model("Post", PostSchema);

// module.exports = PostModel;

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
    },
    photo: {
      type: String,
      required: false,
    },
    categories: {
      type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
      required: true,
    },
    tags: {
      type: [String],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;

