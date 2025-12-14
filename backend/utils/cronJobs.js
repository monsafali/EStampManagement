// cron/cronJobs.js
import cron from "node-cron";
import {
  blockInactiveVendors,
  deleteMessagesEvery5Min,
} from "../controllers/cronController.js";



// Runs every month on the 1st at 00:00

cron.schedule("0 0 1 * *", async () => {
  await blockInactiveVendors();
});





cron.schedule("*/30 * * * *", async () => {
  console.log("⏰ Running message cleanup cron...");
  await deleteMessagesEvery5Min();
});



console.log("📅 Monthly Vendor Check Cron Job Registered...");
