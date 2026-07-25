import express from "express";

import { getReviewsByProduct, createReview, getTestimonials, updateReview, deleteReview} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { searchLimiter } from "../middleware/rateLimiter.js";
import upload, {
  setUploadFolder,
} from "../middleware/uploadMiddleware.js";


const router = express.Router();


router.get(
  "/testimonials",
  getTestimonials
);


router.get(
  "/product/:productId",
  getReviewsByProduct
);

router.post(
  "/product/:productId",

  protect,

  searchLimiter,

  setUploadFolder(
    "gemora/reviews"
  ),

  upload.array(
    "images",
    5
  ),

  createReview
);

router.patch(
  "/:reviewId",

  protect,

  searchLimiter,

  setUploadFolder(
    "gemora/reviews"
  ),

  upload.array(
    "images",
    5
  ),

  updateReview
);

router.delete(
  "/:reviewId",

  protect,

  deleteReview
);


export default router;
