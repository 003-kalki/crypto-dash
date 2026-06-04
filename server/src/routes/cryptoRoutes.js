const express = require("express");

const cryptoService = require("../services/cryptoService");

const router = express.Router();

const getUpstreamStatus = (error) => {
  if (error.status === 429) {
    return 429;
  }

  return 502;
};

const logCryptoError = (message, error) => {
  console.error(message, {
    message: error.message,
    status: error.status,
    upstreamBody: error.upstreamBody,
  });
};

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
    logCryptoError("Unable to search coins", error);

    res.status(getUpstreamStatus(error)).json({
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
    logCryptoError("Unable to fetch market data", error);

    res.status(getUpstreamStatus(error)).json({
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
    logCryptoError("Unable to fetch chart data", error);

    res.status(getUpstreamStatus(error)).json({
      message: "Unable to fetch chart data",
    });
  }
});

module.exports = router;
