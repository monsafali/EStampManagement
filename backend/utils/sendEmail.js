
// import { transporter } from './nodemailer.js';
// import dotenv from "dotenv";
// dotenv.config();


// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.SENDER_EMAIL,
//       to,
//       subject,
//       html,
//     });

//     console.log("📧 Email sent successfully to:", to);
//   } catch (err) {
//     console.error("❌ Email sending error:", err);
//   }
// };



import dotenv from "dotenv";
dotenv.config();

import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await api.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL || "no-replEstamp.com",
        name: "E-Stamp System",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("📧 Email sent successfully via Brevo API to:", to);
  } catch (err) {
    console.error("❌ Email API error:", err.response?.body || err.message);
  }
};
