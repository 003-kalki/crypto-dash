const mongoose = require("mongoose");

const watchlistCoinSchema = new mongoose.Schema(
  {
    coinId: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    coins: {
      type: [watchlistCoinSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist; 