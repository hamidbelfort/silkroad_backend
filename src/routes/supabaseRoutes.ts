import express from "express";
import {
  uploadImage,
  getImage,
  deleteImage,
  updateImage,
} from "../controllers/supabaseController";
import { uploadMiddleware } from "../utils/multerConfig";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  uploadMiddleware.single("file"),
  uploadImage
);
router.get("/:type/:filename", getImage);
router.put(
  "/:type/:filename",
  authenticateUser,
  uploadMiddleware.single("file"),
  updateImage
);
router.delete("/:type/:filename", authenticateUser, deleteImage);

export default router;
