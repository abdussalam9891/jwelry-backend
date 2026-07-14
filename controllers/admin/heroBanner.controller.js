// controllers/admin/heroBanner.controller.js

import { asyncHandler } from "../../middleware/asyncHandler.js";

import {
  getHeroBannersForAdmin,
  addHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../../service/heroBannerService.js";

export const listAdminHeroBanners = asyncHandler(async (req, res) => {
  const banners = await getHeroBannersForAdmin();

  res.status(200).json({
    success: true,
    data: banners,
  });
});

export const createAdminHeroBanner = asyncHandler(async (req, res) => {
  const { link } = req.body;

  const desktopImage = req.files.desktopImage[0].path;
  const mobileImage = req.files.mobileImage[0].path;

  const banners = await addHeroBanner(
    {
      desktopImage,
      mobileImage,
      link,
    },
    req.user._id
  );

  res.status(201).json({
    success: true,
    data: banners,
  });
});

export const updateAdminHeroBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const { link } = req.body;

  const desktopImage = req.files?.desktopImage?.[0]?.path;
  const mobileImage = req.files?.mobileImage?.[0]?.path;

  const banners = await updateHeroBanner(
    bannerId,
    {
      desktopImage,
      mobileImage,
      link,
    },
    req.user._id
  );

  res.status(200).json({
    success: true,
    data: banners,
  });
});

export const deleteAdminHeroBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  const banners = await deleteHeroBanner(bannerId);

  res.status(200).json({
    success: true,
    data: banners,
  });
});
