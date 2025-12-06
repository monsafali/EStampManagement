// cron/cronJobs.js
import cron from "node-cron";
import { blockInactiveVendors } from "../controllers/cronController.js";




// Runs every month on the 1st at 00:00

cron.schedule("0 0 1 * *", async () => {
  await blockInactiveVendors();
});




console.log("📅 Monthly Vendor Check Cron Job Registered...");
