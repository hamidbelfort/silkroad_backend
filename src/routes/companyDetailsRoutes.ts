import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as companyDetailsController from "../controllers/companyDetailsController";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  companyDetailsController.createCompanyDetails
);
router.get(
  "/",
  companyDetailsController.getAllCompanyDetails
);
router.get(
  "/:id",
  companyDetailsController.getCompanyDetailsById
);
router.put(
  "/:id",
  authenticateUser,
  companyDetailsController.updateCompanyDetails
);
router.delete(
  "/:id",
  authenticateUser,
  companyDetailsController.deleteCompanyDetails
);

export default router;
