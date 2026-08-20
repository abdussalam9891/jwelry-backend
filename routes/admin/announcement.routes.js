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

router.use(protect, authorize("admin", "demo"));

router.get("/", getAdminAnnouncements);

router.get("/:id", getAdminAnnouncementById);

router.post("/", authorize("admin"), createAdminAnnouncement);

router.patch("/:id", authorize("admin"), updateAdminAnnouncement);

router.delete("/:id", authorize("admin"), deleteAdminAnnouncement);

router.post("/:id/duplicate", authorize("admin"), duplicateAdminAnnouncement);

export default router;
