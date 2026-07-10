import { asyncHandler } from "../middleware/asyncHandler.js";
import { getPublishedPage } from "../service/cmsPageService.js";

export const getPublicCMSPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = await getPublishedPage(slug);

  // Unlike SiteSettings/AnnouncementBar, a missing published page is a
  // genuine "no content" state, not a "fresh install" state — 404 is correct
  // here so the storefront can render a real "not available" fallback
  // instead of silently showing nothing.
  if (!page) {
    return res.status(404).json({
      success: false,
      message: "This page is not currently available.",
    });
  }

  res.status(200).json({ success: true, data: page });
});
