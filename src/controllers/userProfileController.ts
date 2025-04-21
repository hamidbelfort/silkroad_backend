// controllers/userProfileController.ts
import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { logUserAction } from "../utils/userActionLog";
import { AuthRequest } from "../types/express";
export const createProfile = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { bio, wechat, whatsapp, address } = req.body;
    const userId = req.user?.id; // آی‌دی کاربر از توکن احراز هویت گرفته میشه

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Attempt" });
    }

    // چک کنه که آیا این کاربر قبلاً پروفایل ساخته یا نه
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      await prisma.userProfile.update({
        where: { userId: (req as any).user.id },
        data: { bio, wechat, whatsapp, address },
      });
      await logUserAction({
        userId: (req as any).user.id,
        action: "UPDATE_PROFILE",
        description: "Updated profile.",
      });
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    }

    // ایجاد پروفایل جدید
    await prisma.userProfile.create({
      data: {
        userId,
        wechat,
        whatsapp,
        bio,
        address,
      },
    });
    await logUserAction({
      userId,
      action: "CREATE_PROFILE",
      description: "Created profile.",
    });
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: (req as any).user.id },
    });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    console.log("Error getting profile:", error);
    res.status(500).json({
      success: false,
      message: "Error occured while getting profile data.",
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    await prisma.userProfile.delete({
      where: { userId: (req as any).user.id },
    });

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.log("Error deleting profile:", error);
    res.status(500).json({
      message: "Error occured while deleting profile",
    });
  }
};
