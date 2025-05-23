import prisma from "../config/prismaClient";
import { Request, Response } from "express";
import { AuthRequest } from "../types/express";
import { logUserAction } from "../utils/userActionLog";
export const createFAQ = async (req: Request, res: Response): Promise<any> => {
  try {
    const count = await prisma.fAQ.count();
    if (count > 20) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot add more than 20 FAQs." });
    }
    const { question, answer } = req.body;
    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
      },
    });
    const userId = (req as any).user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "CREATE_FAQ",
        description: "Created FAQ.",
      });
    }

    return res.status(201).json({ success: true, message: "FAQ Created." });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create FAQ." });
  }
};

export const getAllFAQs = async (req: Request, res: Response): Promise<any> => {
  try {
    const faqs = await prisma.fAQ.findMany();
    return res.status(200).json(faqs);
  } catch (err) {
    console.log(`Failed to fetch FAQs : ${err}`);
    return null;
  }
};

export const updateFAQ = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    await prisma.fAQ.update({
      where: { id },
      data: req.body,
    });
    const userId = (req as any).user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "UPDATE_FAQ",
        description: `Updated FAQ ${id}`,
      });
    }
    return res.status(200).json({ success: true, message: "FAQ Updated" });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update FAQ." });
  }
};

export const deleteFAQ = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    await prisma.fAQ.delete({ where: { id } });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "DELETE_FAQ",
        description: `Deleted FAQ ${id}`,
      });
    }
    return res.status(200).json({ success: true, message: "FAQ deleted." });
  } catch {
    return res
      .status(500)
      .json({ success: true, message: "Failed to delete FAQ." });
  }
};
