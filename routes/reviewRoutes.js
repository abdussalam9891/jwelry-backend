import express from "express";

import { getReviewsByProduct, createReview, updateReview, deleteReview} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload, {
  setUploadFolder,
} from "../middleware/uploadMiddleware.js";


const router = express.Router();


router.get(
  "/product/:productId",
  getReviewsByProduct
);

router.post(
  "/product/:productId",

  protect,

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
