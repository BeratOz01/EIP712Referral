/* eslint-disable new-cap */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nonce: {
    type: Number,
    required: false,
    default: parseInt(Math.floor(Math.random() * 10100001010)),
  },
  publicAddress: {
    type: String,
    required: true,
    default: "",
    unique: true,
  },
  mail: {
    type: String,
    required: false,
    default: "",
    unique: false,
  },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
