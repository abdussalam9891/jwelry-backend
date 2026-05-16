import express from "express";

import {

  getAdminOrders,

  getOrderStats,

  getSingleOrder,

  updateOrderStatus,

  updatePaymentStatus,

  deleteOrder,

} from "../../controllers/admin/orders.controller.js";

import {
  exportOrdersReport,
} from "../../controllers/admin/orderExport.controller.js";

import {
  protect,
  authorize,
} from "../../middleware/authMiddleware.js";

const router = express.Router();



router.get(
  "/",
  getAdminOrders
);

router.get(
  "/stats",
  getOrderStats
);

router.get(
  "/export",

  protect,

  authorize("admin"),

  exportOrdersReport
);

router.get(
  "/:id",

  protect,

  authorize("admin"),

  getSingleOrder
);



router.patch(
  "/:id/status",

  protect,

  authorize("admin"),

  updateOrderStatus
);

router.put(
  "/:id/status",
  updateOrderStatus
);

router.put(
  "/:id/payment",
  updatePaymentStatus
);

router.delete(
  "/:id",
  deleteOrder
);



export default router;
