import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  moveToCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all cart routes require auth
router.use(protect);

router.get("/", getCart);
router.post("/:productId", addToCart);
router.delete("/clear", clearCart);          // before /:productId or it matches as productId
router.delete("/:productId", removeFromCart);
router.patch("/:productId", updateQuantity);
router.post("/:productId/move-from-wishlist", moveToCart);

export default router;
