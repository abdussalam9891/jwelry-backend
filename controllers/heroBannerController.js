 
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getHeroBanners } from "../service/heroBannerService.js";

export const getPublicHeroBanners = asyncHandler(async (req, res) => {
  const banners = await getHeroBanners();
  res.status(200).json({ success: true, data: banners });
});
