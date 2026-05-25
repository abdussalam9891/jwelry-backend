import express from "express";

import {
  getNotifications,
  markAsRead,
} from "../../controllers/admin/notification.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);

export default router;
