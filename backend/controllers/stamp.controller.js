import dotenv from "dotenv";
dotenv.config();
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import bwipjs from "bwip-js";
import Stamp from "../models/Stamp.model.js";
import Challan from "../models/Challan.model.js";
import StampInventory from "../models/StampInventory.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { generateChallanPDF } from "../utils/generateChallanPdf.js";
import crypto from "crypto";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


import mongoose from "mongoose";


function numberToWords(num) {
  const allowed = {
    100: "One Hundred Rupees Only",
    200: "Two Hundred Rupees Only",
    300: "Three Hundred Rupees Only",
  };

  if (!allowed[num]) return "invalid amount";

  return allowed[num];
}

const createStamp = async (req, res) => {
  try {
    const body = req.body;


    const vendorId = req.user._id; // logged-in vendor

    // -------------------------------------
    // 1️⃣ Fetch one available stamp from inventory
    // -------------------------------------
    const inventoryStamp = await StampInventory.findOne({
      vendorId,
      isIssued: false,
      type : body.StampAmount

    });

    if (!inventoryStamp) {
      return res.status(400).json({
        success: false,
        message: "No stamps available. Please buy stamps first.",
      });
    }

    // -------------------------------------
    // 2️⃣ Create Stamp document
    // -------------------------------------
    const tempStamp = new Stamp(body);

    const issueDate = new Date();
    const formattedIssue = issueDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const validityDate = new Date(issueDate);
    validityDate.setDate(validityDate.getDate() + 7);
    const formattedValidity = validityDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const amountWords = numberToWords(Number(body.StampAmount));
    tempStamp.stampId = "PB-BWN-" + inventoryStamp.stampId;
    tempStamp.issueDate = formattedIssue;
    tempStamp.validity = formattedValidity;
    tempStamp.amountWords = amountWords;
    tempStamp.vendorId = vendorId; // optional

    const savedStamp = await tempStamp.save();

    // -------------------------------------
    // 3️⃣ Remove stamp from inventory
    // -------------------------------------
    await inventoryStamp.deleteOne();

    // -------------------------------------
    // 4️⃣ Generate PDF
    // -------------------------------------
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=e-stamp-${savedStamp.stampId}.pdf`,
    });

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#000000")
      .strokeColor("#000000")
      .lineWidth(1); // controls extra bold thickness

    // draw fill + stroke bold
    doc.text("E-STAMP", 0, 20, { align: "center", stroke: true, fill: true });
    // Measure text width to center the underline
    const title = "E-STAMP";
    const titleWidth = doc.widthOfString(title, {
      font: "Helvetica-Bold",
      fontSize: 20,
    });

    // Y position for underline
    const textY = 20 + doc.currentLineHeight(); // line height after text

    // X position to center underline
    const pageWidth = doc.page.width;
    const underlineX = (pageWidth + 8 - titleWidth) / 2.2;

    // Draw underline
    doc
      .moveTo(underlineX, textY + -2) // start (a little below text)
      .lineTo(underlineX + titleWidth, textY + -2) // middle + titleWidth, textY ) // end
      .lineWidth(1.5) // thickness of underline
      .strokeColor("#000000")
      .stroke();

    // -------------------------------------
    // BARCODE (same style)
    // -------------------------------------
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: savedStamp.stampId,
      scale: 2,
      height: 8,
    });

    doc.image(barcodeBuffer, 40, 60, { width: 180, height: 28 });

    // -------------------------------------
    // QR CODE
    // -------------------------------------
    const qrBuffer = await QRCode.toBuffer(
      `${process.env.BACKEND_URL}/api/stamp/verify/${savedStamp.stampId}`
    );

    doc.image(qrBuffer, doc.page.width - 155, 60, {
      width: 100,
      height: 100,
    });

    // -------------------------------------
    // BODY SECTION (same layout)
    // -------------------------------------
    let topY = 100;
    doc.font("Helvetica").fontSize(11);

    doc.text("ID:", 40, topY);
    doc.font("Helvetica-Bold").text(savedStamp.stampId, 170, topY);
    topY += 17;

    // Type
    doc.font("Helvetica").text("Type:", 40, topY);
    doc.font("Helvetica-Bold").text(savedStamp.Stamptype, 170, topY);
    topY += 17;

    // Amount
    doc.font("Helvetica").text("Amount:", 40, topY);
    doc
      .font("Helvetica-Bold")
      .text(`Rs ${savedStamp.StampAmount}/-`, 170, topY);
    topY += 40;

    // QR info text
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Scan for online verification", doc.page.width - 200, 160, {
        align: "right",
        width: 160,
      });

    let currentY = topY;

    // Description
    doc.font("Helvetica").fontSize(11).text("Description:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.Description, 170, currentY);
    currentY += 15;

    doc.font("Helvetica").text("Applicant:", 40, currentY);

    // Draw the applicant name
    doc.font("Helvetica");
    const nameText = savedStamp.Applicant;
    doc.text(nameText, 170, currentY);

    // Measure the name width
    const nameWidth = doc.widthOfString(nameText);

    // Now draw CNIC right after name
    doc.text(` [${savedStamp.cnic}]`, 170 + nameWidth + 5, currentY);

    currentY += 15;

    // S/O
    doc.font("Helvetica").text(savedStamp.Relation, 40, currentY);
    doc.font("Helvetica").text(savedStamp.Relation_Name, 170, currentY);
    currentY += 15;

    // Agent
    doc.font("Helvetica").text("Agent:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.agent, 170, currentY);
    currentY += 15;

    // Address
    doc.font("Helvetica").text("Address:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.address, 170, currentY);
    currentY += 15;

    // Issue Date
    doc.font("Helvetica").text("Issue Date:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.issueDate, 170, currentY);
    currentY += 15;

    // Validity
    doc.font("Helvetica").text("Delisted On/Validity:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.validity, 170, currentY);
    currentY += 15;

    // Amount words
    doc.font("Helvetica").text("Amount in Words:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.amountWords, 170, currentY);
    currentY += 15;

    // Reason
    doc.font("Helvetica").text("Reason:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.reason, 170, currentY);
    currentY += 15;

    // Vendor info
    doc.font("Helvetica").text("Vendor Information:", 40, currentY);
    doc.font("Helvetica").text(savedStamp.vendorInfo, 170, currentY);
    currentY += 25;

    doc.registerFont("UrduFont", "fonts/NotoNastaliqUrdu-Regular.ttf");

    // Box settings
    const padding = 4;
    const boxX = 40;
    const boxY = currentY + 10;
    const boxWidth = 500;
    const textWidth = boxWidth - padding * 3;

    // Measure text height to auto-size box
    const text =
      "نوٹ: یہ ٹرانزیکشن تاریخِ اجرا سے سات دنوں تک کے لیے قابلِ استعمال ہے۔ ای اسٹامپ کی تصدیق بذریعہ ویب سائٹ، کیو آر کوڈ سے کی جا سکتی ہے۔";

    const textHeight = doc.heightOfString(text, {
      width: textWidth,
      align: "right",
      features: ["rtla"],
      baseline: "alphabetic",
      font: "UrduFont",
      fontSize: 8,
    });

    // Draw border box
    doc
      .lineWidth(2)
      .strokeColor("#000000") // pure black color
      .opacity(1)
      .rect(boxX, boxY - 8, boxWidth, textHeight + padding * 10)
      .stroke();

    // Draw text inside box with padding
    doc
      .font("UrduFont")
      .fontSize(8)
      .text(text, boxX + padding, boxY + 8 + padding, {
        width: textWidth,
        align: "right",
        features: ["rtla"],
        baseline: "alphabetic",
      });

    doc.end();
  } catch (err) {
    console.error("STAMP PDF ERROR:", err);
    res.status(500).json({ error: "PDF Generation Failed" });
  }
};
export default createStamp;



export const VerifyStamp = async (req, res) => {
  try {
    const { stampId } = req.params;

    if (!stampId) {
      return res
        .status(400)
        .send("<h1>Invalid Request: No Stamp ID Provided</h1>");
    }

    const stamp = await Stamp.findOne({ stampId });

    if (!stamp) {
      return res.status(404).send(`
        <h1>❌ Invalid Stamp</h1>
        <p>No record found for this stamp ID.</p>
      `);
    }

    return res.status(200).send(`
      <h1>✅ Stamp Verified</h1>
      <p>This stamp is completey verified by PITB.</p>
      <p><b>Stamp ID:</b> ${stamp.stampId}</p>
      <p><b>issued by:</b> ${stamp.Applicant}</p>
      <p><b>Vendor Info:</b> ${stamp.vendorInfo} issued that stamp</p>
      <p><b>Reason:</b> ${stamp.reason}</p>
      <p><b>Amount:</b> ${stamp.StampAmount}</p>
      <p><b>Amount Words:</b> ${stamp.amountWords}</p>
      <p><b>Description:</b> ${stamp.Description}</p>
      <p><b>Agent:</b> ${stamp.agent}</p>
        <p><b>Applicant Email:</b> ${stamp.email}</p>
          <p><b>Applicatnt Phone:</b> ${stamp.phone}</p>

      <p><b>Address:</b> ${stamp.address}</p>
      <p><b>Issue Date:</b> ${stamp.issueDate}</p>
      <p><b>Validity:</b> ${stamp.validity}</p>


    `);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("<h1>Server Error During Verification</h1>");
  }
};


export const createChallan = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide items array [{type, quantity}]",
    });
  }

  try {
    const challanId = crypto.randomBytes(8).toString("hex").toUpperCase();

    const challan = await Challan.create({
      challanId,
      vendorId: req.user.id,
      items,
    });

    
    await generateChallanPDF(challan, res);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Challan error" });
    }
  }
};



export const PayStripe = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array required",
      });
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.type * item.quantity;
    }, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      metadata: {
        vendorId: req.user.id,
        items: JSON.stringify(items), // required later for loading stamps
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "E-Stamp Payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/vendor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ success: false, message: "Stripe error" });
  }
};


export const loadStampsAfterStripe = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const vendorId = session.metadata.vendorId;
    const items = JSON.parse(session.metadata.items);

    let stamps = [];

    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        const stampId = crypto.randomBytes(8).toString("hex").toUpperCase();

        const stamp = await StampInventory.create({
          stampId,
          type: item.type,
          vendorId,
          challanId: null, // since no challan
          isIssued: false,
          Relation: "",
          Relation_Name: "",
        });

        stamps.push(stamp);
      }
    }

    return res.json({
      success: true,
      message: "Payment successful & Stamps loaded",
      stamps,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error loading stamps after payment",
    });
  }
};




export const getVendorInventory = catchAsyncErrors(async (req, res, next) => {
  const stamps = await StampInventory.find({
    vendorId: req.user._id,
    isIssued: false,
  });

  // console.log("🔥 STAMPS FOUND:", stamps.length);

  if (!stamps || stamps.length === 0) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  return res.json({
    success: true,
    message: "Inventory fetched successfully",
    stamps,
  });
});


// get all issued stam


export const AllIssuedStamp = async (req, res) => {
  const issuedStamps = await Stamp.find({ vendorId: req.user._id });
  res.json({
    success: true,
    message: "Issued Stamps Fetched Successfully",
    issuedStamps,
  });
};





export const searchStamps = async (req, res) => {
  try {
    const { from, to, cnic, stampId } = req.query;

    let filter = {};

    // ----------- CNIC SEARCH -----------
    if (cnic) {
      filter.cnic = { $regex: cnic, $options: "i" };
    }

    // ----------- STAMP ID SEARCH -----------
    if (stampId) {
      filter.stampId = { $regex: stampId, $options: "i" };
    }

    // ----------- DATE RANGE SEARCH -----------
    if (from || to) {
      let start = from ? new Date(from) : null;
      let end = to ? new Date(to) : null;

      // Force END OF DAY (fixes your issue)
      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      filter.createdAt = {};
      if (start) filter.createdAt.$gte = start;
      if (end) filter.createdAt.$lte = end;
    }

    const results = await Stamp.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.log("Search Error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};
