import { asyncHandler } from "../../middleware/asyncHandler.js";

import {
  getCMSPages,
  getCMSPageById,
  getCMSPageBySlug,
  createCMSPage,
  updateCMSPage,
  deleteCMSPage,
  
} from "../../service/cmsPageService.js";

/**
 * Admin - Get all pages
 */
export const getAdminCMSPages = asyncHandler(async (req, res) => {
  const pages = await getCMSPages(req.query);

  res.status(200).json({
    success: true,
    data: pages,
  });
});

/**
 * Admin - Get page by ID
 */
export const getAdminCMSPage = asyncHandler(async (req, res) => {
  const page = await getCMSPageById(req.params.id);

  res.status(200).json({
    success: true,
    data: page,
  });
});

/**
 * Storefront - Get page by slug
 */
export const getPublicCMSPage = asyncHandler(async (req, res) => {
  const page = await getCMSPageBySlug(req.params.slug);

  res.status(200).json({
    success: true,
    data: page,
  });
});

/**
 * Create page
 */
export const createAdminCMSPage = asyncHandler(async (req, res) => {
  const page = await createCMSPage(req.body, req.user._id);

  res.status(201).json({
    success: true,
    data: page,
  });
});

/**
 * Update page
 */
export const updateAdminCMSPage = asyncHandler(async (req, res) => {
  const page = await updateCMSPage(
    req.params.id,
    req.body,
    req.user._id
  );

  res.status(200).json({
    success: true,
    data: page,
  });
});

/**
 * Delete page
 */
export const deleteAdminCMSPage = asyncHandler(async (req, res) => {
  const result = await deleteCMSPage(req.params.id);

  res.status(200).json({
    success: true,
    ...result,
  });
});





