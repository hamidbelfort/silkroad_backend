import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// آپلود فایل با multer
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // مهم: باید Service Role باشه برای آپلود فایل
);

router.post(
  "/",
  upload.single("file"),
  async (req, res): Promise<any> => {
    try {
      const file = req.file;
      const folder = req.body.folder; // 'profile' | 'slider' | 'bankCard'
      const userId = req.body.userId;

      if (!file || !folder) {
        return res
          .status(400)
          .json({ error: "File and folder are required" });
      }

      const bucketMap = {
        profile: "profile-images",
        slider: "slider-images",
        bankCard: "bank-card-images",
      };
      const index =
        (folder == "profile" && bucketMap.profile) ||
        (folder == "slider" && bucketMap.slider) ||
        (folder == "bankCard" && bucketMap.bankCard);
      const bucket = index;
      if (!bucket) {
        return res
          .status(400)
          .json({ error: "Invalid folder" });
      }

      const ext = file.originalname.split(".").pop();
      const filename = `${Date.now()}.${ext}`;
      const filePath =
        ["bankCard", "profile"].includes(folder) && userId
          ? `${userId}/${filename}`
          : filename;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: error.message });
      }

      return res.status(200).json({
        path: filePath,
        bucket,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Unexpected error" });
    }
  }
);

export default router;
