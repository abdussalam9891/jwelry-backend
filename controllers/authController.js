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

      // avatar optional later
      user.avatar =
        req.body.avatar ||
        user.avatar;

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

          avatar:
            updatedUser.avatar,

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
