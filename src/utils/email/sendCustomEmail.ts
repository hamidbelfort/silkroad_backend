import nodemailer from "nodemailer";
import { getSettingValue } from "../../controllers/settingsController";

type UserType = "admin" | "operator" | "customer";

interface SendCustomEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  userType: UserType;
}

export async function sendCustomEmail({
  to,
  subject,
  htmlContent,
  userType,
}: SendCustomEmailOptions) {
  try {
    const smtpUser = await getSettingValue("SMTP_USER");
    const smtpPass = await getSettingValue("SMTP_PASS");
    const APP_Name = process.env.APP_NAME || "Silk Road";
    if (smtpUser !== "" && smtpPass !== "") {
      // console.log(
      //   ` smtpUser: ${smtpUser}, smtpPass: ${smtpPass}`
      // );
      const username = smtpUser?.trim();
      const pass = smtpPass?.trim();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: username,
          pass: pass,
        },
      });

      // انتخاب امضا بر اساس نقش کاربر
      let signature = "";
      switch (userType) {
        case "admin":
          signature =
            "<p style='font-size:12px;color:gray;'>Platform Management</p>";
          break;
        case "operator":
          signature =
            "<p style='font-size:12px;color:gray;'>Support Operator</p>";
          break;
        case "customer":
        default:
          signature =
            "<p style='font-size:12px;color:gray;'>Customer Services</p>";
          break;
      }

      // قالب نهایی ایمیل
      const finalHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background-color:#f9fafb;border-radius:8px;">
        <div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          ${htmlContent}
        </div>
        <div style="margin-top:20px;text-align:center;color:#9ca3af;font-size:12px;">
          ${signature}
        </div>
      </div>
    `;

      // ارسال ایمیل
      await transporter.sendMail({
        from: `${APP_Name} <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: finalHtml,
      });
      console.log(`[Email] Sent to ${to}`);
    } else {
      console.log("Email settings are not completed");
    }
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    //throw new Error("Failed to send email");
  }
}
