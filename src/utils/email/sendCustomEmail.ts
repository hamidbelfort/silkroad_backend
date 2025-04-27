import nodemailer from "nodemailer";

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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // انتخاب امضا بر اساس نقش کاربر
    let signature = "";
    switch (userType) {
      case "admin":
        signature = "<p style='font-size:12px;color:gray;'>مدیریت پلتفرم</p>";
        break;
      case "operator":
        signature =
          "<p style='font-size:12px;color:gray;'>اپراتور پشتیبانی</p>";
        break;
      case "customer":
      default:
        signature = "<p style='font-size:12px;color:gray;'>خدمات مشتریان</p>";
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
      from: `"MyPlatform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: finalHtml,
    });

    console.log(`[Email] Sent to ${to}`);
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    throw new Error("Failed to send email");
  }
}
