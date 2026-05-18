 import { generateToken } from "../utils/generateToken.js";
import { COOKIE_OPTIONS } from "../utils/cookieOptions.js";
import User from "../models/UserModel.js";



// GOOGLE SUCCESS
export const googleAuthSuccess = (
  req,
  res,
  redirectUrl
) => {

  const user = req.user;

  const token =
    generateToken(user);

  res.cookie(
    "token",
    token,
    COOKIE_OPTIONS
  );

  res.redirect(
    redirectUrl
  );

};


// ADMIN CALLBACK
export const handleAdminGoogleCallback = (
  req,
  res
) => {

  if (
    req.user.role !== "admin"
  ) {

    return res.redirect(
      `${process.env.ADMIN_URL}/login`
    );

  }

  googleAuthSuccess(

    req,

    res,

    `${process.env.ADMIN_URL}/admin`

  );

};


// USER CALLBACK
export const handleUserGoogleCallback = (
  req,
  res
) => {

  googleAuthSuccess(

    req,

    res,

    `${process.env.CLIENT_URL}/front/pages/auth.html`

  );

};


// CURRENT USER
export const getCurrentUser = (
  req,
  res
) => {

  res.json({

    loggedIn: true,

    user: {

      id: req.user._id,

      name: req.user.name,

      email: req.user.email,

      avatar: req.user.avatar,

      role: req.user.role,

      phone: req.user.phone,

      createdAt: req.user.createdAt,

      lastLoginAt:
        req.user.lastLoginAt,

    },

  });

};




export const updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({
          message: "User not found",
        });

      }

      user.name =
        req.body.name ||
        user.name;

      user.phone =
        req.body.phone ||
        user.phone;



      const updatedUser =
        await user.save();

      res.json({

        message:
          "Profile updated",

        user: {

          id:
            updatedUser._id,

          name:
            updatedUser.name,

          email:
            updatedUser.email,

          role:
            updatedUser.role,



          phone:
            updatedUser.phone,

        },

      });

    } catch (err) {

      res.status(500).json({
        message:
          "Failed to update profile",
      });

    }

};


export const updateAvatar =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }

      if (!req.file) {

        return res.status(400).json({

          message:
            "No image uploaded",

        });

      }

      user.avatar =
        req.file.path;

      await user.save();

      res.json({

        success: true,

        user,

      });

    } catch {

      res.status(500).json({

        message:
          "Failed to update avatar",

      });

    }

};



export const
updateNotificationPreferences =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }

      user.notificationPreferences = {

        ...user.notificationPreferences,

        ...req.body,

      };

      await user.save();

      res.json({

        success: true,

        notificationPreferences:
          user.notificationPreferences,

      });

    } catch {

      res.status(500).json({

        message:
          "Failed to update preferences",

      });

    }

};


// LOGOUT
export const logoutUser = (
  req,
  res
) => {

  res.clearCookie(
    "token",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
    }
  );

  res.json({
    message:
      "Logged out successfully",
  });

};



