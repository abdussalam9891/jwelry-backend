import express from "express";

import { getProductDetails } from "../../controllers/admin/productDetails.controller.js";
import { exportProductsReport } from "../../controllers/admin/productExport.controller.js";
import {
  createProduct,

  getAdminProducts,
  getProductStats,
  updateProduct,
  archiveProduct,
} from "../../controllers/admin/products.controller.js";
import upload from "../../middleware/uploadMiddleware.js";

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
router.post(
  "/",

  protect,

  authorize("admin"),

  upload.array("images", 5),

  createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",

  protect,

  authorize("admin"),

  upload.array("images", 5),

  updateProduct
);

 

export default router;
