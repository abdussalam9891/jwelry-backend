import express from "express";

import {

  getAdminOrders,

  getOrderStats,

  getSingleOrder,

  updateOrderStatus,

  updatePaymentStatus,

  deleteOrder,

} from "../../controllers/admin/orders.controller.js";



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
  "/:id",
  getSingleOrder
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
