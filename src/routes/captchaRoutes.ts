import express from "express";
import { createCaptcha } from "../controllers/captchaController";

const router = express.Router();

router.get("/", createCaptcha);

export default router;
