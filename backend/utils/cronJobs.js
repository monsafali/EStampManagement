// cron/cronJobs.js
import cron from "node-cron";
import https from "https";
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




const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;
