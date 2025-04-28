import { Request, Response } from "express";
import { sendCustomEmail } from "../utils/email/sendCustomEmail";

export const sendEmailHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { to, subject, htmlContent, userType } = req.body;

    // اعتبارسنجی اولیه
    if (!to || !subject || !htmlContent || !userType) {
      return res
        .status(400)
        .json({ error: "Missing required fields" });
    }

    await sendCustomEmail({
      to,
      subject,
      htmlContent,
      userType,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(
      "[EmailController] Failed to send email:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};
