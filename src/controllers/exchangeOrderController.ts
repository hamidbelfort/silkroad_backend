import prisma from "../config/prismaClient";
import { Request, Response } from "express";
import { sendCustomEmail } from "../utils/email/sendCustomEmail";
import { generateEmailTemplate } from "../utils/email/templates/templateManager";
import { generateEmailSubject } from "../utils/email/templates/subjectManager";
import { logUserAction } from "../utils/userActionLog";
import { getSettingValue } from "./settingsController";
// ایجاد سفارش جدید
export const createExchangeOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      amount,
      finalAmount,
      bankAccountId,
      isDisputed,
      language = "zh",
    } = req.body;
    const userId = (req as any).user?.id;
    // 1. استعلام کاربر از دیتابیس
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        fullname: true,
        email: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: true, message: "User not found" });
    }
    //2.استعلام سفارش های ثبتی کاربر
    const orders = await prisma.exchangeOrder.findMany({
      where: {
        userId,
        status: {
          in: [
            "PENDING",
            "WAITING_REVIEW",
            "WAITING_PAYMENT",
          ],
        },
      },
    });
    if (orders && orders.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already orders in queue",
      });
    }
    // 3. ثبت سفارش در دیتابیس
    const order = await prisma.exchangeOrder.create({
      data: {
        userId,
        amount,
        finalAmount,
        bankAccountId,
        isDisputed: isDisputed ?? false,
        status: isDisputed ? "WAITING_REVIEW" : "PENDING",
        expiredAt: isDisputed
          ? new Date(Date.now() + 12 * 60 * 60 * 1000)
          : null,
      },
    });
    //4. ارسال ایمیل به مشتری
    await sendOrderEmailToCustomer(
      isDisputed,
      user.email,
      user.fullname!,
      order.id,
      language
    );
    //5. ارسال ایمیل به مدیر
    await sendOrderEmailToAdmin({
      customerName: user.fullname!,
      orderId: order.id,
      amount,
      finalAmount,
      status: order.status,
      language: "en",
    });
    //6.ثبت وقایع
    await logUserAction({
      userId,
      action: "CREATE_EXCHANGE_ORDER",
      description: `Created exchange order ${order.id}`,
    });
    res.status(201).json({
      success: true,
      message: "Order submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};
const sendOrderEmailToAdmin = async ({
  customerName,
  orderId,
  amount,
  finalAmount,
  status,
  language,
}: {
  customerName: string;
  orderId: number;
  amount: number;
  finalAmount: number;
  status: string;
  language: "fa" | "en" | "zh";
}) => {
  try {
    const templateType = "newOrderNotification";
    const subject = generateEmailSubject(
      templateType,
      language
    );
    const htmlContent = generateEmailTemplate(
      templateType,
      {
        customerName,
        orderId,
        amount,
        finalAmount,
        status,
        language,
      }
    );
    const adminMail = await getSettingValue("ADMIN_EMAIL");
    if (adminMail && adminMail !== "") {
      await sendCustomEmail({
        to: adminMail,
        subject,
        htmlContent,
        userType: "admin",
      });
    }
  } catch (error: any) {
    const errorMsg = (error as Error).message;
    console.log(
      `Error while sending email to admin : ${errorMsg}`
    );
  }
};
const sendOrderEmailToCustomer = async (
  isDisputed: boolean,
  email: string,
  fullname: string,
  orderId: number,
  language: any
) => {
  try {
    const templateType = isDisputed
      ? "reviewNeeded"
      : "confirmOrder";
    const subject = generateEmailSubject(
      templateType,
      language
    );
    const htmlContent = generateEmailTemplate(
      templateType,
      {
        customerName: fullname,
        orderId: orderId,
        language,
      }
    );
    await sendCustomEmail({
      to: email,
      subject,
      htmlContent,
      userType: "customer",
    });
  } catch (error: any) {
    const errorMsg = (error as Error).message;
    console.log(
      `Error while sending email to user : ${errorMsg}`
    );
  }
};
// دریافت سفارش بر اساس آیدی
export const getExchangeOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }
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
): Promise<any> => {
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
): Promise<any> => {
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
export const getNewOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const newOrders = await prisma.exchangeOrder.findMany({
      where: {
        status: "PENDING",
      },
    });
    res.json(newOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch new orders",
    });
  }
};

export const getDisputedOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const disputedOrders =
      await prisma.exchangeOrder.findMany({
        where: {
          status: "WAITING_REVIEW",
        },
      });
    res.json(disputedOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch disputed orders",
    });
  }
};
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status === "") {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }
    const updatedOrder = await prisma.exchangeOrder.update({
      where: { id: Number(id) },
      data: {
        status,
      },
    });
    if (!updatedOrder) {
      return res.json({
        success: false,
        message: "Order status update failed",
      });
    }
    return res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
export const updateOrderDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { amount, finalAmount } = req.body;
    const updatedOrder = await prisma.exchangeOrder.update({
      where: { id: Number(id) },
      data: {
        amount,
        finalAmount,
      },
    });
    if (!updatedOrder) {
      return res.json({
        success: false,
        message: "Order status update failed",
      });
    }
    await logUserAction({
      userId,
      action: "UPDATE_ORDER_DETAILS",
      description: `Order details ${updatedOrder.id} updated by ${id}`,
    });
    return res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update order details",
    });
  }
};
