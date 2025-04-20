import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder as string;

    if (!folder) {
      return cb(
        new Error("Folder query param is required"),
        ""
      );
    }

    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      folder
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  if (!file.mimetype.startsWith("image/")) {
    (req as any).fileValidationError =
      "Only image files are allowed!";
    return cb(null, false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
