import express from "express";
import {
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../controllers/sliderController";
import { upload } from "../middleware/multer";
import { authenticateUser } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/", getAllSliders);
router.post(
  "/",
  authenticateUser,
  upload.single("file"),
  createSlider
);
router.put("/:id", updateSlider);
router.delete("/:id", authenticateUser, deleteSlider);

export default router;
