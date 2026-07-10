import express from "express";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from "../../controllers/admin/siteSettings.controller.js";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import { validateSiteSettingsUpdate } from "../../validators/siteSettings.validator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getAdminSiteSettings);
router.put("/", validateSiteSettingsUpdate, updateAdminSiteSettings);

export default router;
