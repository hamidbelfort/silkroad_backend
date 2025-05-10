import path from "path";
import { supabase } from "./supabaseClient";

export function convertToNumber(value: string | undefined): number | 0 {
  return value !== undefined ? +value : 0;
}
export const getBucketName = (type: string): string => {
  switch (type) {
    case "profile":
      return BucketName.PROFILE;
    case "slide":
      return BucketName.SLIDES;
    case "card":
      return BucketName.BANK_CARD;
    default:
      throw new Error("Invalid image type");
  }
};
export enum BucketName {
  PROFILE = "profile",
  SLIDES = "slide",
  BANK_CARD = "bank-card",
}
interface UploadParams {
  file: Express.Multer.File;
  bucket: BucketName;
  userId: string;
  folder?: string; // مثل 'profile', 'slide', یا 'bank-card'
  prefix?: string; // مثلاً card ID یا user ID
}
export const uploadToSupabase = async ({
  file,
  bucket,
  userId,
  folder = "",
  prefix = "",
}: UploadParams): Promise<{ url: string; path: string }> => {
  const ext = path.extname(file.originalname);
  const filename = `${prefix}_${Date.now()}${ext}`;

  let filePath = folder ? `${folder}/${filename}` : filename;

  // فقط برای کارت بانکی، زیرپوشه کاربر و metadata ذخیره بشه
  const isPrivateBucket = bucket === BucketName.BANK_CARD;

  if (isPrivateBucket) {
    filePath = `${userId}/${filename}`;
  }

  const uploadOptions = {
    contentType: file.mimetype,
    upsert: true,
    ...(isPrivateBucket ? { metadata: { user_id: userId } } : {}),
  };

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, uploadOptions);

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
  };
};

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
