import Challan from "../models/Challan.model.js";
import crypto from "crypto";
import StampInventory from "../models/StampInventory.js";

export const markChallanPaid = async (req, res) => {
  const { challanId } = req.body;

  const challan = await Challan.findOne({ challanId });
  if (!challan) {
    return res.status(404).json({
      success: false,
      message: "Challan not found",
    });
  }

  challan.status = "paid";
  await challan.save();

  let stamps = [];

  // Loop through each item in challan
  for (const item of challan.items) {
    for (let i = 0; i < item.quantity; i++) {
      
      const stampId = crypto.randomBytes(8).toString("hex").toUpperCase(); 

      const stamp = await StampInventory.create({
        stampId,
        type: item.type,
        vendorId: challan.vendorId,
        challanId: challan.challanId,
        isIssued: false,
        Relation: "",
        Relation_Name: "",
      });

      stamps.push(stamp);
    }
  }

  res.json({
    success: true,
    message: "Challan Paid & All Stamps Loaded",
    challan,
    stamps,
  });
};



