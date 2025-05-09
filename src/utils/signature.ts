import crypto from "crypto";

/**
 * ساخت لینک امضا شده برای BunnyCDN
 * @param filePath مسیر فایل داخل پوشه مثل: "bank-card/user-42-1715100000.jpg"
 * @param expiresInSeconds مدت اعتبار توکن (مثلاً 300 یعنی ۵ دقیقه)
 */
export const generateSignedUrl = (filePath: string, expiresInSeconds = 300) => {
  const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL!;
  const BUNNY_TOKEN_KEY = process.env.BUNNY_TOKEN_KEY!;

  const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const signature = crypto
    .createHmac("sha256", BUNNY_TOKEN_KEY)
    .update(`${filePath}${expiry}`)
    .digest("base64url");

  return `https://${BUNNY_CDN_URL}/${filePath}?token=${signature}&expires=${expiry}`;
};
