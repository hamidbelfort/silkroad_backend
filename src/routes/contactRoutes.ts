import express from "express";
import { createContactMessage } from "../controllers/contactContoller";

const router = express.Router();

router.post("/", createContactMessage);

export default router;
