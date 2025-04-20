import express from "express";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    const reqTyped = req as typeof req & {
      fileValidationError?: string;
    };

    if (reqTyped.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: reqTyped.fileValidationError,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const folder = req.query.folder;
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    return res.status(200).json({ success: true, fileUrl });
  }
);

export default router;
