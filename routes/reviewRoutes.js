// routes/reviewRoutes.js
import express from "express";
import { getReviewsByProduct } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", getReviewsByProduct);

export default router;
