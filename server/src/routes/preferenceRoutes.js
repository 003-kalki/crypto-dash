const express = require("express");

const requireAuth = require("../middleware/authMiddleware");
const Preference = require("../models/Preference");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    let preferences = await Preference.findOne({
      userId: req.user._id,
    });

    if (!preferences) {
      preferences = await Preference.create({
        userId: req.user._id,
      });
    }

    res.status(200).json({
      preferences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch preferences",
    });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const { baseCurrency, theme, defaultChartRange } = req.body;

    const preferences = await Preference.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        ...(baseCurrency && { baseCurrency }),
        ...(theme && { theme }),
        ...(defaultChartRange && { defaultChartRange }),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      preferences,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to update preferences",
    });
  }
});

module.exports = router;