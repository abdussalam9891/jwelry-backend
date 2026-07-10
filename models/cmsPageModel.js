import mongoose from "mongoose";

// Locked to the exact slugs your lead approved. This enum is the actual
// enforcement point — the controller/validator layer will also check
// against this same list, but the schema-level enum is what stops a
// direct DB write or a script from ever creating a stray slug.
export const CMS_PAGE_SLUGS = [
  "about-us",
  "privacy-policy",
  "terms-and-conditions",
  "shipping-policy",
  "return-policy",
  "warranty-policy",
];

const cmsPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: CMS_PAGE_SLUGS,
      immutable: true, // a page's slug should never change after creation
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
      // NOTE: sanitized in the service layer before save (Step 3/2),
      // not here — schema shouldn't own sanitization logic.
    },
    images: {
  type: [String],
  default: [],
  validate: {
    validator: (arr) => arr.length <= 5,
    message: "A page can have at most 5 images.",
  },
},

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
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

export default mongoose.model("CMSPage", cmsPageSchema);
