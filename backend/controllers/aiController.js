import OpenAI from "openai";
import { io, getReceiverSocketId } from "../utils/socket.js";
import Message from "../models/message.model.js";
import User from "../models/citizen.model.js";
import UserAuth from "../models/UserAuth.model.js";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// get all vendor

export const askAI = async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || !userId) {
      return res.status(400).json({
        success: false,
        error: "Question and userId are required",
      });
    }

    // 1. Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User (Citizen) not found",
      });
    }

    // 2. Fetch all required vendor data
    // NOTE: We exclude 'password' and only select the necessary fields.
    const allVendors = await UserAuth.find({ role: "vendor" }).select(
      "fullname username email cnic licenceNo district tehsil address contactno"
    );

    // 3. Format Vendor Data for the AI Prompt
    let vendorDataForAI = "No vendor data available.";

    if (allVendors && allVendors.length > 0) {
      // Create a clear, easily parseable string for the AI
      vendorDataForAI = allVendors
        .map((vendor) => {
          return `
- Full Name: ${vendor.fullname}
  Username: ${vendor.username}
  Email: ${vendor.email}
  CNIC/License No: ${vendor.cnic}
  District: ${vendor.district}
  Tehsil: ${vendor.tehsil}
  Address: ${vendor.address}
  Contact No: ${vendor.contactno}
        `.trim();
        })
        .join("\n---\n"); // Separate each vendor with a distinct delimiter
    }

    //------------------------------------------------------------
    // 4. AI Prompt: Injecting the vendor data
    //------------------------------------------------------------
    const prompt = `
You are a helpful Stamp Vendor Support AI for Punjab Pakistan. Your role is to assist citizens with general queries and specifically with finding Stamp Vendors based on their location (Tehsil/District).

--- VENDOR DATA FOR CONTEXT ---
Use the following list of active Stamp Vendors to answer location-specific queries (e.g., "Give me Vendor of tehsil Fort Abbas").
If the user asks for a vendor in a location *not* listed, you must state that no vendor is found for that area in your current records.
Format your vendor response clearly with full details.

${vendorDataForAI}

--- USER QUESTION ---
User Question:
${question}

Answer in a clear, friendly and helpful way. If you provide vendor information, make it easy to read.
`;

    //------------------------------------------------------------
    // AI Response Generation
    //------------------------------------------------------------
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini", // A fast and capable model for this task
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // Keep temperature low for factual/database-driven tasks
    });

    const answer = aiResponse.choices[0].message.content;

    //------------------------------------------------------------
    // Save to DB in ONE message document
    //------------------------------------------------------------
    const savedMessage = await Message.create({
      userId,
      userQuery: question,
      AiResponse: answer,
    });

    //------------------------------------------------------------
    // Emit real-time message to frontend
    //------------------------------------------------------------
    const socketId = getReceiverSocketId(userId);

    if (socketId) {
      io.to(socketId).emit("newMessage", savedMessage);
    }

    //------------------------------------------------------------
    // Send back API response
    //------------------------------------------------------------
    res.json({
      success: true,
      answer,
      savedMessage,
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({
      success: false,
      error: "AI processing failed",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const msgs = await Message.find({ userId }).sort({ createdAt: 1 });

    return res.json({
      success: true,
      messages: msgs,
    });
  } catch (err) {
    console.error("FETCH MESSAGES ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to load messages",
    });
  }
};
