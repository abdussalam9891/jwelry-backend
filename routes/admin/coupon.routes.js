import express from "express";
import {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  toggleCouponStatus,
  getCouponStats,
  duplicateCoupon,
} from "../../controllers/admin/coupon.controller.js";
import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(
  protect,
  authorize("admin")
);

/* Collection Routes */

router
  .route("/")
  .get(getCoupons)
  .post(createCoupon);

/* Specific Action Routes */

router.get(
  "/:id/duplicate",
  duplicateCoupon
);

router.patch(
  "/:id/toggle-status",
  toggleCouponStatus
);

router.get(
  "/:id/stats",
  getCouponStats
);

/* Resource Routes */

router
  .route("/:id")
  .get(getCoupon)
  .patch(updateCoupon);

export default router;
