// Mongoose Import
const mongoose = require("mongoose");

// Configuration
const { MONGODB_URL } = require("../config/index");

// Colorful logging
const clc = require("cli-color");

mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) console.error(err);
    else clc.red("MongoDB connected");
  }
);
