import { Request, Response } from "express";
import { AuthRequest } from "../types/express";
import prisma from "../config/prismaClient";

// ایجاد حساب بانکی جدید
export const createBankAccount = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const {
      bankName,
      accountOwner,
      accountNumber,
      iban,
      cardNumber,
      expiryYear,
      expiryMonth,
      cvv2,
      cardImage,
    } = req.body;
    const userId = req.user?.id; // مقدار کاربر از میدلور استخراج می‌شود

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized.",
      });
    }

    const newAccount = await prisma.bankAccount.create({
      data: {
        userId,
        bankName,
        accountOwner,
        accountNumber,
        iban,
        cardNumber,
        expiryYear,
        expiryMonth,
        cvv2,
        cardImage,
      },
    });

    res.status(201).json({
      success: true,
      message: "Bank account created successfully",
    });
  } catch (error) {
    console.error(
      "Error occured while creating back account : ",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something bad happened",
    });
  }
};

// ویرایش اطلاعات حساب بانکی
export const updateBankAccount = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const {
      bankName,
      accountOwner,
      accountNumber,
      iban,
      cardNumber,
      expiryYear,
      expiryMonth,
      cvv2,
      cardImage,
    } = req.body;

    const account = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      return res.status(404).json({
        success: false,
        message:
          "Bank account not found or you don't have access permission",
      });
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id },
      data: {
        bankName,
        accountOwner,
        accountNumber,
        iban,
        cardNumber,
        expiryYear,
        expiryMonth,
        cvv2,
        cardImage,
      },
    });

    res.status(201).json({
      success: true,
      message: "Bank account updated successfully",
    });
  } catch (error) {
    console.error(
      "Error accoured while updating bank account : ",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something bad happened",
    });
  }
};

// حذف حساب بانکی
export const deleteBankAccount = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const account = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      return res.status(404).json({
        success: false,
        message:
          "BankAccont not found or you don't have access permission",
      });
    }

    await prisma.bankAccount.delete({ where: { id } });

    res.json({
      success: true,
      message: "Bank Account successfully deleted.",
    });
  } catch (error) {
    console.error(
      "Error occured while deleting bank account :",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something bad happened",
    });
  }
};

// دریافت اطلاعات یک حساب بانکی خاص
export const getBankAccount = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const account = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      return res.status(404).json({
        success: false,
        message:
          "BankAccont not found or you don't have access permission",
      });
    }

    res.json(account);
  } catch (error) {
    console.error(
      "Error occured while getting bank account data :",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something bad happened",
    });
  }
};

// دریافت لیست تمام حساب‌های بانکی کاربر
export const getAllBankAccounts = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
    });

    res.json(accounts);
  } catch (error) {
    console.error(
      "Error occured while getting bank account data :",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something bad happened",
    });
  }
};
export const getBankAccountsByUserId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;

    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
    });

    if (accounts.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No bank accounts associated with user was found.",
      });
    }

    res.json(accounts);
  } catch (error) {
    console.error(
      "Error occured while getting bank account data :",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something bad happened",
    });
  }
};
