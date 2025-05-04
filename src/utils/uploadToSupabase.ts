import { supabase } from "../lib/supabase";

type FolderType = "profile" | "slider" | "bankCard";

const folderToBucket: Record<FolderType, string> = {
  profile: "profile-images",
  slider: "slider-images",
  bankCard: "bank-card-images",
};

export async function uploadFileToSupabase(
  folder: FolderType,
  file: File,
  userId?: string
) {
  const bucket = folderToBucket[folder];
  if (!bucket) throw new Error("Invalid folder name");

  // برای فایل‌های شخصی (پروفایل، کارت بانکی) مسیر رو با userId بچین
  const pathPrefix = ["bankCard", "profile"].includes(
    folder
  )
    ? `${userId || "anonymous"}`
    : "";

  const timestamp = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${timestamp}.${ext}`;
  const fullPath = pathPrefix
    ? `${pathPrefix}/${filename}`
    : filename;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fullPath, file, {
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(error.message);

  return {
    path: fullPath,
    bucket,
    publicUrl: supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath).data.publicUrl,
  };
}
