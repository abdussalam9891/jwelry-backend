import express from "express";

import {
  validateCoupon,
  getAvailableCoupons,
  getMyRedemptions,
} from "../controllers/couponController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import { couponLimiter } from "../middleware/rateLimiter.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getAvailableCoupons
);

router.get(
  "/my-redemptions",
  protect,
  getMyRedemptions
);

router.post(
  "/validate",
  protect,
  couponLimiter,
  validateCoupon
);

export default router;
