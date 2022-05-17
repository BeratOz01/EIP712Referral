const router = require("express").Router();

// MongoDB - User Model
const User = require("../models/user");

// Helper functions - Colorful logging
const { success, error } = require("../helpers/index");

// ethereum-js utils for Signature authentication
const { bufferToHex } = require("ethereumjs-util");
const { recoverPersonalSignature } = require("eth-sig-util");

// JWT
const jwt = require("jsonwebtoken");

// JWT secret
const { JWT_SECRET } = require("../config/index");

// POST /api/user
router.post("/", async (req, res) => {
  const { publicAddress } = req.body;
  console.log(publicAddress);
  const user = new User({ publicAddress });

  await user.save((err, user) => {
    if (err) {
      console.log(err);
      error("Error on creating user.");
      res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    } else {
      success("User created successfully.");
      console.log(user);
      res.status(201).json({
        message: "User created",
        user,
      });
    }
  });
});

// GET /api/user/:publicAddress
router.get("/:publicAddress", async (req, res) => {
  const { publicAddress } = req.params;

  User.findOne({ publicAddress: publicAddress }, (err, user) => {
    if (err) {
      error("Error on finding user.");
      res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    } else {
      if (user) {
        success("User found successfully.");
        res.status(200).json({
          message: "User found",
          user,
        });
      } else {
        error("User not found.");
        res.status(404).json({
          message: "User not found",
          user: null,
        });
      }
    }
  });
});

router.post("/:publicAddress/signature", async (req, res) => {
  const { publicAddress } = req.params;

  try {
    const { signature } = req.body;

    if (!signature) throw new Error("Signature is required.");

    User.findOne({ publicAddress: publicAddress }, (err, user) => {
      if (err) {
        error("Error on finding user.");
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      }

      if (user) {
        const msg = `One time nonce for Referral System: ${user.nonce}`;

        const hexMsg = bufferToHex(Buffer.from(msg, "utf-8"));
        const address = recoverPersonalSignature({
          data: hexMsg,
          sig: signature,
        });

        // Check if the address is the same as the one in the request
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          user.nonce = parseInt(Math.floor(Math.random() * 10100001010));

          user.save((err, user) => {
            if (err) {
              console.log(err);
              error("Error on creating user.");
              res.status(500).json({
                message: "Internal Server Error",
                error: err,
              });
            }
          });

          const token = jwt.sign(
            {
              _id: user._id,
              publicAddress: user.publicAddress,
            },
            JWT_SECRET
          );

          success("Sended response with token");

          res.status(200).send({
            error: null,
            token: `Bearer ${token}`,
            user: user,
            message: "Signature verified successfully.",
          });
        } else {
          res.status(401).json({
            message: "Invalid credentials",
            user: null,
          });
        }
      }
    });
  } catch (e) {
    error("Error on finding user.");
    res.status(500).json({
      message: "Internal Server Error",
      error: e,
    });
  }
});

module.exports = router;
