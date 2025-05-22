import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as faqController from "../controllers/faqController";

const router = express.Router();

router.post("/", authenticateUser, faqController.createFAQ);
router.get("/list", faqController.getAllFAQs);
//router.get("/:id", faqController.getFAQById); no needed for now
router.put("/:id", authenticateUser, faqController.updateFAQ);
router.delete("/:id", authenticateUser, faqController.deleteFAQ);

export default router;
