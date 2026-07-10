import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: "", trim: true },
    facebook: { type: String, default: "", trim: true },
    twitter: { type: String, default: "", trim: true },
    youtube: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // Enforces a true singleton at the DB level via a unique constant key,
    // rather than relying on the service layer to never call .create() twice.
    singletonKey: {
      type: String,
      default: "SITE_SETTINGS",
      unique: true,
      immutable: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
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

export default mongoose.model("SiteSettings", siteSettingsSchema);
