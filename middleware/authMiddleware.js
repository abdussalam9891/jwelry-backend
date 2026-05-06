import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// 🔐 PROTECT
export const protect = async (req, res, next) => {

  try {

    let token =
      req.cookies?.token ||
      (
        req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : null
      );

    // ❌ No token
    if (!token) {

      return res.status(401).json({
        message: "Not authorized",
      });

    }

    // 🔥 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 🔥 Get user
    const user = await User.findById(decoded.id)
      .select("-password -__v");

    // ❌ User not found
    if (!user) {

      return res.status(401).json({
        message: "User not found",
      });

    }

    // 🚫 Disabled account
    if (!user.isActive) {

      return res.status(403).json({
        message: "Account disabled",
      });

    }

    // ✅ Attach safe user
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid or expired token",
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
