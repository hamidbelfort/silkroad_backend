import express from "express";
import * as companyInfoController from "../controllers/companyInfoController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// Route to create or update company information
router.post(
  "/",
  authenticateUser,
  companyInfoController.createOrUpdateCompanyInfo
);

// Route to get company information
router.get("/", companyInfoController.getCompanyInfo);

export default router;
