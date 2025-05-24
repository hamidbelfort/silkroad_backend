// src/routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  getUser,
  getUserLanguage,
  requestResetPassword,
  verifyOtpAndReset,
} from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// مسیر ثبت‌نام
router.post("/register", registerUser);

// مسیر لاگین
router.post("/login", loginUser);

// مسیر تغییر رمز عبور
router.put(
  "/change-password",
  authenticateUser,
  changePassword
);
//درخواست تغییر رمز عبور
router.post(
  "/request-reset-password",
  requestResetPassword
);
//بررسی و تایید رمز یکبار مصرف
router.post("/verify-otp", verifyOtpAndReset);
// دریافت اطلاعات کاربر
router.get("/:id", authenticateUser, getUser);
//دریافت تنظیمات زبان کاربر
router.post("/language", authenticateUser, getUserLanguage);
export default router;
