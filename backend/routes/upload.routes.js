import express from "express";
import multer from "multer";
import { uploadDocument } from "../controllers/upload.js";
import { authorizedRole, isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  isAuthenticated,
  authorizedRole("super-admin"),
  upload.single("file"),
  uploadDocument
);

export default router;

