import { Router } from "express";
import { sendEmailHandler } from "../controllers/emailController";

const router = Router();

// مسیر ارسال ایمیل
router.post("/", sendEmailHandler);

export default router;
