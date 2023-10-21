const mongoose = require("mongoose");

const HabariSchema = new mongoose.Schema(
  {
    transactionid: {
      type: String,
      required: true,
      unique: false,
    },
    terminalid: {
      type: String,
      required: true,
      unique: false,
    },
    merchantid: {
      type: String,
      required: true,
      unique: false,
    },
    merchantname: {
      type: String,
      required: true,
      unique: false,
    },
    pan: {
      type: String,
      required: true,
      unique: false,
    },
    tokentype: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habari", HabariSchema);
