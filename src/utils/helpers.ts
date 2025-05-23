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
}: UploadParams): Promise<{
  url: string;
  path: string;
}> => {
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

/**
 * ساخت لینک (عمومی یا خصوصی) از مسیر فایل در Supabase
 * @param userId آیدی کاربر (برای لاگ گرفتن)
 * @param bucket نام باکت (enum)
 * @param imagePath مسیر داخل باکت
 * @param isPrivate آیا لینک خصوصی باشد؟
 * @param expiresIn مدت اعتبار لینک خصوصی (ثانیه) — پیش‌فرض 10 دقیقه
 * @returns لینک نهایی یا null
 */
export async function getImageUrl(
  userId: string,
  bucket: BucketName,
  imagePath: string,
  isPrivate = false,
  expiresIn = 5 * (60 * 10)
): Promise<string | null> {
  if (!imagePath) {
    console.warn(`No image path provided for user ${userId}`);
    return null;
  }

  try {
    if (isPrivate) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(imagePath, expiresIn);

      if (error || !data?.signedUrl) {
        console.error(`Signed URL error for user ${userId}:`, error?.message);
        return null;
      }

      return data.signedUrl;
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(imagePath);

      if (!data?.publicUrl) {
        console.error(`Public URL error for user ${userId}`);
        return null;
      }

      return data.publicUrl;
    }
  } catch (err) {
    console.error(
      `Unexpected error getting image URL for user ${userId}:`,
      err
    );
    return null;
  }
}
export const deleteImage = async (bucket: BucketName, filePath: string) => {
  await supabase.storage.from(bucket).remove([filePath]);
};
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
