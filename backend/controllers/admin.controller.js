import { ErrorHandler } from "../middleware/errorMiddleware.js";
import UserAuth from "../models/UserAuth.model.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

import {
  deleteFromCloudinary,
  isFileTypeSupported,
  uploadToCloudinary,
} from "../utils/cloudinaryConfig.js";
import { sendEmail } from "../utils/sendEmail.js";
import { ADC_WELCOME_TEMPLATE } from "../utils/Email_Templates.js";





export const createADCAdmin = catchAsyncErrors(async (req, res, next) => {
  const { fullname, username, email, password, district, districtId } =
    req.body;

  const file = req.files.imageFile;
  if (!file) return next(new ErrorHandler("Image is required", 400));

  if (!isFileTypeSupported(file.name))
    return res
      .status(400)
      .json({ success: false, message: "File type not supported" });

  const upload = await uploadToCloudinary(file, "E-Stamp");

  const newAdmin = new UserAuth({
    fullname,
    username,
    email,
    password,
    district,
    districtId,
    role: "ADCAdmin",
    singleDeviceEnforced: false,
    imageUrl: upload.secure_url,
    public_id: upload.public_id,
  });

  await newAdmin.save();

  // === SEND EMAIL TO NEW ADC ADMIN ===
  await sendEmail({
    to: email,
    subject: "🎉 Your ADC Admin Account is Created",
    html: ADC_WELCOME_TEMPLATE({ fullname, username, password }),
  });

  res.status(201).json({
    success: true,
    message: "ADCAdmin created & email sent",
    user: newAdmin,
  });
});



export const GetAllAdcAdmin = catchAsyncErrors(async (req, res, next) => {
  const adcAdmins = await UserAuth.find({ role: "ADCAdmin" }).select(
    "-password"
  );
  res.status(200).json({ success: true, adcAdmins });
});






export const updateADCAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const admin = await UserAuth.findById(id);
  if (!admin) return next(new ErrorHandler("ADCAdmin not found", 404));
  if (admin.role !== "ADCAdmin")
    return next(new ErrorHandler("Target is not ADCAdmin", 400));

  // -----------------------------
  // 1. Update TEXT fields
  // -----------------------------
  const allowed = ["fullname", "username", "email", "password", "district"];
  allowed.forEach((key) => {
    if (req.body[key]) admin[key] = req.body[key];
  });

  // -----------------------------
  // 2. Update IMAGE if provided
  // -----------------------------
  if (req.files?.imageFile) {
    const file = req.files.imageFile;

    if (!isFileTypeSupported(file.name))
      return next(
        new ErrorHandler("File type not supported (jpg, jpeg, png)", 400)
      );

    // Delete old image from Cloudinary
    if (admin.public_id) {
      await deleteFromCloudinary(admin.public_id);
    }

    // Upload new image
    const uploaded = await uploadToCloudinary(file, "E-Stamp");

    // Update DB fields
    admin.imageUrl = uploaded.secure_url;
    admin.public_id = uploaded.public_id;
  }

  // Save final result
  await admin.save();

  res.status(200).json({
    success: true,
    message: "ADCAdmin updated successfully",
    user: admin,
  });
});

