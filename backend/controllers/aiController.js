import UserAuth from "../models/UserAuth.model.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple DB checker: tries to detect keywords to match vendors
const getRelevantVendors = async (question) => {
  // We'll fetch all tehsils from DB
  const tehsils = await UserAuth.distinct("tehsil", { role: "vendor" });

  // Check if question mentions a tehsil
  const matchedTehsil = tehsils.find((t) =>
    question.toLowerCase().includes(t.toLowerCase())
  );

  if (!matchedTehsil) return [];

  const vendors = await UserAuth.find({
    tehsil: matchedTehsil,
    role: "vendor",
  }).select("fullname contactno address district tehsil");

  return vendors;
};

export const askAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res
        .status(400)
        .json({ success: false, error: "Question is required" });

    // Check if DB is relevant
    const vendors = await getRelevantVendors(question);

    let context = "";
    if (vendors.length > 0) {
      context = "Database info of vendors:\n";
      context += vendors
        .map(
          (v, i) =>
            `${i + 1}. Name: ${v.fullname}, Contact: ${
              v.contactNo || "N/A"
            }, Address: ${v.address}, District: ${v.district}, Tehsil: ${
              v.tehsil
            }
             Vendor Contact No: ${v.contactno},
            `
        )
        .join("\n");
    } else {
      context = "No relevant vendor info from database.";
    }

    const prompt = `
You are a professional stamp vendor assistant.
Answer the user's question accurately.

If relevant, use the database info provided below.
Otherwise, answer from general knowledge.

Database Info:
${context}

Question: ${question}

Respond professionally, clearly, and politely.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const answer = response.choices[0].message.content;

    res.status(200).json({ success: true, answer, rawData: vendors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "AI processing failed." });
  }
};
