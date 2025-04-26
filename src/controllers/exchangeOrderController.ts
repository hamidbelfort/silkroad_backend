import prisma from "../config/prismaClient";
import { Request, Response } from "express";

// ایجاد سفارش جدید
export const createExchangeOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      amount,
      finalAmount,
      bankAccountId,
      isDisputed,
    } = req.body;

    const newOrder = await prisma.exchangeOrder.create({
      data: {
        userId,
        amount,
        finalAmount,
        bankAccountId,
        isDisputed: isDisputed ?? false,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: true,
      message: "Failed to create order",
    });
  }
};

// دریافت سفارش بر اساس آیدی
export const getExchangeOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const order = await prisma.exchangeOrder.findUnique({
      where: { id: Number(id) },
      include: { bankAccount: true },
    });
    res.json(order || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
//دریافت سفارشات مشتری
export const getExchangeOrdersByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const orders = await prisma.exchangeOrder.findMany({
      where: { userId: id },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
// به‌روزرسانی سفارش (ثبت شماره پیگیری پرداخت)
export const updatePaymentRef = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { paymentRef } = req.body;

    const updatedOrder = await prisma.exchangeOrder.update({
      where: { id: Number(id) },
      data: {
        paymentRef,
        status: "PAID",
      },
    });

    res.json({
      success: true,
      message: "Payment ref updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment ref",
    });
  }
};
