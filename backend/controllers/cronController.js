// controllers/cronController.js

import moment from "moment";

import Stamp from '../models/Stamp.model.js';
import UserAuth from '../models/UserAuth.model.js';



export const blockInactiveVendors = async () => {
  try {
    console.log("🚀 Cron Job Started: Checking inactive vendors...");

    // last 30 days
    const last30Days = moment().subtract(30, "days").toDate();

    // find vendors who issued at least 1 stamp in last 30 days
    const activeVendors = await Stamp.distinct("vendorId", {
      createdAt: { $gte: last30Days },
    });

    // find vendors who did NOT issue any stamp
    const inactiveVendors = await UserAuth.find({
      role: "vendor",
      _id: { $nin: activeVendors },
      isActive: true, // only block active ones
    });

    if (!inactiveVendors.length) {
      console.log("✨ No inactive vendors found.");
      return;
    }

    // block all inactive vendors
    await UserAuth.updateMany(
      {
        _id: { $in: inactiveVendors.map((v) => v._id) },
      },
      {
        $set: {
          isActive: false,
          deactivated: true,
        },
      }
    );

    console.log(
      `🚫 Blocked ${inactiveVendors.length} inactive vendors automatically.`
    );
  } catch (error) {
    console.error("❌ Error in blockInactiveVendors Cron:", error);
  }
};
