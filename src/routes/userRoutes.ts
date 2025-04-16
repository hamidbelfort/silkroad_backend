// src/routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  getUser,
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
// دریافت اطلاعات کاربر
router.get("/:id", authenticateUser, getUser);
export default router;
