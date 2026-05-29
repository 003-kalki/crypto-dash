const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    baseCurrency: {
      type: String,
      enum: ["USD", "INR", "EUR", "GBP"],
      default: "USD",
    },
    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },
    defaultChartRange: {
      type: String,
      enum: ["1D", "1W", "1M", "6M"],
      default: "1D",
    },
  },
  {
    timestamps: true,
  }
);

const Preference = mongoose.model("Preference", preferenceSchema);

module.exports = Preference;