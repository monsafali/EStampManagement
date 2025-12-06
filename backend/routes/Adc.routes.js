// routes/vendorRoutes.js
import express from "express";
import fileUpload from "express-fileupload";

import {
  activateVendor,
  createBankUser,
  createVendor,
  deactivateVendor,
  deleteVendor,
  getVendor,
  searchStamps,
  ChangeVendorPassword
} from "../controllers/adc.controller.js";
import { isAuthenticated, authorizedRole } from "../middleware/isAuth.js";



const router = express.Router();
router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// for get how many user i have
router.get(
  "/getallvendor",
  isAuthenticated,
  authorizedRole("ADCAdmin", "super-admin"),
  getVendor
);




// ADCAdmin or super-admin create vendor
router.post(
  "/createvendor",
  isAuthenticated,
  authorizedRole("ADCAdmin", "super-admin"),
  createVendor
);

// ADCAdmin or super-admin can deactivate/delete vendor
router.put(
  "/deactivateVendor/:id",

  isAuthenticated,
  authorizedRole("ADCAdmin", "super-admin"),
  deactivateVendor
);


router.put(
  "/activateVendor/:id",
  isAuthenticated,
  authorizedRole("ADCAdmin", "super-admin"),
  activateVendor
);

router.put(
  "/updatepassword/:id",
  isAuthenticated,
  authorizedRole("ADCAdmin"),
  ChangeVendorPassword
);

router.delete(
  "/deleteVendor/:id",
  isAuthenticated,
  authorizedRole("ADCAdmin", "super-admin"),
  deleteVendor
);



router.post(
  "/createBankUser",
  isAuthenticated,
  authorizedRole("super-admin", "ADCAdmin"),
  createBankUser
);

router.get(
  "/search",
  isAuthenticated,
  authorizedRole("ADCAdmin"),
  searchStamps
);


export default router;
