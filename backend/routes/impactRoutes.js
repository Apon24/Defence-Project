import express from "express";
import { getImpactStats } from "../controllers/impactController.js";

const router = express.Router();

router.get("/", getImpactStats);

export default router;
