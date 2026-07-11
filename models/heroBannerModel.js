import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
  {
    desktopImage: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    // Order is implicit: array position in the parent document, set once
    // at creation, never modified. See HeroBannerSet below for why this
    // lives as a subdocument array rather than its own top-level collection.
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Singleton wrapper, same pattern as SiteSettings/AnnouncementBar — one
// document holds the ordered list. This avoids needing a separate "order"
// integer field with its own race conditions (two admins creating banners
// at once could get the same order number with a flat collection approach;
// array push order is atomic per-document and side-steps that entirely).
const heroBannerSetSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "HERO_BANNERS",
      unique: true,
      immutable: true,
    },
    banners: {
      type: [heroBannerSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "A maximum of 5 hero banners is allowed.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("HeroBannerSet", heroBannerSetSchema);
