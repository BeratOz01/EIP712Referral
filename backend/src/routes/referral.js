const router = require("express").Router();

// MongoDB - User Model
const Referral = require("../models/referral");

// Helper functions - Colorful logging
const { success, error } = require("../helpers/index");

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

module.exports = router;
