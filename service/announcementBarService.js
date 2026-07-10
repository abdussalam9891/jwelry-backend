import AnnouncementBar from "../models/announcementBarModel.js";

const SINGLETON_FILTER = { singletonKey: "ANNOUNCEMENT_BAR" };

// Public read — storefront hits this on effectively every page load, so
// keep it a single indexed findOne with no populate/joins. If this becomes
// a caching target later (flagged in the original architecture review),
// this is the one function that gets a cache wrapped around it.
export async function getAnnouncementBar() {
  return AnnouncementBar.findOne(SINGLETON_FILTER);
}

export async function getAnnouncementBarForAdmin() {
  return AnnouncementBar.findOne(SINGLETON_FILTER);
}

export async function updateAnnouncementBar(updates, userId) {
  const current = await AnnouncementBar.findOne(SINGLETON_FILTER);

  // The stateful invariant deferred from the validator: figure out what
  // the message will be AFTER this update is applied, using current state
  // as the fallback for any field the admin didn't resend.
  const resultingEnabled =
    updates.enabled !== undefined ? updates.enabled : current?.enabled ?? false;
  const resultingMessage =
    updates.message !== undefined ? updates.message : current?.message ?? "";

  if (resultingEnabled === true && resultingMessage.trim() === "") {
    const err = new Error(
      "Cannot enable the announcement bar without a message."
    );
    err.statusCode = 400;
    throw err;
  }

  const updated = await AnnouncementBar.findOneAndUpdate(
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
