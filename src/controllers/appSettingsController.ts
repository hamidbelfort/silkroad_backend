import prisma from "../config/prismaClient";
import { Request, Response } from "express";

// دریافت تنظیمات
export const getAppSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const settings = await prisma.appSettings.findFirst();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// ویرایش تنظیمات
export const updateAppSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      orderDisputeThreshold,
      adminEmail,
      profitMargin,
    } = req.body;

    const updatedSettings = await prisma.appSettings.upsert(
      {
        where: { id: 1 },
        update: { orderDisputeThreshold, adminEmail },
        create: {
          id: 1,
          orderDisputeThreshold,
          adminEmail,
          profitMargin,
        },
      }
    );

    res.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};
