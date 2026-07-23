import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const cmsPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "policy",
        "faq",
        "page",
        "legal",
      ],
      default: "page",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
      ],
      default: "published",
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    publishedAt: Date,

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

cmsPageSchema.index({ slug: 1 });

export default mongoose.model("CMSPage", cmsPageSchema);
