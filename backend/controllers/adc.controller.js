import { ErrorHandler } from "../middleware/errorMiddleware.js";

import UserAuth from "../models/UserAuth.model.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";

import { sendEmail } from "../utils/sendEmail.js";

import Stamp from "../models/Stamp.model.js";
import {
  isFileTypeSupported,
  uploadToCloudinary,
} from "../utils/cloudinaryConfig.js";
import { VENDOR_ACTIVATION_EMAIL_TEMPLATE, VENDOR_DEACTIVATION_EMAIL_TEMPLATE, Vendor_Password_Change_TEMPLATE, Vendor_WELCOME_TEMPLATE } from "../utils/Email_Templates.js";





export const createVendor = catchAsyncErrors(async (req, res, next) => {
  const adcAdminId = req.user._id;
  const {
    fullname,
    username,
    password,
    email,
    cnic,
    licenceNo,
    district,
    tehsil,
    address,
    contactno,
  } = req.body;

  const file = req.files.imageFile;
  if (!file) return next(new ErrorHandler("Image is required", 400));

  if (!isFileTypeSupported(file.name))
    return res
      .status(400)
      .json({ success: false, message: "File type not supported" });
  
 
    const exists = await UserAuth.findOne({ username });
    if (exists) return  res.json({success: false, message: "Username already exit"});
  

  const upload = await uploadToCloudinary(file, "E-Stamp");

  const vendor = new UserAuth({
    fullname,
    username,
    password,
    email,
    cnic,
    licenceNo,
    district,
    tehsil,
    address,
    contactno,
    role: "vendor",
    singleDeviceEnforced: true,
    createdBy: adcAdminId,
    imageUrl: upload.secure_url,
    public_id: upload.public_id,
  });

  await vendor.save();
  await sendEmail({
    to: email,
    subject: "🎉 Your Vendor Account is Created",
    html: Vendor_WELCOME_TEMPLATE({
      fullname,
      username,
      password,
    }),
  });


  res
    .status(201)
    .json({
      success: true,
      message: "Vendor created & email sent",
      user: vendor,
    });
});



export const getVendor = catchAsyncErrors(async (req, res, next) => {
  const adcAdminId = req.user._id;
  const vendors = await UserAuth.find({
    role: "vendor",
    createdBy: adcAdminId,
  }).select("-password");
  res.status(200).json({ success: true, vendors });
});
/**
 * Deactivate vendor (ADCAdmin or super-admin)
 */
export const deactivateVendor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  console.log("Deactivate request for ID:", id);

  const vendor = await UserAuth.findById(id);
  console.log("Vendor before update:", vendor);

  const updatedVendor = await UserAuth.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  console.log("Vendor after update:", updatedVendor);

  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });
  }

    await sendEmail({
      to: vendor.email,
      subject: "Your Account Has Been Deactivated",
      html: VENDOR_DEACTIVATION_EMAIL_TEMPLATE.replace(
        "{fullname}",
        vendor.fullname
      ),
    });

  res.status(200).json({
    success: true,
    message: "Vendor deactivated successfully & send mail",
    user: updatedVendor,
  });
});

export const activateVendor = async (req, res) => {
  const vendor = await UserAuth.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
await sendEmail({
  to: vendor.email,
  subject: "Your Vendor Account Has Been Activated",
  html: VENDOR_ACTIVATION_EMAIL_TEMPLATE.replace("{fullname}", vendor.fullname),
});


  res.status(200).json({
    success: true,
    message: "Vendor activated successfully",
    vendor,
  });
};

/**
 * Delete vendor
 */
export const deleteVendor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const vendor = await UserAuth.findById(id);
  if (!vendor) return next(new ErrorHandler("Vendor not found", 404));
  if (vendor.role !== "vendor")
    return next(new ErrorHandler("Target is not a vendor", 400));

  // Optionally remove cloudinary image
  if (vendor.image && vendor.image.public_id) {
    try {
      // lazy import cloudinary to avoid circular import
      await cloudinary.uploader.destroy(vendor.image.public_id);
    } catch (e) {
      // ignore cloudinary deletion errors
      console.warn("Cloudinary cleanup failed", e.message);
    }
  }

  await vendor.deleteOne();
  res.status(200).json({ success: true, message: "Vendor deleted" });
});




export const ChangeVendorPassword = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const newPassword = req.body.newPassword;
  const vendor = await UserAuth.findById(id);
  if (!vendor) return next(new ErrorHandler("Vendor not found", 404));
  if (vendor.role !== "vendor")
    return next(new ErrorHandler("Target is not a vendor", 400));

  vendor.password = newPassword;
  await vendor.save();
await sendEmail({
  to: vendor.email,
  subject: "Your Vendor Account Password Reset Succesfuly",
  html: Vendor_Password_Change_TEMPLATE({
    fullname: vendor.fullname,
    username: vendor.username,
    newPassword: newPassword,
  }),
});
  res.status(200).json({ success: true, message: "Password changed" });
});


export const createBankUser = catchAsyncErrors(async (req, res, next) => {
  const { fullname, username, password, email } = req.body;

  if (!fullname || !username || !password || !email) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const exists = await UserAuth.findOne({ username });
  if (exists) return next(new ErrorHandler("Username already used", 400));

  const user = await UserAuth.create({
    fullname,
    username,
    password,
    email,
    role: "bank",
  });

  res.json({
    success: true,
    message: "Bank user created",
    user,
  });
});





export const searchStamps = async (req, res) => {
  try {
    const { from, to, vendorId } = req.query;

    let filter = {};

    // Vendor filter (optional but recommended)
    if (vendorId) {
      filter.vendorId = vendorId;
    }

    // --------- DATE RANGE FIXED ------------
    if (from || to) {
      let start = from ? new Date(from) : null;
      let end = to ? new Date(to) : null;

      if (end) end.setHours(23, 59, 59, 999);

      filter.createdAt = {};
      if (start) filter.createdAt.$gte = start;
      if (end) filter.createdAt.$lte = end;
    }

    const results = await Stamp.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.log("Search Error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};
