import express from "express";
import { subscribe } from "../controllers/newsLetterController.js";
import { publicFormLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/subscribe",
  publicFormLimiter,
  subscribe
);

export default router;
