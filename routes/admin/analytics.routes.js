import express from "express";

import {
  getCustomersData,
  getDashboardData,
  getGeoData,
  getInventoryData,
  getOrdersData,
  getPaymentsData,
  getProductsData,
  getRevenueData,
} from "../../controllers/admin/analytics.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- GLOBAL PROTECTION ---------------- */
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardData);
router.get("/revenue", getRevenueData);
router.get("/orders", getOrdersData);
router.get("/products", getProductsData);
router.get("/customers", getCustomersData);
router.get("/payments", getPaymentsData);
router.get("/inventory", getInventoryData);
router.get("/geo", getGeoData);

export default router;
