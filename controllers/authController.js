 import { generateToken } from "../utils/generateToken.js";
import { COOKIE_OPTIONS } from "../utils/cookieOptions.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Otp from "../models/otpModel.js";




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
export const getCurrentUser = async (
  req,
  res
) => {
  try {

   console.log("===== /auth/me =====");
console.log("SESSION ID:", req.sessionID);
console.log("SESSION:", req.session);
console.log("SESSION USER ID:", req.session?.userId);
console.log("REQ.USER:", req.user);
    let user = null;

    // GOOGLE / PASSPORT
    if (req.user) {
      user = req.user;
    }

    // OTP / SESSION LOGIN
    else if (
      req.session?.userId
    ) {
      user =
        await User.findById(
          req.session.userId
        );
    }

    if (!user) {
      return res
        .status(401)
        .json({
          loggedIn: false,
          message:
            "Unauthorized",
        });
    }

    return res.json({
      loggedIn: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        createdAt:
          user.createdAt,
        lastLoginAt:
          user.lastLoginAt,
      },
    });
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({
        message:
          "Failed to fetch user",
      });
  }
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


  req.session.destroy(
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({
            message:
              "Logout failed",
          });
      }

      // clear JWT (legacy)
      res.clearCookie(
        "token",
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite: "lax",
        }
      );

      // clear session cookie
      res.clearCookie(
        "connect.sid",
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite: "lax",
        }
      );

      return res.json({
        message:
          "Logged out successfully",
      });
    }
  );
};





export const requestOtp = async (
  req,
  res
) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({
          message:
            "Phone number required",
        });
    }

    // normalize
    const normalizedPhone =
      phone.replace(/\D/g, "");

    if (
      normalizedPhone.length !== 10
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid phone number",
        });
    }

    // generate OTP
    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    const otpHash =
      await bcrypt.hash(
        otp,
        10
      );

    // remove old otp
    await Otp.deleteMany({
      phone: normalizedPhone,
    });

    // save new
    await Otp.create({
      phone: normalizedPhone,
      otpHash,
      expiresAt: new Date(
        Date.now() +
          5 * 60 * 1000
      ), // 5 min
    });

    // TEMP → console until SMS provider
    console.log(
      "OTP:",
      otp
    );

    return res.json({
      success: true,
      message:
        "OTP sent successfully",
    });
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({
        message:
          "Failed to send OTP",
      });
  }
};






export const verifyOtp = async (
  req,
  res
) => {
  try {
    const { phone, otp } =
      req.body;

    if (!phone || !otp) {
      return res
        .status(400)
        .json({
          message:
            "Phone and OTP required",
        });
    }

    const normalizedPhone =
      phone.replace(/\D/g, "");

    const otpDoc =
      await Otp.findOne({
        phone:
          normalizedPhone,
      });

    if (!otpDoc) {
      return res
        .status(400)
        .json({
          message:
            "OTP not found",
        });
    }

    // expiry
    if (
      otpDoc.expiresAt <
      new Date()
    ) {
      await Otp.deleteOne({
        _id: otpDoc._id,
      });

      return res
        .status(400)
        .json({
          message:
            "OTP expired",
        });
    }

    // attempts
    if (
      otpDoc.attempts >= 5
    ) {
      return res
        .status(429)
        .json({
          message:
            "Too many attempts",
        });
    }

    const isValid =
      await bcrypt.compare(
        otp,
        otpDoc.otpHash
      );

    if (!isValid) {
      otpDoc.attempts += 1;
      await otpDoc.save();

      return res
        .status(400)
        .json({
          message:
            "Invalid OTP",
        });
    }

    // find/create user
    let user =
      await User.findOne({
        phone:
          normalizedPhone,
      });

    if (!user) {
      user =
        await User.create({
          phone:
            normalizedPhone,
          name:
            "Gemora User",
          provider:
            "phone",
          isPhoneVerified:
            true,
        });
    }

    user.lastLoginAt =
      new Date();

    await user.save();

    // cleanup otp
    await Otp.deleteOne({
      _id: otpDoc._id,
    });




    if (!req.session) {
  throw new Error(
    "Session not initialized"
  );
}



console.log("===== VERIFY OTP =====");
console.log("SETTING USER ID:", user._id.toString());

    // session login
    req.session.userId =
      user._id.toString();

      console.log(
  "AFTER SET SESSION:",
  req.session
);

      req.session.save((err) => {
  if (err) {
    console.error(err);

    return res
      .status(500)
      .json({
        message:
          "Session save failed",
      });
  }   return res.json({
    success: true,
    user,
  });
});




  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({
        message:
          "OTP verification failed",
      });
  }
};



export const verifyAdminOtp =
  async (req, res) => {
    try {
      const { phone, otp } =
        req.body;

      if (!phone || !otp) {
        return res
          .status(400)
          .json({
            message:
              "Phone and OTP required",
          });
      }

      const normalizedPhone =
        phone.replace(/\D/g, "");

      const otpDoc =
        await Otp.findOne({
          phone:
            normalizedPhone,
        });

      if (!otpDoc) {
        return res
          .status(400)
          .json({
            message:
              "OTP not found",
          });
      }

      const isValid =
        await bcrypt.compare(
          otp,
          otpDoc.otpHash
        );

      if (!isValid) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP",
          });
      }

      const user =
        await User.findOne({
          phone:
            normalizedPhone,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      // CRITICAL
      if (
        user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Admin access denied",
          });
      }

      req.session.userId =
        user._id.toString();

      await Otp.deleteOne({
        _id: otpDoc._id,
      });

      req.session.save(
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({
                message:
                  "Session failed",
              });
          }

          return res.json({
            success: true,
            user,
          });
        }
      );
    } catch (err) {
      console.error(err);

      return res
        .status(500)
        .json({
          message:
            "OTP verification failed",
        });
    }
  };

