import express from "express";

import { getProductDetails } from "../../controllers/admin/productDetails.controller.js";
import { exportProductsReport } from "../../controllers/admin/productExport.controller.js";
import {
  archiveProduct,
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProductStats,
  updateProduct,
} from "../../controllers/admin/products.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Read-only for demo: PATCH /:id accepts status/price/stock/variants, so
// "limited edit" here would still let demo mutate any real product.
router.use(protect, authorize("admin", "demo"));
// GET ALL PRODUCTS
router.get("/", getAdminProducts);
router.get("/stats", getProductStats);
router.get("/export", authorize("admin"), exportProductsReport);
router.get("/:id/details", getProductDetails);
router.patch("/:id/archive", authorize("admin"), archiveProduct);
// CREATE PRODUCT (admin only)
router.post("/", authorize("admin"), createProduct);
// UPDATE PRODUCT (admin only)
router.patch("/:id", authorize("admin"), updateProduct);
// DELETE PRODUCT (admin only)
router.delete("/:id", authorize("admin"), deleteProduct);

export default router;
