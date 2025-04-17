import express from "express";
import {
  getExchangeRate,
  getRateHistory,
} from "../controllers/exchangeRateController";
import { authenticateUser } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/", authenticateUser, getExchangeRate);
router.get("/history", getRateHistory);

export default router;
