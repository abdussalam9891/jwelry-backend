import express from "express";

import {
  deleteOrder,
  getAdminOrders,
  getOrderStats,
  getSingleOrder,
  updateOrderStatus,
  downloadAdminInvoice,
  updatePaymentStatus,
} from "../../controllers/admin/orders.controller.js";

import { exportOrdersReport } from "../../controllers/admin/orderExport.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Admin only by default: order list/detail/invoice contain real customer PII
// (name, address, phone). Demo only gets aggregate stats (no PII) below.
router.use(protect);
router.get("/stats", authorize("admin", "demo"), getOrderStats);
router.use(authorize("admin"));
router.get("/", getAdminOrders);
router.get("/export", exportOrdersReport);
router.get("/:id", getSingleOrder);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.get(
  "/:id/invoice",
  downloadAdminInvoice
);
router.delete("/:id", deleteOrder);

export default router;
