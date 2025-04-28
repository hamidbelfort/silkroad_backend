export function resetPasswordTemplate({
  verificationCode,
  language,
}: {
  verificationCode: string;
  language: "fa" | "en" | "zh";
}) {
  if (language === "fa") {
    return `
        <div>
          <h1>درخواست تغییر رمز عبور 🔑</h1>
          <p>کد تایید شما برای تغییر رمز:</p>
          <h2 style="color:#3b82f6;">${verificationCode}</h2>
          <p>این کد تا 10 دقیقه معتبر است.</p>
          <br/>
          <p style="font-size:12px;color:gray;">با احترام، تیم امنیتی</p>
        </div>
      `;
  }
  if (language === "en") {
    return `
        <div>
          <h1>Password Reset Request 🔑</h1>
          <p>Your verification code for resetting your password:</p>
          <h2 style="color:#3b82f6;">${verificationCode}</h2>
          <p>This code is valid for 10 minutes.</p>
          <br/>
          <p style="font-size:12px;color:gray;">Best regards, Security Team</p>
        </div>
      `;
  }
  if (language === "zh") {
    return `
        <div>
          <h1>密码重置请求 🔑</h1>
          <p>您的密码重置验证码：</p>
          <h2 style="color:#3b82f6;">${verificationCode}</h2>
          <p>此验证码有效期为10分钟。</p>
          <br/>
          <p style="font-size:12px;color:gray;">此致，安全团队</p>
        </div>
      `;
  }

  return "";
}
