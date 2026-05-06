import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// 🔐 GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// 🔐 GOOGLE CALLBACK
router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    failureRedirect:
      `${process.env.CLIENT_URL}/front/pages/auth.html?error=google_failed`
  }),

  (req, res) => {

    const user = req.user;

    // 🔥 JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 🔥 Store token in HttpOnly cookie
    res.cookie(
      "token",
      token,
      COOKIE_OPTIONS
    );

    // 🔥 Redirect frontend
 res.redirect(
  `${process.env.CLIENT_URL}/front/pages/auth.html`
);
  }
);

// 🔐 CURRENT USER
router.get(
  "/me",
  protect,
  (req, res) => {

    res.json({
      loggedIn: true,

      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
      },
    });
  }
);

// 🔓 LOGOUT
router.post(
  "/logout",
  (req, res) => {

    res.clearCookie(
      "token",
      COOKIE_OPTIONS
    );

    res.json({
      message: "Logged out successfully",
    });
  }
);

export default router;
