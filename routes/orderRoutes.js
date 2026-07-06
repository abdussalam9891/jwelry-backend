import express from "express";

import {
  previewCheckout,
  createOrder,
  getMyOrders,
  getOrderById,
  downloadInvoice,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);




router.post(
    "/preview",

    previewCheckout
);



//  create order
router.post("/", createOrder);



//  get logged-in user orders
router.get("/my-orders", getMyOrders);

router.get("/:id", getOrderById);

router.get(
  "/:id/invoice",

  downloadInvoice
);

export default router;
