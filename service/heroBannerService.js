import HeroBannerSet from "../models/heroBannerModel.js";

const SINGLETON_FILTER = { singletonKey: "HERO_BANNERS" };

// Public — storefront homepage calls this. No draft/published concept here
// (unlike CMSPage) since there's no "half-written banner" risk — a banner
// either has both images and exists, or it doesn't exist yet.
export async function getHeroBanners() {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);
  return doc?.banners || [];
}

export async function getHeroBannersForAdmin() {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);
  return doc?.banners || [];
}

export async function addHeroBanner({ desktopImage, mobileImage, link }, userId) {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);
  const currentCount = doc?.banners?.length || 0;

  if (currentCount >= 5) {
    const err = new Error("Maximum of 5 hero banners already reached. Delete one before adding another.");
    err.statusCode = 400;
    throw err;
  }

  const updated = await HeroBannerSet.findOneAndUpdate(
    SINGLETON_FILTER,
    {
      $push: {
        banners: { desktopImage, mobileImage, link: link || "", updatedBy: userId },
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return updated.banners;
}



export async function updateHeroBanner(
  bannerId,
  { desktopImage, mobileImage, link },
  userId
) {
  const doc = await HeroBannerSet.findOne(SINGLETON_FILTER);

  if (!doc) {
    const err = new Error("No hero banner set found.");
    err.statusCode = 404;
    throw err;
  }

  const banner = doc.banners.id(bannerId);

  if (!banner) {
    const err = new Error("Hero banner not found.");
    err.statusCode = 404;
    throw err;
  }

  if (desktopImage) {
    banner.desktopImage = desktopImage;
  }

  if (mobileImage) {
    banner.mobileImage = mobileImage;
  }

  banner.link = link || "";
  banner.updatedBy = userId;

  await doc.save();

  return doc.banners;
}



export async function deleteHeroBanner(bannerId) {
  const updated = await HeroBannerSet.findOneAndUpdate(
    SINGLETON_FILTER,
    { $pull: { banners: { _id: bannerId } } },
    { new: true }
  );

  if (!updated) {
    const err = new Error("No hero banner set found.");
    err.statusCode = 404;
    throw err;
  }

  return updated.banners;
}
