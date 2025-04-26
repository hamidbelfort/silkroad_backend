import { Router } from "express";
import {
  getAppSettings,
  updateAppSettings,
} from "../controllers/appSettingsController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateUser, getAppSettings);
router.put("/", authenticateUser, updateAppSettings);

export default router;
