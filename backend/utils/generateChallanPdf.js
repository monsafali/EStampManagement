import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import UserAuth from "../models/UserAuth.model.js";



export function numberToWords(num) {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if ((num = num.toString()).length > 9) return "Overflow";
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return "";
  let str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
      : "";
  str += n[4] != 0 ? a[n[4]] + " Hundred " : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str.trim();
}



export async function generateChallanPDF(Challan, res) {
  try {
    const vendor = await UserAuth.findById(Challan.vendorId);
    if (!vendor) throw new Error("Vendor not found");

    const doc = new PDFDocument({ size: "A4", margin: 25 });

    // Collect PDF in memory
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="challan_${Challan.challanId}.pdf"`,
        "Content-Length": pdfBuffer.length,
      });

      res.end(pdfBuffer);
    });

    // ───────────────────────────────────────────────
    // HEADER
    // ───────────────────────────────────────────────
    doc.fontSize(16).font("Helvetica-Bold").text("CHALLAN FORM NO. 32-A", {
      align: "center",
    });

    doc.fontSize(12).font("Helvetica-Bold").text("Treasury Copy", {
      align: "center",
    });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("CHALLAN OF CASH/TRANSFER/CLEARING PAID INTO THE", {
        align: "center",
      });

    doc.text("Fort Abbas, Bahawalnagar", { align: "center" });

    // QR Code
    const qrText = `${process.env.BACKEND_URL}/api/challan/verify/${Challan.challanId}`;
    const qrBuffer = await QRCode.toBuffer(qrText);
    doc.image(qrBuffer, 450, 10, { width: 80 });

    doc.fontSize(9).text(Challan.challanId, 445, 90);

    // doc.moveDown(2);

    // ───────────────────────────────────────────────
    // MAIN TABLE OUTLINE
    // ───────────────────────────────────────────────
    const startY = 110;

    doc.rect(25, startY, 550, 300).stroke();

    doc
      .moveTo(150, startY)
      .lineTo(150, startY + 300)
      .stroke();
    doc
      .moveTo(330, startY)
      .lineTo(330, startY + 300)
      .stroke();
    doc
      .moveTo(420, startY)
      .lineTo(420, startY + 300)
      .stroke();

    doc
      .moveTo(25, startY + 30)
      .lineTo(575, startY + 30)
      .stroke();

    // ───────────────────────────────────────────────
    // HEADER TEXT (Table)
    // ───────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(9);
    doc.text("By Whom\nTendered", 25, startY + 10, { width: 80 });

    doc.text(
      "Name, designation and\naddress of the person on\nwhose behalf money is paid",
      150,
      startY + 10,
      { width: 100 }
    );

    doc.text(
      "Full particulars of the remittance and\nthe authority (if any)",
      330,
      startY + 10,
      { width: 190 }
    );

    doc.text("Amount\n(In Rupees)", 420, startY + 10, { width: 100 });
    doc.text("Head of\nAccount", 520, startY + 10, { width: 60 });

    // ───────────────────────────────────────────────
    // LEFT COLUMN — Vendor Info
    // ───────────────────────────────────────────────
    doc.font("Helvetica").fontSize(9);

    doc.text(
      `Name:\n${vendor.fullname}\nCNIC: ${vendor.cnic || "—"}`,
      30,
      startY + 40
    );

    doc.text(
      `Applicant\nName: ${vendor.fullname}\nCNIC: ${vendor.cnic}\nAddress: ${
        vendor.address || "—"
      }`,
      155,
      startY + 40
    );

    // ───────────────────────────────────────────────
    // MIDDLE COLUMN — Denomination Details
    // ───────────────────────────────────────────────
    doc.text("Low Denomination Stamp\nCommission", 335, startY + 40);

    doc.rect(340, startY + 80, 130, 90).stroke();

    doc.font("Helvetica-Bold").text("Denominations", 365, startY + 85);
    doc.font("Helvetica").fontSize(9);

    doc.text("Denomination", 345, startY + 105);
    doc.text("No. of Stamps", 395, startY + 105);
    doc.text("Amount", 455, startY + 105);

    let y = startY + 120;
    let totalAmount = 0;
    let commission = 45;

    for (const item of Challan.items) {
      const amount = item.type * item.quantity;
      totalAmount += amount;

      doc.text(item.type, 350, y);
      doc.text(item.quantity, 405, y);
      doc.text(amount, 460, y);

      y += 15;
    }

    const finalTotal = totalAmount + commission;

    // AMOUNT COLUMN
    doc.font("Helvetica").text(`${totalAmount}/-`, 430, startY + 40);

    // HEAD OF ACCOUNT
    doc.text("B02701", 525, startY + 40);

    // ───────────────────────────────────────────────
    // FOOTER
    // ───────────────────────────────────────────────
    doc.moveDown(4);

    doc.fontSize(10).text(`Amount in Words: ${numberToWords(finalTotal)} Only`);

    doc.moveDown(1);

    doc
      .fontSize(8)
      .text(
        "Disclaimer: Created on the basis of information provided by applicant. Only one set of copies is acceptable...",
        { align: "justify" }
      );

    doc.end();
  } catch (error) {
    console.log("PDF ERROR:", error);
    res.status(500).json({ success: false, message: "PDF generation failed" });
  }
}








