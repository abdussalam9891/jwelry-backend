import express from "express";

import {
  getProductReviewsAdmin,
  moderateReview,
  deleteReviewAdmin,
} from "../../controllers/admin/review.controller.js";

import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router =
  express.Router();

router.use(
  protect,
  authorize("admin")
);

router.get(
  "/products/:productId/reviews",
  getProductReviewsAdmin
);

router.patch(
  "/reviews/:reviewId/moderate",
  moderateReview
);

router.patch(
  "/reviews/:reviewId/delete",
  deleteReviewAdmin
);

export default router;
