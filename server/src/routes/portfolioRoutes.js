const express = require("express");

const requireAuth = require("../middleware/authMiddleware");
const Portfolio = require("../models/Portfolio");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user._id,
      });
    }

    res.status(200).json({
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch portfolio",
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { coinId, symbol, name, quantity, averageBuyPrice, currency } =
      req.body;

    if (!coinId || !symbol || !name || quantity === undefined || averageBuyPrice === undefined) {
      return res.status(400).json({
        message:
          "coinId, symbol, name, quantity, and averageBuyPrice are required",
      });
    }

    let portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user._id,
        holdings: [],
      });
    }

    const holding = portfolio.holdings.find((item) => item.coinId === coinId);

    if (holding) {
      const totalQuantity = holding.quantity + quantity;
      const totalCost =
        holding.quantity * holding.averageBuyPrice + quantity * averageBuyPrice;

      holding.quantity = totalQuantity;
      holding.averageBuyPrice = totalQuantity === 0 ? 0 : totalCost / totalQuantity;
      holding.currency = currency || holding.currency;
    } else {
      portfolio.holdings.push({
        coinId,
        symbol,
        name,
        quantity,
        averageBuyPrice,
        currency,
      });
    }

    await portfolio.save();

    res.status(201).json({
      portfolio,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to add holding",
    });
  }
});

router.put("/:holdingId", requireAuth, async (req, res) => {
  try {
    const { holdingId } = req.params;
    const { quantity, averageBuyPrice, currency } = req.body;

    const portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found",
      });
    }

    const holding = portfolio.holdings.id(holdingId);

    if (!holding) {
      return res.status(404).json({
        message: "Holding not found",
      });
    }

    if (quantity !== undefined) {
      holding.quantity = quantity;
    }

    if (averageBuyPrice !== undefined) {
      holding.averageBuyPrice = averageBuyPrice;
    }

    if (currency) {
      holding.currency = currency;
    }

    await portfolio.save();

    res.status(200).json({
      portfolio,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to update holding",
    });
  }
});

router.delete("/:holdingId", requireAuth, async (req, res) => {
  try {
    const { holdingId } = req.params;

    const portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found",
      });
    }

    const holding = portfolio.holdings.id(holdingId);

    if (!holding) {
      return res.status(404).json({
        message: "Holding not found",
      });
    }

    holding.deleteOne();

    await portfolio.save();

    res.status(200).json({
      portfolio,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to remove holding",
    });
  }
});

module.exports = router;
