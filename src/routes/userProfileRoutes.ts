import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  createProfile,
  getProfile,
  //updateProfile,
  setProfileImage,
  deleteProfile,
} from "../controllers/userProfileController";
import { upload } from "../middleware/multer";
const router = express.Router();

router.post("/", authenticateUser, createProfile);
router.get("/:id", getProfile);
router.post(
  "/avatar",
  authenticateUser,
  upload.single("file"),
  setProfileImage
);
//router.put("/", authenticateUser, updateProfile);
router.delete("/:id", authenticateUser, deleteProfile);

export default router;
