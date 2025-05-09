import express from "express";
import multer from "multer";
import { uploadToBunnyFromBuffer } from "../utils/bunnyUploader";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post(
  "/:folder",
  upload.single("image"),
  async (req, res): Promise<any> => {
    const { folder } = req.params;

    if (!["profile", "slider", "bank-card"].includes(folder)) {
      return res.status(400).json({ error: "Invalid folder name" });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const url = await uploadToBunnyFromBuffer(
        file.buffer,
        file.originalname,
        folder as any
      );
      res.status(200).json({ url });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload" });
    }
  }
);

export default router;
