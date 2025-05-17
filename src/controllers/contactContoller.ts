import prisma from "../config/prismaClient";
import { Request, Response } from "express";
import { generateEmailTemplate } from "../utils/email/templates/templateManager";
import { generateEmailSubject } from "../utils/email/templates/subjectManager";
import { getAdminEmail } from "./settingsController";
import { sendCustomEmail } from "../utils/email/sendCustomEmail";
import crypto from "crypto";
export const createContactMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      name,
      email,
      subject,
      message,
      language = "en",
      captchaAnswer,
      captchaHash,
    } = req.body;
    //verify captcha
    const submitted = String(captchaAnswer).trim().toLowerCase();
    const calculatedHash = crypto
      .createHash("sha256")
      .update(submitted)
      .digest("hex");

    if (calculatedHash !== captchaHash) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid captcha" });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    //send email to admin
    const adminEmail = await getAdminEmail();
    if (adminEmail && adminEmail !== undefined) {
      const mailSubject = generateEmailSubject("contactMessage", language);
      const htmlContent = generateEmailTemplate("contactMessage", {
        id: newMessage.id,
        name,
        email,
        subject,
        message,
        language,
      });
      await sendCustomEmail({
        to: adminEmail,
        subject: mailSubject,
        htmlContent,
        userType: "admin",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while storing contact message",
    });
  }
};
