require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
const startServer = async() =>{
  await connectDB;

app.listen(PORT, () => {
  console.log(`CryptoDash API running on port ${PORT}`);
});
};

startServer();