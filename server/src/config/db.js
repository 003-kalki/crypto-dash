const mongoose = require("mongoose");
const { getMongoUri } = require("./env");

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    console.error("MongoDB connection failed: set MONGO_URI or MONGODB_URI");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "Check that your MongoDB URI is correct and that MongoDB Atlas allows connections from Render."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
