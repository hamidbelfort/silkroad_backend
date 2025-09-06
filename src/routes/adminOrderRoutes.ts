import { Router } from "express";
import { getOrdersByStatus } from "../controllers/exchangeOrderController";
import { authenticateUser } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";

const router = Router();

// Secure this route, only authenticated admins can access it.
router.use(authenticateUser, authorizeAdmin);

// Route to get orders based on their status
// Example: /api/admin/orders/PENDING
router.get("/:status", getOrdersByStatus);

export default router;
