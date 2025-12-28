import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getProfile).put(updateProfile);

router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default router;
