import { asyncHandler } from "../middleware/asyncHandler.js";
import { getCMSPageBySlug } from "../service/cmsPageService.js";

export const getPublicCMSPage = asyncHandler(async (req, res) => {
  const page = await getCMSPageBySlug(req.params.slug);

  if (!page) {
    return res.status(404).json({
      success: false,
      message: "This page is not currently available.",
    });
  }

  res.status(200).json({
    success: true,
    data: page,
  });
});
