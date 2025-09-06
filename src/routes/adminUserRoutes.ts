import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
} from "../controllers/userController";

const router = Router();

// Secure all user management routes. Only authenticated admins can access them.
router.use(authenticateUser, authorizeAdmin);

// Route to get all users
router.get("/", getAllUsers);

// Route to update a user's active status
router.put("/:id/status", updateUserStatus);

// Route to update a user's role
router.put("/:id/role", updateUserRole);

// Route to reset a user's password
router.post("/:id/reset-password", resetUserPassword);

export default router;
