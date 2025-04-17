import { Request, Response } from "express";
import prisma from "../config/prismaClient";

export const getExchangeRate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const exchangeRate =
      await prisma.exchangeRate.findFirst({
        orderBy: { createdAt: "desc" },
      });

    if (!exchangeRate) {
      return res
        .status(404)
        .json({ message: "No exchange rate found" });
    }

    res.status(200).json({
      exchangeRate,
    });
  } catch (error) {
    console.error(
      "Error retrieving exchange rate :",
      error
    );
    res
      .status(500)
      .json({ message: "Error retrieving exchange rate" });
  }
};
export const getRateHistory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const rates = await prisma.exchangeRate.findMany({
      orderBy: { createdAt: "desc" },
      select: { basePrice: true, createdAt: true },
    });
    if (!rates) {
      res.status(404).json({
        message: "No exchange history collected yet",
      });
    }
    return res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving exchange rate history",
    });
  }
};
