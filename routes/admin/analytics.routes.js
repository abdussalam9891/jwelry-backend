import express from "express";

import {
  getDashboardData,
  getRevenueData,
  getOrdersData,
  getProductsData,
  getCustomersData,
  getPaymentsData,
  getInventoryData,
  getGeoData,
  getMaterialsData,
  getCategoriesData,
} from "../../controllers/admin/analytics.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- GLOBAL PROTECTION ---------------- */
router.use(protect, authorize("admin", "demo"));

router.get("/dashboard", getDashboardData);
router.get("/revenue", getRevenueData);
router.get("/orders", getOrdersData);
router.get("/products", getProductsData);
router.get("/customers", getCustomersData);
router.get("/payments", getPaymentsData);
router.get("/inventory", getInventoryData);
router.get("/geo", getGeoData);
router.get(
  "/materials",
  getMaterialsData
);

router.get(
  "/categories",
  getCategoriesData
);

export default router;
