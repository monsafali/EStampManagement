import { ErrorHandler } from "../middleware/errorMiddleware.js";

import UserAuth from "../models/UserAuth.model.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { setTokenCookieAndSend } from "../utils/jwtToken.js";


import { sendEmail } from "../utils/sendEmail.js";
import { LOGIN_OTP_EMAIL_TEMPLATE } from "../utils/Email_Templates.js";



export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password, role } = req.body;

  // Basic validations
  if (!username || !password || !role)
    return next(
      new ErrorHandler("Username, password, and role are required", 400)
    );

  // Find user
  const user = await UserAuth.findOne({ username });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Check if role matches
  if (user.role !== role) {
    return next(
      new ErrorHandler(
        `Invalid role selected. This account belongs to '${user.role}'`,
        403
      )
    );
  }

  // Check if active
  if (!user.isActive) {
    return next(
      new ErrorHandler("Your account has been deactivated. Contact admin.", 403)
    );
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

  // Session enforcement (only vendors)
  if (user.singleDeviceEnforced && user.sessionVersion !== 0) {
    return next(
      new ErrorHandler(
        "Already logged in on another device. Please logout first.",
        403
      )
    );
  }
  // const otp = crypto.randomInt(100000, 999999).toString();
  const otp = "123456";
  user.otpCode = otp
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  user.isOtpVerified = false;

  // Assign sessionVersion only for vendors
  if (user.singleDeviceEnforced) {
    user.sessionVersion = Date.now();;
  }

   await user.save();
  await sendEmail({
    to: user.email,
    subject: "🔐 Your Login OTP",
    html: LOGIN_OTP_EMAIL_TEMPLATE.replace("{otp}", otp),
  });

 res.status(200).json({
    success: true,
    message: "OTP sent to email. Please verify.",
  });
});



export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.singleDeviceEnforced) {
    user.sessionVersion = 0;
    await user.save();
  }
  res
    .status(200)
    .cookie("jwt-token", "", { expires: new Date(0), httpOnly: true })
    .json({ success: true, message: "Logged out successfully" });
});



export const forceResetVendorSession = catchAsyncErrors(
  async (req, res, next) => {
    const { username } = req.params;
    const user = await UserAuth.findOne({ username });
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (user.role !== "vendor")
      return next(new ErrorHandler("Only vendor sessions can be reset", 403));

    user.sessionVersion = 0;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "other devices logout successfuly please login again",
      });
  }
);

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Both old and new passwords are required", 400)
    );
  }

  const user = await UserAuth.findById(req.user._id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  // Verify old password
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  // Hash and update password
  user.password = newPassword;

  // Vendor → force logout from all devices
  if (user.role === "vendor") {
    user.sessionVersion = Date.now(); // reset session to force re-login
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully. Please login again.",
  });
});

export const GetMe = catchAsyncErrors(async (req, res, next) => {
  const user = await UserAuth.findById(req.user._id).select("-password");
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, user });
});





export const verifyLoginOtp = async (req, res, next) => {
  const { username, otp } = req.body;

  const user = await UserAuth.findOne({ username });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.otpCode !== otp) return next(new ErrorHandler("Invalid OTP", 400));

  if (user.otpExpiry < Date.now())
    return next(new ErrorHandler("OTP expired", 400));

  user.isOtpVerified = true;
  user.otpCode = null;
  user.otpExpiry = null;

  await user.save();

  // Issue JWT Token
  const token = user.generateJsonWebToken();
  setTokenCookieAndSend(res, user, 200, "Logged in successfully");
};

