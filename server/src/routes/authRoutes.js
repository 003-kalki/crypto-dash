const express = require("express");
const jwt = require("jsonwebtoken");

const passport = require("../config/passport");
const { hasGoogleOAuthConfig } = require("../config/env");
const requireAuth = require("../middleware/authMiddleware");
const router = express.Router();

const requireGoogleOAuthConfig = (req, res, next) => {
  if (!hasGoogleOAuthConfig()) {
    return res.status(503).json({
      message: "Google OAuth is not configured",
    });
  }

  next();
};

router.get(
  "/google",
  requireGoogleOAuthConfig,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  requireGoogleOAuthConfig,
  (req, res) => {
    passport.authenticate("google", { session: false }, (error, user, info) => {
      if (error || !user) {
        console.error("Google OAuth callback failed:", {
          message: error?.message,
          info,
        });

        const redirectUrl = new URL(process.env.CLIENT_URL || "http://localhost:5173");
        redirectUrl.searchParams.set("authError", "google");
        return res.redirect(redirectUrl.toString());
      }

      if (!process.env.JWT_SECRET) {
        console.error("Google OAuth callback failed: JWT_SECRET is not set");
        const redirectUrl = new URL(process.env.CLIENT_URL || "http://localhost:5173");
        redirectUrl.searchParams.set("authError", "jwt");
        return res.redirect(redirectUrl.toString());
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    })(req, res);
  }
);
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

module.exports = router;
