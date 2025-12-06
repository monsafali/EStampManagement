// models/userModel.js
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    cnic: { type: String }, // optional for ADCAdmin; vendors/admins may have it
    licenceNo: { type: String },
    district: { type: String },
    districtId: { type: String },
    tehsil: { type: String },
    address: { type: String },
    contactno: { type: String },
    role: {
      type: String,
      enum: ["super-admin", "ADCAdmin", "vendor", "bank"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    deactivated: { type: Boolean, default: false },

    // session control
    sessionVersion: { type: Number, default: 0 }, // >0 means active session for single-device users
    singleDeviceEnforced: { type: Boolean, default: false }, // true for vendors
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" },
    // image stored on Cloudinary
    imageUrl: { type: String },
    public_id: { type: String },
    //otp verification
    otpCode: { type: String },
    otpExpiry: { type: Date },
    isOtpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { userId: this._id, sessionVersion: this.sessionVersion },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );
};

const UserAuth = mongoose.model("UserAuth", userSchema);
export default UserAuth;
