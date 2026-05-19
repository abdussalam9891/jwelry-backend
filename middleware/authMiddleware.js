import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (
  req,
  res,
  next
) => {
  try {
    let user = null;

    // 1) SESSION AUTH (OTP / Passport)
    if (req.user) {
      user = req.user;
    }

    else if (
      req.session?.userId
    ) {
      user =
        await User.findById(
          req.session.userId
        ).select("-__v");
    }

    // 2) JWT AUTH (legacy/admin/api)
    else {
      const token =
        req.cookies?.token ||
        (
          req.headers.authorization?.startsWith(
            "Bearer "
          )
            ? req.headers.authorization.split(
                " "
              )[1]
            : null
        );

      if (token) {
        const decoded =
          jwt.verify(
            token,
            process.env.JWT_SECRET
          );

        user =
          await User.findById(
            decoded.id
          ).select("-__v");
      }
    }

    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Not authorized",
        });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({
          message:
            "Account disabled",
        });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);

    return res
      .status(401)
      .json({
        message:
          "Invalid auth",
      });
  }
};

// 🔐 AUTHORIZE
export const authorize = (...roles) => {

  return (req, res, next) => {

    // ❌ Not logged in
    if (!req.user) {

      return res.status(401).json({
        message: "Not authenticated",
      });

    }

    // ❌ Role not allowed
    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied",
      });

    }

    next();

  };

};
