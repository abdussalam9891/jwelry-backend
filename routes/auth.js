import express from "express";

import passport from "../config/passport.js";

import { protect }
from "../middleware/authMiddleware.js";

import {

  handleAdminGoogleCallback,

  handleUserGoogleCallback,

  getCurrentUser,
  updateProfile,
  updateAvatar,
  updateNotificationPreferences,
  requestOtp,
  verifyOtp,
  verifyAdminOtp,

  logoutUser,

} from "../controllers/authController.js";


import upload,
{
  setUploadFolder,
}
from "../middleware/uploadMiddleware.js";

const router =
  express.Router();


// GOOGLE LOGIN
router.get(

  "/google",

  passport.authenticate(
    "google",
    {
      scope: ["profile", "email"],
      session: false,
    }
  )

);


// GOOGLE CALLBACK
router.get(

  "/google/callback",

  passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect:
        `${process.env.CLIENT_URL}/front/pages/auth.html?error=google_failed`,
    }
  ),

  handleUserGoogleCallback

);


// otp based log in
router.post(
  "/request-otp",
  requestOtp
);

router.post(
  "/verify-otp",
  verifyOtp
);


// otp based admin log in
router.post(
  "/verify-otp-admin",
  verifyAdminOtp
);






// ADMIN LOGIN
router.get(

  "/google/admin",

  passport.authenticate(
    "google-admin",
    {
      scope: ["profile", "email"],
      session: false,
    }
  )

);


// ADMIN CALLBACK
router.get(

  "/google/admin/callback",

  passport.authenticate(
    "google-admin",
    {
      session: false,
      failureRedirect:
        `${process.env.ADMIN_URL}/login`,
    }
  ),

  handleAdminGoogleCallback

);


// CURRENT USER
router.get(
  "/me",
  protect,
  getCurrentUser
);

// edit profile
router.put(
  "/profile",
  protect,
  updateProfile
);



router.put(

  "/profile/avatar",

  protect,

  setUploadFolder(
    "avatars"
  ),

  upload.single(
    "avatar"
  ),

  updateAvatar

);


router.put(

  "/preferences",

  protect,

  updateNotificationPreferences

);


// LOGOUT
router.post(
  "/logout",
  logoutUser
);

export default router;
