const express = require("express");

const cryptoService = require("../services/cryptoService");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const coins = await cryptoService.searchCoins(query);

    res.status(200).json({
      coins,
    });
  } catch (error) {
    res.status(502).json({
      message: "Unable to search coins",
    });
  }
});

router.get("/markets", async (req, res) => {
  try {
    const { currency, page, perPage, ids } = req.query;

    const coins = await cryptoService.getMarketCoins({
      currency,
      page,
      perPage,
      ids,
    });

    res.status(200).json({
      coins,
    });
  } catch (error) {
    res.status(502).json({
      message: "Unable to fetch market data",
    });
  }
});

router.get("/:coinId/history", async (req, res) => {
  try {
    const { coinId } = req.params;
    const { currency, days } = req.query;

    const prices = await cryptoService.getCoinHistory({
      coinId,
      currency,
      days,
    });

    res.status(200).json({
      prices,
    });
  } catch (error) {
    res.status(502).json({
      message: "Unable to fetch chart data",
    });
  }
});

module.exports = router;
