import multer from "multer";

export const uploadMiddleware = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  storage: multer.memoryStorage(), // استفاده از حافظه برای ارسال مستقیم به Supabase
});
