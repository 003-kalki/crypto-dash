require("dotenv").config();

const { logStartupConfig } = require("./config/env");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  logStartupConfig();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`CryptoDash API running on port ${PORT}`);
  });
};

startServer();
