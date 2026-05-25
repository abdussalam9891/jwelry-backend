import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

//  create order
router.post("/", createOrder);

//  get logged-in user orders
router.get("/my-orders", getMyOrders);

router.get("/:id", getOrderById);

export default router;
