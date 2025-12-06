import mongoose from "mongoose";

const StampSchema = new mongoose.Schema(
  {
    stampId: String,
    Stamptype: String,
    StampAmount: Number,
    amountWords: String,
    Description: String,
    Applicant: String,
    cnic: String,
    Relation: {
      type: String,
      enum: ["","S/O", "D/O", "W/O", "F/O", "Widow/Of"],
      default: "",
    },
    Relation_Name: {
      type: String,
      default: "",
    },
    agent: String,
    email: String,
    phone: String,
    address: String,
    issueDate: String,
    validity: String,
    reason: String,
    vendorInfo: String,
    qrData: String,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" },
  },
  { timestamps: true }
);

const Stamp = mongoose.model("Stamp", StampSchema);
export default Stamp;
