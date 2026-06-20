import express from "express";

import {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  clearNotifications,
} from "../../controllers/admin/notification.controller.js";

import { authorize, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getNotifications);

router.patch("/:id/read", markAsRead);

router.patch("/read-all", markAllRead);

router.delete("/:id", deleteNotification);

router.delete("/", clearNotifications);

export default router;
