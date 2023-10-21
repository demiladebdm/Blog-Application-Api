const mongoose = require("mongoose");

const ContactusSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: false,
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: false,
    },
    message: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contactus", ContactusSchema);