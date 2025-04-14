import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  createProfile,
  getProfile,
  //updateProfile,
  deleteProfile,
} from "../controllers/userProfileController";

const router = express.Router();

router.post("/", authenticateUser, createProfile);
router.get("/", authenticateUser, getProfile);
//router.put("/", authenticateUser, updateProfile);
router.delete("/", authenticateUser, deleteProfile);

export default router;
