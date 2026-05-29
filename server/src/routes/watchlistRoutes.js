const express = require("express");

const requireAuth = require("../middleware/authMiddleware");
const Watchlist = require("../models/Watchlist");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({
      userId: req.user._id,
    });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId: req.user._id,
      });
    }

    res.status(200).json({
      watchlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch watchlist",
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { coinId, symbol, name } = req.body;

    if (!coinId || !symbol || !name) {
      return res.status(400).json({
        message: "coinId, symbol, and name are required",
      });
    }

    let watchlist = await Watchlist.findOne({
      userId: req.user._id,
    });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId: req.user._id,
        coins: [],
      });
    }

    const coinAlreadyExists = watchlist.coins.some(
      (coin) => coin.coinId === coinId
    );

    if (coinAlreadyExists) {
      return res.status(409).json({
        message: "Coin already exists in watchlist",
      });
    }

    watchlist.coins.push({
      coinId,
      symbol,
      name,
    });

    await watchlist.save();

    res.status(201).json({
      watchlist,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to add coin to watchlist",
    });
  }
});

router.delete("/:coinId", requireAuth, async (req, res) => {
  try {
    const { coinId } = req.params;

    const watchlist = await Watchlist.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        $pull: {
          coins: { coinId },
        },
      },
      {
        new: true,
      }
    );

    if (!watchlist) {
      return res.status(404).json({
        message: "Watchlist not found",
      });
    }

    res.status(200).json({
      watchlist,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to remove coin from watchlist",
    });
  }
});

module.exports = router;