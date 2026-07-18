import express from "express";
import {
  getAdminAnnouncements,
  getAdminAnnouncementById,
  createAdminAnnouncement,
  updateAdminAnnouncement,
  deleteAdminAnnouncement,
  duplicateAdminAnnouncement,
} from "../../controllers/admin/announcementBar.controller.js";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import { validateAnnouncementBarUpdate } from "../../validators/announcementBar.validator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getAdminAnnouncements);

router.get("/:id", getAdminAnnouncementById);

router.post("/", createAdminAnnouncement);

router.patch("/:id", updateAdminAnnouncement);

router.delete("/:id", deleteAdminAnnouncement);

router.post("/:id/duplicate", duplicateAdminAnnouncement);

export default router;
