import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,

} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// 🔐 protect all routes
router.use(protect);

// 🔍 VALIDATION HELPERS

const validateProductId = (req, res, next) => {
  const id = req.params.productId;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  next();
};

const validateItemId = (req, res, next) => {
  const id = req.params.itemId;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }
  next();
};

// 🚀 ROUTES

// Get full cart
router.get("/", getCart);

// Add item (still uses productId)
router.post("/:productId", validateProductId, addToCart);

// 🔥 Remove by ITEM ID (not product)
router.delete("/item/:itemId", validateItemId, removeFromCart);

// 🔥 Update quantity by ITEM ID
router.patch("/item/:itemId", validateItemId, updateQuantity);

// Clear cart
router.delete("/clear", clearCart);


export default router;
