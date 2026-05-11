import express from "express";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getProductStats,
} from "../../controllers/admin/products.controller.js";

import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// ALL ADMIN ROUTES PROTECTED
// router.use(
//   protect,
//   authorize("admin")
// );

// GET ALL PRODUCTS
router.get("/", getAdminProducts);

router.get(
  "/stats",
  getProductStats
);

// CREATE PRODUCT
router.post("/", createProduct);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;
