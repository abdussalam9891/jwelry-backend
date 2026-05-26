 import { generateToken } from "../utils/generateToken.js";
 import jwt from "jsonwebtoken";

import {
  ADMIN_COOKIE,
  USER_COOKIE,
} from "../utils/cookieOptions.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

import crypto from "crypto";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import { sendResetEmail }
  from "../utils/sendResetEmail.js";










export const registerUser = async (
  req,
  res
) => {
  try {
    const name =
      req.body.name?.trim();

    const email =
      req.body.email
        ?.toLowerCase()
        .trim();

    const password =
      req.body.password?.trim();

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "All fields required",
      });
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    let user =
      await User.findOne({
        email,
      }).select("+password");

    /* EXISTING USER */
    if (user) {
      // already email-password account
      if (user.password) {
        return res.status(409).json({
          message:
            "Account already exists. Please sign in.",
        });
      }

      // GOOGLE / PHONE account -> add password login
      user.password =
        password;

      user.isEmailVerified =
        false;

      user.emailOtp = otp;

      user.emailOtpExpires =
        Date.now() +
        10 * 60 * 1000;

      // optional: if it was google-only / phone-only
      if (
  !user.provider.includes(
    "email"
  )
) {
  user.provider.push(
    "email"
  );
}

      await user.save();

      await sendOtpEmail(
        email,
        otp
      );

      return res.status(200).json({
        success: true,
        message:
          "Email login linked. Verify OTP to continue.",
        email,
      });
    }

    /* BRAND NEW USER */
    user =
      await User.create({
        name,
        email,
        password,
        provider: "email",
        isEmailVerified:
          false,
        emailOtp: otp,
        emailOtpExpires:
          Date.now() +
          10 * 60 * 1000,
      });

    await sendOtpEmail(
      email,
      otp
    );

    return res.status(201).json({
      success: true,
      message:
        "OTP sent to email. Verify to continue.",
      email,
    });
  } catch (err) {
    console.error(
      "REGISTER ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Something went wrong",
    });
  }
};


export const verifyEmailOtp =
  async (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

             if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

        if (user.isEmailVerified) {
  return res.status(400).json({
    message: "Email already verified",
  });
}





if (!user.emailOtp) {
  return res.status(400).json({
    message: "OTP not found",
  });
}

if (
  !user.emailOtpExpires ||
  user.emailOtpExpires < Date.now()
) {
  return res.status(400).json({
    message: "OTP expired",
  });
}

if (user.emailOtp !== otp) {
  return res.status(400).json({
    message: "Invalid OTP",
  });
}

      /* VERIFY USER */
      user.isEmailVerified = true;
      user.emailOtp = null;
      user.emailOtpExpires =
        null;

      await user.save();

      /* NOW LOGIN */
      const token =
        generateToken(user);

      const cookieName =
  user.role === "admin"
    ? "admin_token"
    : "user_token";

res.cookie(
  cookieName,
  token,
  user.role === "admin"
    ? ADMIN_COOKIE
    : USER_COOKIE
);


      const userResponse =
  user.toObject();

delete userResponse.password;
delete userResponse.emailOtp;
delete userResponse.emailOtpExpires;



      return res.json({
        success: true,
        message:
          "Email verified",
       user: userResponse,
      });
    } catch (err) {
      return res.status(500).json({
        message:
          err.message,
      });
    }
  };

