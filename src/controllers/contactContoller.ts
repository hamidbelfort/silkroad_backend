import prisma from "../config/prismaClient";
import { Request, Response } from "express";
import { generateEmailTemplate } from "../utils/email/templates/templateManager";
import { generateEmailSubject } from "../utils/email/templates/subjectManager";
import { getAdminEmail } from "./appSettingsController";
import { sendCustomEmail } from "../utils/email/sendCustomEmail";
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
      token,
    } = req.body;
    if (!token)
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing CAPTCHA token",
        });

    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${req.ip}`,
      }
    );

    const result = await verifyRes.json();

    if (!result.success) {
      return res
        .status(403)
        .json({
          success: false,
          message: "CAPTCHA validation failed",
        });
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
      const mailSubject = generateEmailSubject(
        "contactMessage",
        language
      );
      const htmlContent = generateEmailTemplate(
        "contactMessage",
        {
          id: newMessage.id,
          name,
          email,
          subject,
          message,
          language,
        }
      );
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
