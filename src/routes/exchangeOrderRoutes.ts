import { Router } from "express";
import {
  createExchangeOrder,
  getExchangeOrder,
  getExchangeOrdersByUserId,
  updatePaymentRef,
  getDisputedOrders,
  getNewOrders,
  updateOrderStatus,
} from "../controllers/exchangeOrderController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateUser, createExchangeOrder); // ایجاد سفارش جدید
router.get("/orders/list", authenticateUser, getNewOrders); //get new orders
router.get(
  "/orders/disputed",
  authenticateUser,
  getDisputedOrders
); //get all disputed orders
router.get(
  "/orders/:id",
  authenticateUser,
  getExchangeOrder
); // دریافت سفارش با آیدی
router.get(
  "/user/:id",
  authenticateUser,
  getExchangeOrdersByUserId
); // دریافت کلیه سفارشات با آیدی

router.patch("/:id", authenticateUser, updateOrderStatus); //update order status
router.patch(
  "/:id/pay",
  authenticateUser,
  updatePaymentRef
); // ثبت شماره پیگیری پرداخت

export default router;
