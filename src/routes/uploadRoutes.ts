import express from "express";
import { uploadImage } from "../controllers/uploadController";
import { upload } from "../middleware/multer";

const router = express.Router();

// ارسال تصویر با تعیین نوع فولدر از طریق body
router.post("/upload", upload.single("image"), uploadImage);

export default router;
