import mongoose from "mongoose";




const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
    },

    userAvatar: String,

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

   images: [
  {
    url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },
  },
],

    helpfulCount: {
      type: Number,
      default: 0,
    },

    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reportCount: {
      type: Number,
      default: 0,
    },

    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isReported: {
  type: Boolean,
  default: false,
},

adminDeleted: {
  type: Boolean,
  default: false,
},

adminDeleteReason: {
  type: String,
  default: "",
},

    moderationStatus: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
      ],
      default: "APPROVED",
      index: true,
    },

    adminNote: String,
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  { product: 1, user: 1 },
  { unique: true }
);

export default mongoose.model(
  "Review",
  reviewSchema
);
