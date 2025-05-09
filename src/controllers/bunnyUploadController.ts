import { Request, Response } from "express";
import path from "path";
import axios from "axios";

const BUNNY_STORAGE_ZONE = "myuploads";
const BUNNY_STORAGE_API_KEY = "eb7e26fc-5c6e-46f3-94b8e498c75f-9cdc-4fdb";
const BUNNY_STORAGE_ENDPOINT = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;
const BUNNY_CDN_URL = "silkroad.b-cdn.net"; // مثلاً yourzone.b-cdn.net

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const folder = req.params.folder; // profile, slider, bank-card
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // فرض بر اینه که user.id توسط middleware احراز هویت اضافه شده
    const userId = (req as any).user?.id || "unknown";

    const fileExt = path.extname(file.originalname);
    const timestamp = Date.now();
    const fileName = `user-${userId}-${timestamp}${fileExt}`;
    const destinationPath = `${folder}/${fileName}`;

    // ارسال فایل با axios به Bunny
    await axios.put(
      `${BUNNY_STORAGE_ENDPOINT}/${destinationPath}`,
      file.buffer,
      {
        headers: {
          AccessKey: BUNNY_STORAGE_API_KEY,
          "Content-Type": file.mimetype,
        },
      }
    );

    const imageUrl = `https://${BUNNY_CDN_URL}/${destinationPath}`;
    return res.status(200).json({ url: imageUrl });
  } catch (error: any) {
    console.error("Upload error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Image upload failed" });
  }
};
