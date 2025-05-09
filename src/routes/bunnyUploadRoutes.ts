import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/bunnyUploadController";

const router = express.Router();

// تنظیم Multer برای دریافت فایل‌ها
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // حداکثر 2 مگابایت
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false); // جلوگیری از آپلود فایل‌های غیرتصویری
    }
  },
});

// مسیر آپلود، مثلاً /api/upload/profile
router.post("/upload/:folder", upload.single("image"), uploadImage);

export default router;
