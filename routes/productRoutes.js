import express from "express";
import {
  getProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);

//  Admin-only routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
