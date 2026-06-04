const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;

const hasGoogleOAuthConfig = () =>
  Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CALLBACK_URL
  );

const logStartupConfig = () => {
  console.log("Startup config:", {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "5000",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    mongoUriConfigured: Boolean(getMongoUri()),
    googleOAuthConfigured: hasGoogleOAuthConfig(),
    jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
  });
};

module.exports = {
  getMongoUri,
  hasGoogleOAuthConfig,
  logStartupConfig,
};
