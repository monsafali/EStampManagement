import express from "express";
import createStamp, {
  createChallan,
  getVendorInventory,
  VerifyStamp,
  AllIssuedStamp,
  searchStamps,
  PayStripe,
  loadStampsAfterStripe,
} from "../controllers/stamp.controller.js";
import { authorizedRole, isAuthenticated } from '../middleware/isAuth.js';

const router = express.Router();


// vendor create challan
router.post(
  "/createChallan",
  isAuthenticated,
  authorizedRole("vendor"),
  createChallan
);

// vendor pay challan via stripe
router.post("/pay-via-stripe", isAuthenticated, authorizedRole("vendor"), PayStripe);

router.post(
  "/stripe-success-load-stamps",
  isAuthenticated,
  authorizedRole("vendor"),
  loadStampsAfterStripe
);



router.post("/generate-pdf",isAuthenticated, createStamp);

router.get("/verify/:stampId", VerifyStamp);


router.get(
  "/AllIssuedStamp",
  isAuthenticated,
  authorizedRole("vendor"),
  AllIssuedStamp
);
router.get("/search", isAuthenticated, authorizedRole("vendor"), searchStamps);


router.get(
  "/getinventory",
  isAuthenticated,
  authorizedRole("vendor"),
  getVendorInventory
);




export default router;