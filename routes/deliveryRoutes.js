import express from "express";
import { checkDelivery } from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/:pincode", checkDelivery);

export default router;
