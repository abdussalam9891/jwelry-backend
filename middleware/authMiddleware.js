import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";


export const protect =
  async (
    req,
    res,
    next
  ) => {
    try {




      let token =
        req.cookies
          ?.admin_token ||
        req.cookies
          ?.user_token;

      if (
        !token &&
        req.headers.authorization?.startsWith(
          "Bearer "
        )
      ) {
        token =
          req.headers.authorization.split(
            " "
          )[1];
      }

      console.log("REQ COOKIES:", req.cookies);
console.log("HEADER COOKIE:", req.headers.cookie);

      if (!token) {
        return res
          .status(401)
          .json({
            message:
              "Not authorized",
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
        ).select("-__v");

      if (!user) {
        return res
          .status(401)
          .json({
            message:
              "User not found",
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
      return res
        .status(401)
        .json({
          message:
            "Invalid auth",
        });
    }
  };

// AUTHORIZE
export const authorize = (...roles) => {

  return (req, res, next) => {

    // Not logged in
    if (!req.user) {

      return res.status(401).json({
        message: "Not authenticated",
      });

    }

    // Role not allowed
    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied",
      });

    }

    next();

  };

};
