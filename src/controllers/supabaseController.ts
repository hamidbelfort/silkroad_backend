import { Request, Response } from "express";
import { supabase } from "../supabase/client";
import path from "path";
import { getBucketName } from "../utils/helpers";

//Upload Image to Supabase Storage
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const file = req.file;
    const type = req.body.type;
    const userId = req.body.userId;

    if (!file || !type || !userId) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    const bucket = getBucketName(type);
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}_${timestamp}${ext}`;

    let filePath = "";
    if (type === "card") {
      filePath = `${userId}/${filename}`;
    } else {
      filePath = filename; // بدون زیرپوشه
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: true,
        metadata: {
          user_id: userId,
        },
      });

    if (error) throw error;

    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath).data.publicUrl;

    return res.status(200).json({
      success: true,
      message: "Uploaded",
      url: publicUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error,
    });
  }
};

export const getImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { type, filename } = req.params;
    const bucket = getBucketName(type as any);

    const { data, error } = await supabase.storage
      .from(bucket)
      .download(`${type}/${filename}`);

    if (error || !data)
      return res.status(404).json({
        success: false,
        message: "File not found",
      });

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader(
      "Content-Type",
      data.type || "image/jpeg"
    );
    return res.send(buffer);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetch failed", error: err });
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

    if (error)
      return res
        .status(500)
        .json({ message: "Delete failed", error });

    return res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Delete error",
      error: err,
    });
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
      return res
        .status(400)
        .json({ success: false, message: "Missing data" });

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

    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(path).data.publicUrl;
    return res.status(200).json({
      success: true,
      message: "Updated",
      url: publicUrl,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: err,
    });
  }
};
