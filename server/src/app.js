const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "CryptoDash API is running",
  });
});

module.exports = app;
