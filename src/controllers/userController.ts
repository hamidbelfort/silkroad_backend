// src/controllers/userController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient"; // import prisma client for DB interaction
import { logUserAction } from "../utils/userActionLog";
import {
  BucketName,
  generateOTP,
  getImageUrl,
} from "../utils/helpers";
import { addMinutes } from "date-fns";
import { generateEmailSubject } from "../utils/email/templates/subjectManager";
import { generateEmailTemplate } from "../utils/email/templates/templateManager";
import { sendCustomEmail } from "../utils/email/sendCustomEmail";
const MAX_ATTEMPTS = 10;
// 1. تابع ثبت‌نام (Register)
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { fullname, email, phone, password } = req.body;

  try {
    // چک کردن وجود کاربر با ایمیل یا یوزرنیم مشابه
    const existingUser = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Another user has been registered using this email",
      });
    }
    const existingPhone = await prisma.users.findUnique({
      where: {
        phone,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Another user has been registered using this phone number",
      });
    }
    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 12);

    // ثبت کاربر جدید در دیتابیس
    const newUser = await prisma.users.create({
      data: {
        fullname,
        phone,
        email,
        password: hashedPassword,
      },
    });
    //remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      message: "User account created successfully.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured while registering new user.",
    });
  }
};
export const getUserLanguage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = (req as any).user?.id; // از middleware گرفته می‌شه
  const { language } = req.body;

  if (!["en", "zh"].includes(language)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid language" });
  }

  try {
    await prisma.users.update({
      where: { id: userId },
      data: { preferredLanguage: language },
    });

    return res.status(200).json({
      success: false,
      message: "Language updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Server error" });
  }
};
// 2. تابع لاگین (Login)
export const loginUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password } = req.body;

  try {
    // چک کردن وجود کاربر با ایمیل
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // مقایسه رمز عبور وارد شده با رمز عبور هش‌شده در دیتابیس
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Email or Password is wrong.",
      });
    }
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Your account is deactivated. Please contact support.",
      });
    }
    await logUserAction({
      userId: user.id,
      action: "Login User",
      description: `User ${user.fullname} logged in successfully.`,
    });
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d", // اعتبار یک روزه
      }
    );
    // موفقیت‌آمیز بودن ورود کاربر
    return res.status(200).json({
      success: true,
      message: "You have successfully signed in.",
      token,
      userId: user.id,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while loggin in.",
    });
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
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // مقایسه رمز عبور قبلی با رمز عبور در دیتابیس
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Old password is wrong!",
      });
    }

    // هش کردن رمز عبور جدید
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // بروزرسانی رمز عبور
    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
    await logUserAction({
      userId: user.id,
      action: "Change Password",
      description: `User ${user.fullname} changed their password.`,
    });
    return res.status(200).json({
      success: true,
      message: "Your password has been changed.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while changing password",
    });
  }
};
export const requestResetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, language } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // حتی اگر کاربر نباشه، پیغام مشابه می‌فرستیم (برای امنیت)
    if (!user) {
      return res.json({
        success: false,
        message:
          "If this email is registered, an OTP has been sent.",
      });
    }

    // حذف تمام OTPهای قبلی این کاربر
    await prisma.passwordResetOTP.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() }, // فقط OTPهای منقضی‌نشده رو پاک کن
      },
    });

    // تولید OTP و زمان انقضا
    const otp = generateOTP();
    const expiresAt = addMinutes(new Date(), 10); // 10 دقیقه اعتبار

    // ذخیره OTP جدید در دیتابیس
    await prisma.passwordResetOTP.create({
      data: {
        otp,
        expiresAt,
        user: { connect: { id: user.id } },
      },
    });
    const mailSubject = generateEmailSubject(
      "resetPassword",
      language
    );
    const htmlContent = generateEmailTemplate(
      "resetPassword",
      {
        verificationCode: otp,
        language,
      }
    );
    await sendCustomEmail({
      to: user.email,
      subject: mailSubject,
      htmlContent,
      userType: "customer",
    });
    return res.json({
      success: true,
      message:
        "If this email is registered, an OTP has been sent.",
    });
  } catch (error) {
    console.error(
      "Error in request-password-reset:",
      error
    );
    return res.status(500).json({
      ersuccess: false,
      message: "Internal server error",
    });
  }
};
export const verifyOtpAndReset = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email",
      });
    }

    const otpRecord =
      await prisma.passwordResetOTP.findFirst({
        where: {
          userId: user.id,
          otp,
        },
      });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await prisma.passwordResetOTP.delete({
        where: { id: otpRecord.id },
      });
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await prisma.passwordResetOTP.delete({
        where: { id: otpRecord.id },
      });
      return res.status(400).json({
        success: false,
        message: "Too many incorrect attempts",
      });
    }

    if (otpRecord.otp !== otp) {
      await prisma.passwordResetOTP.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      return res
        .status(400)
        .json({ success: false, message: "Incorrect OTP" });
    }

    // رمز جدید هش شود
    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // رمز را ذخیره و OTP را حذف کن
    await prisma.$transaction([
      prisma.users.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetOTP.delete({
        where: { id: otpRecord.id },
      }),
    ]);

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  //console.log(id);
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
        profile: {
          select: {
            avatar: true,
          },
        },
      },
    }); // چک کردن وجود کاربر با آیدی
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (user.profile?.avatar) {
      const url = await getImageUrl(
        id,
        BucketName.PROFILE,
        user.profile?.avatar
      );
      if (url !== null) {
        user.profile.avatar = url;
      }
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while getting user.",
    });
  }
};
export const getUserEmail = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        fullname: true,
        email: true,
      },
    });
    return res.status(200).json(user || null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while getting user.",
    });
  }
};
