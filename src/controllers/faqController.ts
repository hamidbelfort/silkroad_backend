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
    const faq = await prisma.fAQ.create({ data: req.body });
    const userId = (req as any).user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "CREATE_FAQ",
        description: "Created FAQ.",
      });
    }

    res.status(201).json(faq);
  } catch {
    res.status(500).json({ success: false, message: "Failed to create FAQ." });
  }
};

export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany();
    res.status(200).json(faqs);
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch FAQs." });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
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
    res.status(200).json({ success: true, message: "FAQ Updated" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update FAQ." });
  }
};

export const deleteFAQ = async (req: AuthRequest, res: Response) => {
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
    res.status(200).json({ success: true, message: "FAQ deleted." });
  } catch {
    res.status(500).json({ success: true, message: "Failed to delete FAQ." });
  }
};
