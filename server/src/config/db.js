const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection failed: MONGO_URI is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "Check that MONGO_URI is configured in Render and that MongoDB Atlas allows connections from Render."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
