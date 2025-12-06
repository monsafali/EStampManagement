// routes/adminRoutes.js
import express from "express";
import fileUpload from "express-fileupload";


import { isAuthenticated, authorizedRole } from "../middleware/isAuth.js";
import {
  createADCAdmin,
  updateADCAdmin,
  GetAllAdcAdmin,
} from "../controllers/admin.controller.js";


const router = express.Router();
router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

router.get("/getAllADCAdmin", isAuthenticated, authorizedRole("ADCAdmin", "super-admin"), GetAllAdcAdmin);




// Only super-admin can create or update ADCAdmin
router.post(
  "/createADCAdmin",
  isAuthenticated,
  authorizedRole("super-admin"),
  createADCAdmin
);

router.put(
  "/updateADCAdmin/:id",
  isAuthenticated,
  authorizedRole("super-admin"),
  updateADCAdmin
);

export default router;
