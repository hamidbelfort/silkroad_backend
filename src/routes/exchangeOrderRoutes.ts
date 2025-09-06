import { Router } from "express";
import {
  createExchangeOrder,
  getExchangeOrdersByUserId,
  getExchangeOrder,
  updatePaymentRef,
} from "../controllers/exchangeOrderController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// A user must be authenticated for all these routes
router.use(authenticateUser);

// Create a new order
router.post("/", createExchangeOrder);

// Get all orders for the logged-in user (assuming controller is adapted to get ID from req.user)
router.get("/", getExchangeOrdersByUserId);

// Get a specific order by its ID
router.get("/:id", getExchangeOrder);

// Update payment reference for an order
router.put("/:id/payment-ref", updatePaymentRef);

export default router;
