import express from "express";
import {
  getAdminAnnouncementBar,
  updateAdminAnnouncementBar,
} from "../../controllers/admin/announcementBar.controller.js";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import { validateAnnouncementBarUpdate } from "../../validators/announcementBar.validator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getAdminAnnouncementBar);
router.put("/", validateAnnouncementBarUpdate, updateAdminAnnouncementBar);

export default router;
