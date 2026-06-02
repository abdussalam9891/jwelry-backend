import mongoose from "mongoose";

const couponSchema =
  new mongoose.Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      name: {
        type: String,
        required: true,
      },
      description: {
  type: String,
  default: "",
},

      discountType: {
        type: String,
        enum: [
          "PERCENTAGE",
          "FIXED",
          "FREE_SHIPPING",
        ],
        required: true,
      },

      discountValue: {
        type: Number,
        required: true,
      },

      minOrderAmount: {
        type: Number,
        default: 0,
      },

      maxDiscountAmount: {
        type: Number,
        default: null,
      },

      usageLimit: {
        type: Number,
        default: null,
      },

      usageCount: {
        type: Number,
        default: 0,
      },

      perUserLimit: {
        type: Number,
        default: 1,
      },

      firstOrderOnly: {
        type: Boolean,
        default: false,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      startsAt: Date,

      expiresAt: Date,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Coupon",
  couponSchema
);
