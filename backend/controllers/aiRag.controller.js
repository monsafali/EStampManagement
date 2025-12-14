import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { io, getReceiverSocketId } from "../utils/socket.js";

import Message from "../models/message.model.js";
import User from "../models/citizen.model.js";
import UserAuth from "../models/UserAuth.model.js";

import db from "../database/SqlDb.js";
import { cosineSim } from "../utils/ragchunk.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------- SQL ----------------
const getAllChunksStmt = db.prepare(`
  SELECT 
    chunks.chunk_text,
    chunks.embedding,
    docs.name as doc_name
  FROM chunks
  JOIN docs ON chunks.doc_id = docs.id
`);







export const askAIRag = async (req, res) => {
  try {
    const { question, userId, topK } = req.body;

    if (!question || !userId) {
      return res.status(400).json({
        success: false,
        error: "question and userId required",
      });
    }

    const K = Number(topK || process.env.TOP_K || 4);

    // 1️⃣ Validate user
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Citizen not found",
      });
    }

    // 2️⃣ Fetch last 3 messages (memory)
    const previousMessages = await Message.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    let conversationContext = "No previous conversation.";

    if (previousMessages.length) {
      conversationContext = previousMessages
        .reverse()
        .map((m) => `User: ${m.userQuery}\nAI: ${m.AiResponse}`)
        .join("\n\n");
    }

    // 3️⃣ DOMAIN CHECK (BEFORE AI)
const domainKeywords = [
  "stamp",
  "e-stamp",
  "estamp",
  "affidavit",
  "certificate",
  "domicile",
  "bank",
  "account",
  "agreement",
  "bond",
  "challan",
  "fee",
  "vendor",
  "apply",
  "process",
  "issue",
  "register",
  "open",
  "creation",
  "nama",
];


    const combinedText =
      question + " " + previousMessages.map((m) => m.userQuery).join(" ");

    const isDomainQuestion = domainKeywords.some((k) =>
      combinedText.toLowerCase().includes(k)
    );

let allowQuestion = isDomainQuestion;

// Soft fallback for unstructured language
if (!allowQuestion) {
  const intentCheck = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Is this question related to stamp paper, affidavits, or e-stamp services in Pakistan? Answer only YES or NO.\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0,
  });

  const intentAnswer = intentCheck.choices[0].message.content.toLowerCase();

  if (intentAnswer.includes("yes")) {
    allowQuestion = true;
  }
}

if (!allowQuestion) {
  return res.json({
    success: true,
    answer:
      "I'm sorry, this question is not related to E-Stamp services. Please ask something relevant.",
  });
}


    // 4️⃣ Vendor data
    const vendors = await UserAuth.find({ role: "vendor" })
      .select("fullname address contactno tehsil district")
      .lean();

    const vendorContext = vendors.length
      ? vendors
          .map(
            (v) =>
              `Name: ${v.fullname}, Address: ${v.address}, Contact: ${v.contactno}`
          )
          .join("\n")
      : "No vendor data available.";

    // 5️⃣ RAG (SAFE SQLite usage)
    let ragContext = "No document context found.";

    const rows = getAllChunksStmt.all();
    if (rows.length) {
      const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
      });

      const qEmbedding = emb.data[0].embedding;

      const topChunks = rows
        .map((r) => ({
          text: r.chunk_text,
          score: cosineSim(qEmbedding, JSON.parse(r.embedding)),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, K);

      ragContext = topChunks.map((c) => c.text).join("\n\n");
    }

    // 6️⃣ Prompt
    const prompt = `
You are a Stamp Vendor Support AI for Punjab Pakistan.

Rules:
- Follow-up questions must be answered using context
- Prefer DOCUMENT data for procedures
- Prefer VENDOR data for location/vendor questions
- If not found, generate answer
- Max 4 short lines
- Use bullet points
- Use markdown
- Simple language
- Do not repeat question
- If question is not related ${domainKeywords} respond with "I'm sorry, this question is not related to E-Stamp services. Please ask something relevant."

--- PREVIOUS CONVERSATION ---
${conversationContext}

--- DOCUMENT DATA ---
${ragContext}

--- VENDOR DATA ---
${vendorContext}

--- QUESTION ---
${question}
`;

    // 7️⃣ OpenAI WITH TIMEOUT PROTECTION
    const aiResp = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), 20000)
      ),
    ]);

    const answer = aiResp.choices[0].message.content.trim();

    // 8️⃣ Save message
    const savedMessage = await Message.create({
      userId,
      userQuery: question,
      AiResponse: answer,
    });

    // 9️⃣ Respond FIRST
    res.json({
      success: true,
      answer,
    });

    // 🔟 Socket emit (NON-BLOCKING)
    const socketId = getReceiverSocketId(userId);
    if (socketId) {
      io.to(socketId).emit("newMessage", savedMessage);
    }
  } catch (err) {
    console.error("AI ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: "AI processing failed. Please try again.",
    });
  }
};






export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ userId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to load messages",
    });
  }
};






export const suggestQuestions = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 3) {
      return res.json({ suggestions: [] });
    }

    const aiResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an assistant that completes user questions.
  "affidavit",
  "certificate",
  "domicile",
  "bank",
  "account",
  "agreement",
  "bond",
  "challan",
  "fee",
  "vendor",
  "apply",
  "process",
  "issue",
  "register",
  "open",
  "creation",
  "nama", certificates.
Task:
- User may type incomplete or broken sentences
- Predict what full question they intend to ask
- Suggest 1 short questions
- Do NOT answer
- Do NOT explain
- Return bullet points only
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const suggestions = aiResp.choices[0].message.content
      .split("\n")
      .map((s) => s.replace(/[-•]/g, "").trim())
      .filter(Boolean);

    res.json({ suggestions });
  } catch (err) {
    console.error("SUGGEST ERROR:", err);
    res.json({ suggestions: [] });
  }
};
