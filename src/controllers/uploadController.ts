import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const folder = req.body.folder || "others"; // fallback folder
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ error: "No file uploaded" });
    }

    const ext = file.originalname.split(".").pop();
    const filename = `${folder}/${uuidv4()}.${ext}`;

    const { error } = await supabase.storage
      .from("your-bucket-name")
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from("your-bucket-name")
      .getPublicUrl(filename);

    return res
      .status(200)
      .json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};
