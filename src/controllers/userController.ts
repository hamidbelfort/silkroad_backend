// src/controllers/userController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient"; // import prisma client for DB interaction

// 1. تابع ثبت‌نام (Register)
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, email, password } = req.body;

  try {
    // چک کردن وجود کاربر با ایمیل یا یوزرنیم مشابه
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "کاربر با این اطلاعات قبلا ثبت شده است" });
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 12);

    // ثبت کاربر جدید در دیتابیس
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ message: "کاربر با موفقیت ثبت شد", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطا در ثبت کاربر" });
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
      return res.status(400).json({ message: "کاربر با این ایمیل پیدا نشد" });
    }

    // مقایسه رمز عبور وارد شده با رمز عبور هش‌شده در دیتابیس
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "رمز عبور اشتباه است" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d", // اعتبار یک روزه
      }
    );
    // موفقیت‌آمیز بودن ورود کاربر
    return res.status(200).json({ message: "ورود موفقیت‌آمیز", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطا در لاگین" });
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
      return res.status(400).json({ message: "کاربر پیدا نشد" });
    }

    // مقایسه رمز عبور قبلی با رمز عبور در دیتابیس
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "رمز عبور قبلی اشتباه است" });
    }

    // هش کردن رمز عبور جدید
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // بروزرسانی رمز عبور
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return res
      .status(200)
      .json({ message: "رمز عبور با موفقیت تغییر یافت", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطا در تغییر رمز عبور" });
  }
};
