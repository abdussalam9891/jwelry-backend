import express from "express";

import {
  validateCoupon,
  getAvailableCoupons,
  getMyRedemptions,
} from "../controllers/couponController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/",
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
  validateCoupon
);

export default router;
