import { Router } from "express";
import {
  createExchangeOrder,
  getExchangeOrder,
  getExchangeOrdersByUserId,
  updatePaymentRef,
} from "../controllers/exchangeOrderController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateUser, createExchangeOrder); // ایجاد سفارش جدید
router.get("/:id", authenticateUser, getExchangeOrder); // دریافت سفارش با آیدی
router.get(
  "/user/:id",
  authenticateUser,
  getExchangeOrdersByUserId
); // دریافت کلیه سفارشات با آیدی
router.patch(
  "/:id/pay",
  authenticateUser,
  updatePaymentRef
); // ثبت شماره پیگیری پرداخت

export default router;
