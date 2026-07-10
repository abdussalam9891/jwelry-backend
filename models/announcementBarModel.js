import mongoose from "mongoose";

const announcementBarSchema = new mongoose.Schema(
  {
    // Same singleton pattern as SiteSettings — named "AnnouncementBar"
    // specifically to avoid colliding with the existing, unmounted
    // `Announcement` model already in this codebase (different shape,
    // supports a list of ordered announcements — not touched by this module).
    singletonKey: {
      type: String,
      default: "ANNOUNCEMENT_BAR",
      unique: true,
      immutable: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AnnouncementBar", announcementBarSchema);
