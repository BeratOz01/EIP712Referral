const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

// MongoDB connection
require("./db/mongoose");

// Routes
const userRouter = require("./routes/user");

require("./utils/account");

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
