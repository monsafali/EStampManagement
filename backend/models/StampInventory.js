import mongoose from "mongoose";
const StampInventorySchema = new mongoose.Schema(
  {
    stampId: { type: String, unique: true },
    type: { type: Number, enum: [100, 200, 300] },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" },
    isIssued: { type: Boolean, default: false },
    challanId: { type: String },
  },
  { timestamps: true }
);

const StampInventory = mongoose.model("StampInventory", StampInventorySchema);

export default StampInventory;
