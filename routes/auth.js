import express from "express";

import passport from "../config/passport.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  firebaseLogin,
  forgotPassword,
  getCurrentUser,
  handleAdminGoogleCallback,
  handleUserGoogleCallback,
  loginWithEmail,
  logoutUser,
  registerUser,
  resetPassword,
  updateAvatar,
  updateNotificationPreferences,
  updateProfile,
  verifyEmailOtp,
} from "../controllers/authController.js";

import upload, { setUploadFolder } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/login", loginWithEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/front/pages/auth.html?error=google_failed`,
  }),
  handleUserGoogleCallback,
);
router.post("/firebase-login", firebaseLogin);
// ADMIN LOGIN
router.get(
  "/google/admin",
  passport.authenticate("google-admin", {
    scope: ["profile", "email"],
    session: false,
  }),
);
// ADMIN CALLBACK
router.get(
  "/google/admin/callback",
  passport.authenticate("google-admin", {
    session: false,
    failureRedirect: `${process.env.ADMIN_URL}/login`,
  }),

  handleAdminGoogleCallback,
);
// CURRENT USER
router.get("/me", protect, getCurrentUser);
// edit profile
router.patch("/profile", protect, updateProfile);
router.patch(
  "/profile/avatar",
  protect,
  setUploadFolder("avatars"),
  upload.single("avatar"),
  updateAvatar,
);
router.patch("/preferences", protect, updateNotificationPreferences);
// LOGOUT
router.post("/logout", logoutUser);

export default router;
