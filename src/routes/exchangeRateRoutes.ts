import express from "express";
import { getExchangeRate } from "../controllers/exchangeRateController";

const router = express.Router();

router.get("/", getExchangeRate);

export default router;
