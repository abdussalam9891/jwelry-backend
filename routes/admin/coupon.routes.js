import express from "express";
import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
} from "../../controllers/admin/coupon.controller.js";
import { protect, authorize} from "../../middleware/authMiddleware.js";

const router =
  express.Router();

  router.use(protect, authorize("admin"));

router.get(
  "/",

  getCoupons
);

router.get(
  "/:id",

  getCoupon
);

router.post(
  "/",

  createCoupon
);

router.patch(
  "/:id",

  updateCoupon
);

router.delete(
  "/:id",

  deleteCoupon
);

router.get(
  "/:id/stats",
 
  getCouponStats
);


export default router;
