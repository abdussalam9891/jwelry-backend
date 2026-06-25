import express from "express";

import {
  getRazorpayConfig,
  verifyPayment,
  paymentFailed,
} from "../controllers/paymentController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/config",
  getRazorpayConfig
);

router.post(
  "/verify",
  verifyPayment
);

router.post(
  "/failed",
  paymentFailed
);

export default router;
