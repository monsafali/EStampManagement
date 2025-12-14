
import express from "express";
import { askAIRag, getMessages, suggestQuestions } from "../controllers/aiRag.controller.js";

const router = express.Router();

// Ask AI (MongoDB + RAG + Socket)
router.post("/ask", askAIRag);

// Load chat history
router.get("/messages/:userId", getMessages);
router.post("/suggest", suggestQuestions)

export default router;
