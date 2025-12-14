
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "Rag.db"));

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS docs (
  id INTEGER PRIMARY KEY ,
  name TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY ,
  doc_id INTEGER,
  chunk_text TEXT,
  embedding TEXT,
  FOREIGN KEY (doc_id) REFERENCES docs(id) ON DELETE CASCADE
);
`);

export default db;
