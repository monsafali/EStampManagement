

import { markChallanPaid } from "../controllers/bank.controller.js";
import { authorizedRole, isAuthenticated } from '../middleware/isAuth.js';

import express from "express";
const router = express.Router();


router.post(
  "/payChallan",
  isAuthenticated,
  authorizedRole("bank"),
  markChallanPaid
);



export default router;
