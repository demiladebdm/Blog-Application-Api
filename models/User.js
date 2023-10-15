// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;

// const UserSchema = new Schema(
//   {
//     username: {
//       type: String,
//       min: 3,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     profilePic: {
//       type: String,
//       default: "",
//       required: false,
//     },
//   },
//   { timestamps: true }
// );

// const UserModel = model("User", UserSchema);

// module.exports = UserModel;


const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      min: 3,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      required: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

module.exports = UserModel;
