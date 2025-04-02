import { Request, Response } from "express";
import prisma from "../config/prismaClient";

export const getExchangeRate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const exchangeRate = await prisma.exchangeRate.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!exchangeRate) {
      return res.status(404).json({ message: "نرخ ارز یافت نشد" });
    }

    res.json({
      basePrice: exchangeRate.basePrice,
      buyPrice: exchangeRate.buyPrice,
      sellPrice: exchangeRate.sellPrice,
      updatedAt: exchangeRate.createdAt,
    });
  } catch (error) {
    console.error("خطا در دریافت نرخ ارز:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
};
