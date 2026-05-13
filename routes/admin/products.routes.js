import express from "express";

import { getProductDetails } from "../../controllers/admin/productDetails.controller.js";
import { exportProductsReport } from "../../controllers/admin/productExport.controller.js";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProductStats,
  updateProduct,
  archiveProduct,
} from "../../controllers/admin/products.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ALL ADMIN ROUTES PROTECTED
// router.use(
//   protect,
//   authorize("admin")
// );

// GET ALL PRODUCTS
router.get("/", getAdminProducts);

router.get("/stats", getProductStats);

router.get(
  "/export",

  protect,

  authorize("admin"),

  exportProductsReport,
);

router.get(
  "/:id/details",

  protect,

  authorize("admin"),

  getProductDetails,
);


router.patch(
  "/:id/archive",

  protect,

  authorize("admin"),

  archiveProduct
);

// CREATE PRODUCT
router.post("/", createProduct);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;
