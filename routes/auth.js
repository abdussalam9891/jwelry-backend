import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Step 1: Redirect to Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Step 2: Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/pages/auth.html?error=google_failed`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    };

    // ⚠️ Encode user properly (IMPORTANT)
    const params = new URLSearchParams({
      token,
      user: encodeURIComponent(JSON.stringify(user)),
    });

    res.redirect(`${process.env.CLIENT_URL}/pages/auth.html?${params}`);
  }
);


router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ loggedIn: false });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ loggedIn: true, user: decoded });
  } catch {
    res.json({ loggedIn: false });
  }
});

export default router;
