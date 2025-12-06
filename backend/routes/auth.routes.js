// routes/authRoutes.js
import express from "express";

import { isAuthenticated } from "../middleware/isAuth.js";
import {
  loginUser,
  logoutUser,
  forceResetVendorSession,
  updatePassword,
  GetMe,
  verifyLoginOtp,
} from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/Getme", isAuthenticated, GetMe);
router.post("/verifyotp", verifyLoginOtp);
router.put("/reset/:username", forceResetVendorSession);
router.put("/updatePassword", isAuthenticated, updatePassword);



export default router;
