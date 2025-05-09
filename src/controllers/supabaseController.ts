import { Request, Response } from "express";
import { supabase } from "../supabase/client";

const getBucketName = (type: "profile" | "slide" | "card") => {
  if (type === "profile") return "profile-pictures";
  if (type === "slide") return "slides";
  return "bank-cards";
};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const file = req.file;
    const { type, userId } = req.body;

    if (!file || !type || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing file or type or userId" });
    }

    const bucket = getBucketName(type);
    const filename = `${userId}_${Date.now()}_${file.originalname}`;
    const path = `${type}/${filename}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
        metadata: {
          user_id: userId, // 👈 این خط مهمه برای کنترل دسترسی با RLS
        },
      });

    if (error) throw error;

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path)
      .data.publicUrl;
    return res
      .status(201)
      .json({ success: true, message: "Uploaded", url: publicUrl });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Upload failed", error: err });
  }
};

export const getImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type, filename } = req.params;
    const bucket = getBucketName(type as any);

    const { data, error } = await supabase.storage
      .from(bucket)
      .download(`${type}/${filename}`);

    if (error || !data)
      return res
        .status(404)
        .json({ success: false, message: "File not found" });

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", data.type || "image/jpeg");
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ message: "Fetch failed", error: err });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { type, filename } = req.params;
    const bucket = getBucketName(type as any);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([`${type}/${filename}`]);

    if (error) return res.status(500).json({ message: "Delete failed", error });

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Delete error", error: err });
  }
};

export const updateImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const file = req.file;
    const { type, userId } = req.body;
    const { filename } = req.params;

    if (!file || !type || !userId || !filename)
      return res.status(400).json({ success: false, message: "Missing data" });

    const bucket = getBucketName(type as any);
    const path = `${type}/${filename}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
        metadata: { user_id: userId },
      });

    if (error) throw error;

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path)
      .data.publicUrl;
    return res
      .status(200)
      .json({ success: true, message: "Updated", url: publicUrl });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Update failed", error: err });
  }
};
