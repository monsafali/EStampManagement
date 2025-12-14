import dotenv from "dotenv";
dotenv.config();


import fs from "fs/promises";
import OpenAI from "openai";

import db from "../database/SqlDb.js";
import { extractTextFromFile, chunkText } from "../utils/ragchunk.js";


const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("❌ Set OPENAI_API_KEY in .env");
  process.exit(1);
}

const client = new OpenAI({ apiKey: OPENAI_KEY });

// SQL
const deleteAllDocsStmt = db.prepare(`DELETE FROM docs`);
const insertDocStmt = db.prepare(`INSERT INTO docs (name) VALUES (?)`);
const insertChunkStmt = db.prepare(`
  INSERT INTO chunks (doc_id, chunk_text, embedding)
  VALUES (?, ?, ?)
`);

export const uploadDocument = async (req, res) => {
  let filePath = null;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = file.path;

    // 1️⃣ extract text
    const rawText = await extractTextFromFile(
      file.path,
      file.mimetype,
      file.originalname
    );

    // 2️⃣ chunk text
    const chunkSize = Number(process.env.CHUNK_SIZE || 800);
    const chunks = chunkText(rawText, chunkSize);

    if (!chunks.length) {
      throw new Error("No text chunks generated");
    }

    // 3️⃣ transaction
    const transaction = db.transaction(() => {
      deleteAllDocsStmt.run();
      const doc = insertDocStmt.run(file.originalname);
      return doc.lastInsertRowid;
    });

    const docId = transaction();

    // 4️⃣ embeddings
    const BATCH = 16;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);

      const resp = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: batch,
      });

      resp.data.forEach((d, index) => {
        insertChunkStmt.run(docId, batch[index], JSON.stringify(d.embedding));
      });
    }

    res.json({
      ok: true,
      message: "Document replaced successfully",
      docId,
      chunks: chunks.length,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }
  }
};
