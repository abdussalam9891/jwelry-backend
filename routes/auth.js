import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


//  GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);


//  GOOGLE CALLBACK

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/pages/auth.html?error=google_failed`,
  }),
  (req, res) => {
    const user = req.user;

    // include role in token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // safer minimal payload
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    //  still URL-based (ok for now)
    const params = new URLSearchParams({
      token,
      user: encodeURIComponent(JSON.stringify(safeUser)),
    });

    res.redirect(`${process.env.CLIENT_URL}/pages/auth.html?${params}`);
  }
);


//  GET CURRENT USER

router.get("/me", protect, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user,
  });
});

export default router;
