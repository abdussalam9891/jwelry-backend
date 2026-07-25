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
