// controllers/userProfileController.ts
import { Request, Response } from "express";
import prisma from "../config/prismaClient";

export const getProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: (req as any).user.id },
    });

    if (!profile) {
      return res
        .status(404)
        .json({ message: "پروفایل یافت نشد" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور", error });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const { bio, wechat, whatsapp, address } = req.body;

    const profile = await prisma.userProfile.update({
      where: { userId: (req as any).user.id },
      data: { bio, wechat, whatsapp, address },
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "خطای سرور", error });
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.userProfile.delete({
      where: { userId: (req as any).user.id },
    });

    res.json({ message: "پروفایل حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطای سرور", error });
  }
};
