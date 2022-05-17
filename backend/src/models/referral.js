/* eslint-disable new-cap */
const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const Referral = new mongoose.model("Referral", referralSchema);

module.exports = Referral;
