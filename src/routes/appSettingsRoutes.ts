// src/routes/settings.route.ts
import { Router } from "express";
import {
  getAllSettings,
  updateSettings,
  getSettingByKey,
} from "../controllers/settingsController";

const router = Router();

router.get("/", getAllSettings);
router.put("/", updateSettings);
router.get("/settings/:key", getSettingByKey);

export default router;
