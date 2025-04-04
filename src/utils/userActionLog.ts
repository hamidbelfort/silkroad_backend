// src/utils/userActionLog.ts

import prisma from "../config/prismaClient";

interface UserActionParams {
  userId: string;
  action: string;
  description?: string; // توضیحات می‌تونه اختیاری باشه
}

export const logUserAction = async ({
  userId,
  action,
  description,
}: UserActionParams) => {
  try {
    // ذخیره عملیات کاربر در دیتابیس
    const newActionLog = await prisma.userActionLog.create({
      data: {
        userId,
        action,
        description,
      },
    });
    return newActionLog;
  } catch (error) {
    console.error("Error logging user action:", error);
    throw new Error("Failed to log user action");
  }
};
