import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";


console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_KEY:", process.env.SMTP_KEY ? "✅ Exists" : "❌ Missing");



export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
});



