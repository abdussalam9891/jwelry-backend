import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  listPagesForAdmin,
  getPageForAdmin,
  updatePage,
  addPageImages,
  removePageImage,
} from "../../service/cmsPageService.js";

export const listAdminCMSPages = asyncHandler(async (req, res) => {
  const pages = await listPagesForAdmin();
  res.status(200).json({ success: true, data: pages });
});

export const getAdminCMSPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = await getPageForAdmin(slug);

  // A known slug (validated by validateSlugParam) with no document yet
  // just means the admin hasn't saved it for the first time — return an
  // empty draft shell rather than 404, so the edit form has something to render.
  if (!page) {
    return res.status(200).json({
      success: true,
      data: { slug, title: "", content: "", status: "draft" },
    });
  }

  res.status(200).json({ success: true, data: page });
});

export const updateAdminCMSPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updated = await updatePage(slug, req.body, req.user._id);
  res.status(200).json({ success: true, data: updated });
});





 

export const uploadCMSPageImages = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const imageUrls = req.files.map((file) => file.path); // Cloudinary URL via multer-storage-cloudinary
  const updated = await addPageImages(slug, imageUrls, req.user._id);
  res.status(200).json({ success: true, data: updated });
});

export const deleteCMSPageImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: "imageUrl is required.",
    });
  }

  const updated = await removePageImage(slug, imageUrl, req.user._id);
  res.status(200).json({ success: true, data: updated });
});
