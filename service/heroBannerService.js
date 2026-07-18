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



export async function getHeroBannersForAdmin({
  page = 1,
  limit = 4,
  search = "",
  status = "all",
  type = "all",
  sort = "newest",
}) {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);

  let banners = [...(doc?.banners || [])];

  // -----------------------------
  // Search
  // -----------------------------
  if (search.trim()) {
    const keyword = search.trim().toLowerCase();

    banners = banners.filter((banner) =>
      banner.title.toLowerCase().includes(keyword)
    );
  }

  // -----------------------------
  // Status Filter
  // -----------------------------
  if (status !== "all") {
    banners = banners.filter((banner) =>
      status === "active"
        ? banner.isActive
        : !banner.isActive
    );
  }

  // -----------------------------
  // Navigation Type Filter
  // -----------------------------
  if (type !== "all") {
    banners = banners.filter(
      (banner) => banner.navigationTarget.type === type
    );
  }

  // -----------------------------
  // Sorting
  // -----------------------------
  switch (sort) {
    case "oldest":
      banners.sort(
        (a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
      );
      break;

    case "title-asc":
      banners.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "title-desc":
      banners.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      break;

    case "newest":
    default:
      banners.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
      break;
  }

  // -----------------------------
  // Pagination
  // -----------------------------

  const limitNumber = Math.max(Number(limit) || 4, 1);

const total = banners.length;

const totalPages = Math.max(
  Math.ceil(total / limitNumber),
  1
);

const requestedPage = Math.max(Number(page) || 1, 1);

const pageNumber = Math.min(
  requestedPage,
  totalPages
);

  const skip = (pageNumber - 1) * limitNumber;

  const paginatedBanners = banners.slice(
    skip,
    skip + limitNumber
  );

  return {
    banners: paginatedBanners,

    pagination: {
      page: pageNumber,
      limit: limitNumber,

      total,
      totalPages,

      hasNext: pageNumber < totalPages,
      hasPrev: pageNumber > 1,
    },
  };
}

export async function getHeroBannerById(bannerId) {
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

  return banner;
}

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

const createdBanner = updated.banners.at(-1);

return createdBanner;
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

return banner;
}


export async function deleteHeroBanner(bannerId) {
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

  banner.deleteOne();

  await doc.save();

  return {
    deletedId: bannerId,
  };
}
