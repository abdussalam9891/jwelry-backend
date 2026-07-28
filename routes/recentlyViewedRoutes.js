import express from "express";
import mongoose from "mongoose";

import {
  getRecentlyViewedProducts,
  addRecentlyViewedProduct,
  deleteRecentlyViewed,
  mergeGuestRecentlyViewed,
} from "../controllers/recentlyViewedController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Protect All Routes
|--------------------------------------------------------------------------
*/

router.use(protect);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const validateProductId = (
  req,
  res,
  next
) => {
  const id =
    req.params.productId;

  if (
    id &&
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    return res.status(400).json({
      message:
        "Invalid product ID",
    });
  }

  next();
};

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

// Get Recently Viewed

router.get(
  "/",
  getRecentlyViewedProducts
);

// Add Product

router.post(
  "/:productId",
  validateProductId,
  addRecentlyViewedProduct
);

// Merge Guest History

router.post(
  "/merge",
  mergeGuestRecentlyViewed
);

// Clear History

router.delete(
  "/clear",
  deleteRecentlyViewed
);

export default router;
