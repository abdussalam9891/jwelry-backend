import HeroBannerSet from "../models/heroBannerModel.js";

const SINGLETON_FILTER = {
  singletonKey: "HERO_BANNERS",
};

const MAX_BANNERS = 10;

function isBannerLive(banner) {
  if (!banner.isActive) return false;

  const now = new Date();

  if (banner.startDate && banner.startDate > now) {
    return false;
  }

  if (banner.endDate && banner.endDate < now) {
    return false;
  }

  return true;
}



export async function getHeroBanners() {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);

  if (!doc) return [];

  return doc.banners.filter(isBannerLive);
}



export async function getHeroBannersForAdmin() {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);

  return doc?.banners || [];
}

// ================= CREATE =================

export async function addHeroBanner(
  {
    title,
    desktopImage,
    mobileImage,
    navigationTarget,
    startDate,
    endDate,
    isActive,
  },
  userId
) {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);

  const currentCount = doc?.banners.length || 0;

  if (currentCount >= MAX_BANNERS) {
    const err = new Error(
      `Maximum ${MAX_BANNERS} hero banners allowed.`
    );
    err.statusCode = 400;
    throw err;
  }

  const updated = await HeroBannerSet.findOneAndUpdate(
    SINGLETON_FILTER,
    {
      $push: {
        banners: {
          title,

          image: {
            desktop: desktopImage,
            mobile: mobileImage || null,
          },

          navigationTarget,

          startDate: startDate || null,
          endDate: endDate || null,

          isActive:
            typeof isActive === "boolean"
              ? isActive
              : true,

          updatedBy: userId,
        },
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return updated.banners;
}



export async function updateHeroBanner(
  bannerId,
  {
    title,
    desktopImage,
    mobileImage,
    navigationTarget,
    startDate,
    endDate,
    isActive,
  },
  userId
) {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);

  if (!doc) {
    const err = new Error("Hero banner set not found.");
    err.statusCode = 404;
    throw err;
  }

  const banner = doc.banners.id(bannerId);

  if (!banner) {
    const err = new Error("Hero banner not found.");
    err.statusCode = 404;
    throw err;
  }

  if (title !== undefined) {
    banner.title = title;
  }

  if (desktopImage) {
    banner.image.desktop = desktopImage;
  }

  if (mobileImage) {
    banner.image.mobile = mobileImage;
  }

  if (navigationTarget) {
    banner.navigationTarget = navigationTarget;
  }

  if (startDate !== undefined) {
    banner.startDate = startDate || null;
  }

  if (endDate !== undefined) {
    banner.endDate = endDate || null;
  }

  if (typeof isActive === "boolean") {
    banner.isActive = isActive;
  }

  banner.updatedBy = userId;

  await doc.save();

  return doc.banners;
}



export async function deleteHeroBanner(bannerId) {
  const updated = await HeroBannerSet.findOneAndUpdate(
    SINGLETON_FILTER,
    {
      $pull: {
        banners: {
          _id: bannerId,
        },
      },
    },
    {
      new: true,
    }
  );

  if (!updated) {
    const err = new Error("Hero banner set not found.");
    err.statusCode = 404;
    throw err;
  }

  return updated.banners;
}
