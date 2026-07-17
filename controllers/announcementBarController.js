import { asyncHandler } from "../middleware/asyncHandler.js";
import { getAnnouncementBar } from "../service/announcementBarService.js";

export const getPublicAnnouncementBar = asyncHandler(async (req, res) => {
  const bar = await getAnnouncementBar();

  res.status(200).json({
    success: true,
    data: bar,
  });
});
