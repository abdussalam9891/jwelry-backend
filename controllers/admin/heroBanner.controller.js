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
  const {
    title,
    navigationType,
    navigationValue,
    startDate,
    endDate,
    isActive,
  } = req.body;

  const desktopFile = req.files?.desktopImage?.[0];

  if (!desktopFile) {
    return res.status(400).json({
      success: false,
      message: "Desktop image is required.",
    });
  }

  const mobileFile = req.files?.mobileImage?.[0];

  const desktopImage = {
    url: desktopFile.path,
    publicId: desktopFile.filename,
  };

  const mobileImage = mobileFile
    ? {
        url: mobileFile.path,
        publicId: mobileFile.filename,
      }
    : null;

  const banners = await addHeroBanner(
    {
      title,

      desktopImage,
      mobileImage,

      navigationTarget: {
        type: navigationType,
        value: navigationValue,
      },

      startDate: startDate || null,
      endDate: endDate || null,

      isActive:
        isActive === undefined
          ? true
          : isActive === "true",
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

  const {
    title,
    navigationType,
    navigationValue,
    startDate,
    endDate,
    isActive,
  } = req.body;

  const desktopFile = req.files?.desktopImage?.[0];
  const mobileFile = req.files?.mobileImage?.[0];

  const desktopImage = desktopFile
    ? {
        url: desktopFile.path,
        publicId: desktopFile.filename,
      }
    : undefined;

  const mobileImage = mobileFile
    ? {
        url: mobileFile.path,
        publicId: mobileFile.filename,
      }
    : undefined;

  const banners = await updateHeroBanner(
    bannerId,
    {
      title,

      desktopImage,
      mobileImage,

      navigationTarget:
        navigationType && navigationValue
          ? {
              type: navigationType,
              value: navigationValue,
            }
          : undefined,

      startDate,
      endDate,

      isActive:
        isActive === undefined
          ? undefined
          : isActive === "true",
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
