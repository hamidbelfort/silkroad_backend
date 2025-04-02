// src/routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// مسیر ثبت‌نام
router.post("/register", registerUser);

// مسیر لاگین
router.post("/login", loginUser);

// مسیر تغییر رمز عبور
router.put("/change-password", authenticateUser, changePassword);

export default router;
