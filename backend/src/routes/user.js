const router = require("express").Router();

// MongoDB - User Model
const User = require("../models/user");
const Referral = require("../models/referral");

// Helper functions - Colorful logging
const { success, error, info, signData } = require("../helpers/index");

// Account
const { account, provider } = require("../utils/account");

// ethereum-js utils for Signature authentication
const { bufferToHex } = require("ethereumjs-util");
const { recoverPersonalSignature } = require("eth-sig-util");

// JWT
const jwt = require("jsonwebtoken");

// JWT secret
const { JWT_SECRET, CONTRACT_ADDRESS } = require("../config/index");

// Auth middleware
const { auth } = require("../middleware/auth");

// POST /api/user
router.post("/", async (req, res) => {
  const { publicAddress } = req.body;
  console.log(publicAddress);

  const user = new User({ publicAddress });

  await user.save((err, user) => {
    if (err) {
      error("Error on creating user.");
      res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    } else {
      success("User created successfully.");
      info(
        "Checking if admin user already create initial referral for this address in the database"
      );

      Referral.findOne(
        { from: "xD", to: publicAddress },
        async (err, referral) => {
          if (err) {
            error("Error on checking referral.");
            res.status(500).json({
              message: "Internal Server Error",
              error: err,
            });
          }

          if (referral) {
            info("Referral already created.");
            res.status(200).json({
              message: "User created successfully.",
              user,
            });
          }

          if (!referral) {
            info("Referral not found, creating referral.");

            const { chainId } = await provider.getNetwork();

            const sig = await signData(
              chainId,
              CONTRACT_ADDRESS,
              account.address,
              publicAddress,
              Math.round(new Date().getTime() / 1000) + 10000,
              account
            );

            const referral = new Referral({
              from: account.address,
              to: publicAddress,
              timestamp: Math.round(new Date().getTime() / 1000) + 10000,
              signature: sig,
            });

            referral.save((err, referral) => {
              if (err) {
                console.log(err);
                error("Error on creating referral.");
                res.status(500).json({
                  message: "Internal Server Error",
                  error: err,
                });
              } else {
                success("Referral created successfully.");
                res.status(200).json({
                  message: "User created successfully.",
                  user,
                });
              }
            });
          }
        }
      );
    }
  });
});

// POST /api/user/mail
router.post("/email", auth, (req, res) => {
  const { publicAddress } = req.user;

  let email;

  try {
    email = req.body.email;
  } catch (e) {
    error("Error on getting email.");
    res.status(400).json({
      message: "Bad Request",
      error: e,
    });
  }

  User.findOneAndUpdate(
    { publicAddress },
    { mail: email },
    { new: true },
    (err, user) => {
      if (err) {
        error("Error on updating user.");
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      } else {
        success("User updated successfully.");
        res.status(200).json({
          message: "User updated successfully.",
          user,
        });
      }
    }
  );
});

// POST /api/user/:publicAddress
router.post("/:publicAddress", async (req, res) => {
  const { email } = req.body;
  const { publicAddress } = req.params;

  if (!email || !publicAddress) {
    res.status(500).send({ error: "Email is required." });
  } else {
    User.findOneAndUpdate(
      {
        publicAddress: publicAddress,
      },
      {
        mail: email,
      },
      (err, user) => {
        if (err) {
          error("Error on finding user.");
          res.status(500).json({
            message: "Internal Server Error",
            error: err,
          });
        } else {
          success("User updated successfully.");
          res.status(200).json({
            message: "User updated successfully",
            user,
          });
        }
      }
    );
  }
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
