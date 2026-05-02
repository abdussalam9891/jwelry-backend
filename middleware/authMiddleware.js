import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


// 🔐 PROTECT (authenticate user)

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user (safe select)
    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // block inactive users
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is disabled" });
    }

    // attach minimal user
    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};




//  AUTHORIZE (role-based access)

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} cannot access this route`,
      });
    }

    next();
  };
};
