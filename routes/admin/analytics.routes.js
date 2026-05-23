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
} from "../../controllers/admin/analytics.controller.js";

import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router =
  express.Router();

/* ---------------- GLOBAL PROTECTION ---------------- */
router.use(
  protect,
  authorize("admin")
);

/* ---------------- DASHBOARD ---------------- */
router.get(
  "/dashboard",
  getDashboardData
);

/* ---------------- REVENUE ---------------- */
router.get(
  "/revenue",
  getRevenueData
);

/* ---------------- ORDERS ---------------- */
router.get(
  "/orders",
  getOrdersData
);

/* ---------------- TOP PRODUCTS ---------------- */
router.get(
  "/products",
  getProductsData
);

/* ---------------- CUSTOMERS ---------------- */
router.get(
  "/customers",
  getCustomersData
);

/* ---------------- PAYMENTS ---------------- */
router.get(
  "/payments",
  getPaymentsData
);

/* ---------------- INVENTORY ---------------- */
router.get(
  "/inventory",
  getInventoryData
);

/* ---------------- GEO ---------------- */
router.get(
  "/geo",
  getGeoData
);

export default router;
