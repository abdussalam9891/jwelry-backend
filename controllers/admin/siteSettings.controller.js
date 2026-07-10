import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getSiteSettingsForAdmin,
  updateSiteSettings,
} from "../../service/siteSettingsService.js";

export const getAdminSiteSettings = asyncHandler(async (req, res) => {
  const settings = await getSiteSettingsForAdmin();
  res.status(200).json({ success: true, data: settings });
});

export const updateAdminSiteSettings = asyncHandler(async (req, res) => {
  const updated = await updateSiteSettings(req.body, req.user._id);
  res.status(200).json({ success: true, data: updated });
});
