import prisma from "../config/prismaClient";
import { Request, Response } from "express";
export const createContactMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Contact form error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while storing contact message" });
  }
};
