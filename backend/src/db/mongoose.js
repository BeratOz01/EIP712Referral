// Mongoose Import
const mongoose = require("mongoose");

// Configuration
const { MONGODB_URL } = require("../config/index");

// Helpers
const { success, error } = require("../helpers/index");

mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) error(err);
    else success("MongoDB connected");
  }
);
