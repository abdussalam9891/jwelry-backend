import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const navigationTargetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "page",
        "category",
        "collection",
        "product",
        "external",
      ],
      default: "page",
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const heroBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    image: {
      desktop: {
        type: imageSchema,
        required: true,
      },

      mobile: {
        type: imageSchema,
        default: null,
      },
    },

    navigationTarget: {
      type: navigationTargetSchema,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
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

heroBannerSchema.pre("validate", function () {
  if (
    this.startDate &&
    this.endDate &&
    this.endDate < this.startDate
  ) {
    return next(
      new Error("End date cannot be before start date.")
    );
  }


});

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
        validator(arr) {
          return arr.length <= 10;
        },
        message: "Maximum 10 banners allowed.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "HeroBannerSet",
  heroBannerSetSchema
);
