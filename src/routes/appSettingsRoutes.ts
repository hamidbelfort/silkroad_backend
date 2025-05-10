// src/routes/settings.route.ts
import { Router } from "express";
import {
  getAllSettings,
  updateSettings,
  getSettingByKey,
} from "../controllers/settingsController";
import { authenticateUser } from "../middleware/authMiddleware";
const router = Router();

router.get("/", authenticateUser, getAllSettings);
router.put("/", authenticateUser, updateSettings);
router.get("/settings/:key", getSettingByKey);

export default router;
