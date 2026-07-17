import AnnouncementBar from "../models/announcementBarModel.js";

const SINGLETON_FILTER = { singletonKey: "ANNOUNCEMENT_BAR" };

// Public read — called by the storefront.
// Returns only active announcement data.
// If there is no active announcement, returns null.
export async function getAnnouncementBar() {
  const bar = await AnnouncementBar.findOne(
    SINGLETON_FILTER,
    {
      message: 1,
      link: 1,
      enabled: 1,
    }
  ).lean();

  if (!bar || !bar.enabled || !bar.message?.trim()) {
    return null;
  }

  return {
    message: bar.message,
    link: bar.link,
  };
}

// Admin read — returns the full document for the CMS.
export async function getAnnouncementBarForAdmin() {
  return AnnouncementBar.findOne(SINGLETON_FILTER);
}

export async function updateAnnouncementBar(updates, userId) {
  const current = await AnnouncementBar.findOne(SINGLETON_FILTER);

  // Figure out what the final state will be after applying this update.
  const resultingEnabled =
    updates.enabled !== undefined
      ? updates.enabled
      : current?.enabled ?? false;

  const resultingMessage =
    updates.message !== undefined
      ? updates.message
      : current?.message ?? "";

  if (resultingEnabled && !resultingMessage.trim()) {
    const err = new Error(
      "Cannot enable the announcement bar without a message."
    );
    err.statusCode = 400;
    throw err;
  }

  return AnnouncementBar.findOneAndUpdate(
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
}
