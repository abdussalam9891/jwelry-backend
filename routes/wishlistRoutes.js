import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// apply auth to all routes
router.use(protect);

// GET wishlist (should support pagination later)
router.get("/", getWishlist);

//  Add product to wishlist
router.post("/:productId", addToWishlist);

//  Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

export default router;
