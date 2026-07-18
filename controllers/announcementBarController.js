import { asyncHandler } from "../middleware/asyncHandler.js";
import { getAnnouncementBar } from "../service/announcementService.js";

export const getPublicAnnouncementBar = asyncHandler(async (req, res) => {
  const announcement = await getAnnouncementBar();

  res.status(200).json({
    success: true,
    data: announcement,
  });
});
