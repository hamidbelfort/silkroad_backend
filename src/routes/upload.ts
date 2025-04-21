import express, { Request, Response } from "express";
import { upload } from "../utils/upload";

const router = express.Router();

// POST /api/upload?folder=slider
router.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded or invalid file type",
        });
      }

      const folder = req.query.folder as string;
      const filePath = `/uploads/${folder}/${req.file.filename}`;

      return res
        .status(200)
        .json({ success: true, url: filePath });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        success: false,
        error: "File upload failed",
      });
    }
  }
);

export default router;
