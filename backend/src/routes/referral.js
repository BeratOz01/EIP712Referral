const router = require("express").Router();

// MongoDB - User Model
const Referral = require("../models/referral");
const User = require("../models/user");

// Helper functions - Colorful logging
const { success, error, sendEmail } = require("../helpers/index");

// Auth
const { auth } = require("../middleware/auth");

// GET /api/referral/:publicAddress
router.get("/:publicAddress", auth, async (req, res) => {
  try {
    const { publicAddress } = req.params;

    Referral.find({ to: publicAddress, isAccepted: false }, (err, referral) => {
      if (err) {
        error("Error on getting referral.");
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      }

      success("Referral(s) send successfully.");
      console.log(referral.length);
      res.status(200).json({
        referral,
      });
    });
  } catch (e) {
    error("Error on referral route");
    res.status(500).json({
      message: "Internal Server Error",
      error: e,
    });
  }
});

// POST /api/referral/create
router.post("/create", auth, async (req, res) => {
  try {
    const { to, signature, timestamp } = req.body;

    const from = req.user.publicAddress;

    const referral = new Referral({
      from,
      to,
      signature,
      timestamp,
    });

    await referral.save();

    const toUser = await User.findOne({ publicAddress: to });

    if (toUser) {
      if (toUser.mail !== "")
        sendEmail(
          toUser.publicAddress,
          `${from} has sent you a referral. Accept it from your dashboard.`
        );
    }

    res.status(200).json({
      message: "Referral sent successfully.",
    });
  } catch (e) {
    console.log(e);
    error("Error on referral route");
    res.status(500).json({
      message: "Internal Server Error",
      error: "Invalid request",
    });
  }
});

module.exports = router;
