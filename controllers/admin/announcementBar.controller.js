import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getAnnouncementBarForAdmin,
  updateAnnouncementBar,
} from "../../service/announcementBarService.js";

export const getAdminAnnouncementBar = asyncHandler(async (req, res) => {
  const bar = await getAnnouncementBarForAdmin();
  res.status(200).json({
    success: true,
    data: bar || { message: "", link: "", enabled: false },
  });
});

export const updateAdminAnnouncementBar = asyncHandler(async (req, res) => {
  const updated = await updateAnnouncementBar(req.body, req.user._id);
  res.status(200).json({ success: true, data: updated });
});
