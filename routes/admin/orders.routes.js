import express from "express";

import {
  deleteOrder,
  getAdminOrders,
  getOrderStats,
  getSingleOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../controllers/admin/orders.controller.js";

import { exportOrdersReport } from "../../controllers/admin/orderExport.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/", getAdminOrders);
router.get("/stats", getOrderStats);
router.get("/export", exportOrdersReport);
router.get("/:id", getSingleOrder);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment", updatePaymentStatus);
router.delete("/:id", deleteOrder);

export default router;
