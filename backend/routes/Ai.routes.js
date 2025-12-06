import express from "express";
import { askAI, getMessages } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", askAI);
router.get("/messages/:userId", getMessages);

export default router;
