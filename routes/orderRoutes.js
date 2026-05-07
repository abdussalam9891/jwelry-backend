import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router =
  express.Router();



//  create order
router.post(
  "/",
  protect,
  createOrder
);



//  get logged-in user orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);


router.get(
  "/:id",
  protect,
  getOrderById
);

export default router;
