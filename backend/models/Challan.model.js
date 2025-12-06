import mongoose from "mongoose";
const ChallanSchema = new mongoose.Schema(
  {
    challanId: { type: String, unique: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" },

    items: [
      {
        type: { type: Number, enum: [100, 200, 300], required: true },
        quantity: { type: Number, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Challan = mongoose.model("Challan", ChallanSchema);
export default Challan;
