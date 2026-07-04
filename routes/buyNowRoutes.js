import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createBuyNowPreview,
  createBuyNowOrder,
} from "../controllers/buyNowController.js";

const router = express.Router();

router.use(protect);

router.post("/preview", createBuyNowPreview);

router.post("/order", createBuyNowOrder);

export default router;
