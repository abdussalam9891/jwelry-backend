 import { generateToken } from "../utils/generateToken.js";
import { COOKIE_OPTIONS } from "../utils/cookieOptions.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Otp from "../models/otpModel.js";
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
      user.provider = "email";

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


        if (user.isEmailVerified) {
  return res.status(400).json({
    message: "Email already verified",
  });
}



      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      if (
        user.emailOtp !==
        otp
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP",
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


if (!user.emailOtp) {
  return res.status(400).json({
    message: "OTP not found",
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

      res.cookie(
        "token",
        token,
        COOKIE_OPTIONS
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

    res.cookie(
      "token",
      token,
      COOKIE_OPTIONS
    );

    const {
      password: _,
      ...userResponse
    } = user.toObject();

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
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({
          message:
            "Email is required",
        });
    }

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

    // generate raw token
    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    // hash token before DB save
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.passwordResetToken =
      hashedToken;

    user.passwordResetExpires =
      Date.now() +
      10 * 60 * 1000; // 10 mins

    await user.save();

    // TEMP → later send email
  const resetLink =
  `http://localhost:5500/front/pages/resetPassword.html?token=${resetToken}`;

await sendResetEmail(
  user.email,
  resetLink
);


    console.log(
      "RESET TOKEN:",
      resetToken
    );

    return res.json({
      success: true,
      message:
        "Password reset token generated",
    });
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({
        message: err.message,
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

