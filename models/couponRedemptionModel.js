import mongoose from "mongoose";

const couponRedemptionSchema =
  new mongoose.Schema(
    {
      coupon: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Coupon",
      },

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
      },

      order: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Order",
      },

      discountAmount: Number,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "CouponRedemption",
  couponRedemptionSchema
);
