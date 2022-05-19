const jwt = require("jsonwebtoken");

// JWT Secret
const { JWT_SECRET } = require("../config/index");

const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];

  if (!token)
    res.status(401).send({
      message: "No token, authorization denied",
    });
  else {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err)
        res.status(401).send({
          message: "Token is not valid",
        });
      else {
        req.user = user;
        next();
      }
    });
  }
};

module.exports = { auth };
