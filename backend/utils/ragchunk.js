// utils.js
import { createRequire } from "module";
import fs from "fs/promises";

// Use createRequire to load CommonJS modules
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // pdf-parse returns a FUNCTION

/**
 * Extract text from uploaded file (PDF or TXT).
 */
export async function extractTextFromFile(filepath, mimetype, originalname) {
  // Handle PDFs
  if (
    mimetype === "application/pdf" ||
    originalname.toLowerCase().endsWith(".pdf")
  ) {
    const dataBuffer = await fs.readFile(filepath);

    // pdf-parse is a FUNCTION (NOT pdf.default)
    const parsed = await pdf(dataBuffer);

    return parsed?.text ?? "";
  }

  // Handle TXT files
  if (
    mimetype === "text/plain" ||
    originalname.toLowerCase().endsWith(".txt")
  ) {
    return await fs.readFile(filepath, "utf8");
  }

  return `Unsupported file type: ${originalname}`;
}

/**
 * Chunk text into smaller chunks
 */
export function chunkText(text, chunkSize = 800, overlap = 100) {
  if (!text) return [];

  const words = text.split(/\s+/);
  const chunks = [];
  let current = [];

  for (const w of words) {
    const currentLen = current.join(" ").length;

    if (currentLen + w.length + 1 > chunkSize) {
      chunks.push(current.join(" ").trim());

      // overlap handling
      let tmp = [];
      for (let i = current.length - 1; i >= 0; i--) {
        if (tmp.join(" ").length + current[i].length + 1 > overlap) break;
        tmp.unshift(current[i]);
      }

      current = tmp;
    }

    current.push(w);
  }

  if (current.length) chunks.push(current.join(" ").trim());

  return chunks.filter((c) => c.length > 0);
}

/**
 * Cosine similarity
 */
export function cosineSim(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;

  let dot = 0,
    na = 0,
    nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  if (na === 0 || nb === 0) return 0;

  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