export const loginWithEmail = async (
  req,
  res
) => {
  try {
    const email =
      req.body.email
        ?.toLowerCase()
        .trim();

    const password =
      req.body.password?.trim();

    const user =
      await User.findOne({
        email,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await user.matchPassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    if (
      !user.isEmailVerified
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Verify email first",
      });
    }

    user.lastLoginAt =
      new Date();

    await user.save();

    const token =
      generateToken(user);

   const cookieName =
  user.role === "admin"
    ? "admin_token"
    : "user_token";

res.cookie(
  cookieName,
  token,
  user.role === "admin"
    ? ADMIN_COOKIE
    : USER_COOKIE
);

  const userResponse =
  user.toObject();

delete userResponse.password;
delete userResponse.emailOtp;
delete userResponse.emailOtpExpires;
delete userResponse.passwordResetToken;
delete userResponse.passwordResetExpires;

    return res.json({
      success: true,
      user: userResponse,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
};


export const forgotPassword = async (
  req,
  res
) => {
  try {
    const email =
      req.body.email
        ?.toLowerCase()
        .trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken =
      hashedToken;

    user.passwordResetExpires =
      Date.now() +
      10 * 60 * 1000;

    await user.save();

    // role-based reset link
    const resetLink =
  user.role === "admin"
    ? `${process.env.ADMIN_URL}/reset-password?token=${resetToken}`
    : `${process.env.CLIENT_URL}/front/pages/resetPassword.html?token=${resetToken}`;

  try {
  await sendResetEmail(
    user.email,
    resetLink
  );
} catch (err) {
  user.passwordResetToken =
    undefined;

  user.passwordResetExpires =
    undefined;

  await user.save();

  throw err;
}

    console.log(
      "RESET TOKEN:",
      resetToken
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset link sent",
    });
  } catch (err) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
};


export const resetPassword =
  async (req, res) => {
    try {
      const {
        token,
        password,
      } = req.body;

      if (
  !password ||
  password.length < 6
) {
  return res.status(400).json({
    message:
      "Password must be at least 6 characters",
  });
}

      if (!token) {
        return res.status(400).json({
          message: "Token missing",
        });
      }

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      const user =
        await User.findOne({
          passwordResetToken:
            hashedToken,
          passwordResetExpires: {
            $gt: Date.now(),
          },
        });

      if (!user) {
        return res.status(400).json({
          message:
            "Invalid or expired token",
        });
      }

      user.password =
        password;

      user.passwordResetToken =
        undefined;

      user.passwordResetExpires =
        undefined;

      await user.save();

      return res.json({
        success: true,
        message:
          "Password reset successful",
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message:
          err.message,
      });
    }
  };





// GOOGLE SUCCESS
export const googleAuthSuccess = (
  req,
  res,
  redirectUrl
) => {
  const user = req.user;

  const token =
    generateToken(user);

  const cookieName =
    user.role === "admin"
      ? "admin_token"
      : "user_token";

  const cookieOptions =
    user.role === "admin"
      ? ADMIN_COOKIE
      : USER_COOKIE;

  // set jwt
  res.cookie(
    cookieName,
    token,
    cookieOptions
  );

  // destroy temp passport session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }

      return res.redirect(
        redirectUrl
      ); // ONLY RESPONSE
    });

    return; // critical
  }

  return res.redirect(
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
export const getCurrentUser =
  async (
    req,
    res
  ) => {
    try {
      let token =
        req.cookies
          ?.admin_token ||
        req.cookies
          ?.user_token;

      if (!token) {
        return res
          .status(401)
          .json({
            loggedIn: false,
          });
      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.id
        );

      if (!user) {
        return res
          .status(401)
          .json({
            loggedIn: false,
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
  console.error(
    "getCurrentUser error:",
    err
  );

  return res.status(401).json({
    loggedIn: false,
    error: err.message,
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

res.clearCookie("admin_token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

res.clearCookie("user_token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

res.clearCookie(
  "connect.sid"
);

      return res.json({
        message:
          "Logged out successfully",
      });
    }
  );
};




export const firebaseLogin =
  async (req, res) => {
    try {
      const { phone } =
        req.body;

      if (!phone) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Phone required",
          });
      }

      const normalizedPhone =
        phone
          .replace(/\D/g, "")
          .slice(-10);

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

      user.isPhoneVerified =
        true;

      await user.save();



     const token =
  generateToken(user);

res.cookie(
  "user_token",
  token,
  USER_COOKIE
);

return res.json({
  success: true,
  user,
});
    } catch (err) {
      console.error(
        err
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Login failed",
          });
    }
  };


