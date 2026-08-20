import express from "express";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from "../../controllers/admin/siteSettings.controller.js";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import { validateSiteSettingsUpdate } from "../../validators/siteSettings.validator.js";

const router = express.Router();

router.use(protect, authorize("admin", "demo"));

router.get("/", getAdminSiteSettings);
router.put("/", authorize("admin"), validateSiteSettingsUpdate, updateAdminSiteSettings);

export default router;
