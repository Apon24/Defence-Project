import express from "express";
import {
  getStats,
  getUsers,
  updateUserRole,
  createUser,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", protect, admin, getStats);

// User management
router.get("/users", protect, admin, getUsers);
router.post("/users", protect, admin, createUser);
router.put("/users/:id/role", protect, admin, updateUserRole);

export default router;
