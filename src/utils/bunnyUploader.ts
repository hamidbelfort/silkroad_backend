import axios from "axios";

const BUNNY_STORAGE_ZONE = "myuploads"; // اسم Storage Zone
const BUNNY_API_KEY = "eb7e26fc-5c6e-46f3-94b8e498c75f-9cdc-4fdb"; // از بخش FTP & API Access
const BUNNY_HOST = "storage.bunnycdn.com";

export async function uploadToBunnyFromBuffer(
  buffer: Buffer,
  originalName: string,
  folder: "profile" | "slider" | "bank-card"
): Promise<string> {
  const fileName = Date.now() + "_" + originalName;
  const destinationPath = `uploads/${folder}/${fileName}`;

  const url = `https://${BUNNY_HOST}/${BUNNY_STORAGE_ZONE}/${destinationPath}`;

  const response = await axios.put(url, buffer, {
    headers: {
      AccessKey: BUNNY_API_KEY,
      "Content-Type": "application/octet-stream",
    },
  });

  if (response.status === 201) {
    const publicUrl = `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${destinationPath}`;
    return publicUrl;
  } else {
    throw new Error("Upload failed with status: " + response.status);
  }
}
