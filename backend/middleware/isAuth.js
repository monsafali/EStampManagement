import jwt from "jsonwebtoken";
import UserAuth from "../models/UserAuth.model.js";
import { ErrorHandler } from "./errorMiddleware.js";

export const isAuthenticated = async (req, res, next) => {

  try {
    let token = null;
    if (req.cookies && req.cookies["jwt-token"])
      token = req.cookies["jwt-token"];
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new ErrorHandler("Not logged in", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserAuth.findById(decoded.userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    // If user enforces single-device login, require session match
    if (user.singleDeviceEnforced) {
      if (decoded.sessionVersion !== user.sessionVersion) {
        return next(
          new ErrorHandler(
            "Your session expired. Logged in from another device.",
            401
          )
        );
      }
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

export const authorizedRole =
  (...roles) =>
    (req, res, next) => {

    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: "Access denied" });
    next();
  };
