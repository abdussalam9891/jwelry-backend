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

router.use(protect, authorize("admin"));
// GET ALL PRODUCTS
router.get("/", getAdminProducts);
router.get("/stats", getProductStats);
router.get("/export", exportProductsReport);
router.get("/:id/details", getProductDetails);
router.patch("/:id/archive", archiveProduct);
// CREATE PRODUCT
router.post("/", createProduct);
// UPDATE PRODUCT
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
