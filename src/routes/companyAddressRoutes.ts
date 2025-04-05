import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as companyAddressController from "../controllers/companyAddressController";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  companyAddressController.createCompanyAddress
);
router.get(
  "/",
  companyAddressController.getAllCompanyAddresses
);
router.get(
  "/:id",
  companyAddressController.getCompanyAddressById
);
router.put(
  "/:id",
  authenticateUser,
  companyAddressController.updateCompanyAddress
);
router.delete(
  "/:id",
  authenticateUser,
  companyAddressController.deleteCompanyAddress
);

export default router;
