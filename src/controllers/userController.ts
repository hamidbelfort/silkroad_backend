// src/controllers/userController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient"; // import prisma client for DB interaction
import { logUserAction } from "../utils/userActionLog";
// 1. تابع ثبت‌نام (Register)
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { fullname, email, password } = req.body;

  try {
    // چک کردن وجود کاربر با ایمیل یا یوزرنیم مشابه
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Another user has been registered using this email",
      });
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 12);

    // ثبت کاربر جدید در دیتابیس
    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User account created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Occured while registering new user.",
    });
  }
};

// 2. تابع لاگین (Login)
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    // چک کردن وجود کاربر با ایمیل
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // مقایسه رمز عبور وارد شده با رمز عبور هش‌شده در دیتابیس
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email or Password is wrong." });
    }
    if (!user.isActive) {
      return res.status(400).json({
        message: "Your account is deactivated. Please contact support.",
      });
    }
    await logUserAction({
      userId: user.id,
      action: "Login User",
      description: `User ${user.fullname} logged in successfully.`,
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d", // اعتبار یک روزه
      }
    );
    // موفقیت‌آمیز بودن ورود کاربر
    return res.status(200).json({
      message: "You have successfully signed in.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error occured while loggin in." });
  }
};

// 3. تابع تغییر رمز عبور (Change Password)
export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // چک کردن وجود کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // مقایسه رمز عبور قبلی با رمز عبور در دیتابیس
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is wrong!" });
    }

    // هش کردن رمز عبور جدید
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // بروزرسانی رمز عبور
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
    await logUserAction({
      userId: user.id,
      action: "Change Password",
      description: `User ${user.fullname} changed their password.`,
    });
    return res.status(200).json({
      message: "Your password has been changed.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error occured while changing password",
    });
  }
};
