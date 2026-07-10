import SiteSettings from "../models/siteSettingsModel.js";

const SINGLETON_FILTER = { singletonKey: "SITE_SETTINGS" };

// Public read — used by the storefront. Returns null if never configured
// yet (fresh install); the controller decides what to do with that.
export async function getSiteSettings() {
  return SiteSettings.findOne(SINGLETON_FILTER);
}

// Admin read — currently identical to the public read since site settings
// has no draft/published concept (unlike CMSPage). Kept as a separate
// function anyway so the controller layer mirrors the CMSPage/AnnouncementBar
// shape consistently, and so this is a one-line change if settings ever
// grows a "preview before publish" requirement.
export async function getSiteSettingsForAdmin() {
  return SiteSettings.findOne(SINGLETON_FILTER);
}

export async function updateSiteSettings(updates, userId) {
  // upsert: true means the very first PUT call creates the singleton —
  // no separate "seed the database" script needed on fresh deploys.
  const updated = await SiteSettings.findOneAndUpdate(
    SINGLETON_FILTER,
    {
      $set: {
        ...updates,
        updatedBy: userId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return updated;
}
