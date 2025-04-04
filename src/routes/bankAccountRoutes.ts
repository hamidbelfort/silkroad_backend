import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as bankAccountController from "../controllers/bankAccountController";

const router = express.Router();

// Route to create a bank account
router.post(
  "/",
  authenticateUser,
  bankAccountController.createBankAccount
);

// Route to update a bank account
router.put(
  "/:id",
  authenticateUser,
  bankAccountController.updateBankAccount
);

// Route to delete a bank account
router.delete(
  "/:id",
  authenticateUser,
  bankAccountController.deleteBankAccount
);

// Route to get a user's bank accounts by userId (Admin access)
router.get(
  "/user/:userId",
  authenticateUser,
  bankAccountController.getBankAccountsByUserId
);

// Route to get all bank accounts of the logged-in user
router.get(
  "/",
  authenticateUser,
  bankAccountController.getAllBankAccounts
);

export default router;
