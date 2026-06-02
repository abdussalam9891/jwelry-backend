

import Coupon from "../models/couponModel.js";

import CouponRedemption from "../models/couponRedemptionModel.js";

export const getAvailableCoupons =
  async (req, res) => {
    try {

      const now =
        new Date();

      const coupons =
        await Coupon.find({
          isActive: true,

          $or: [
            {
              startsAt: {
                $exists: false,
              },
            },
            {
              startsAt: {
                $lte: now,
              },
            },
          ],

          $and: [
            {
              $or: [
                {
                  expiresAt: {
                    $exists: false,
                  },
                },
                {
                  expiresAt: {
                    $gte: now,
                  },
                },
              ],
            },
          ],
        }).select(
          "code name description discountType discountValue minOrderAmount"
        );

      res.json({
        success: true,
        coupons,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });

    }
  };



export const getMyRedemptions =
  async (req, res) => {
    try {

      const redemptions =
        await CouponRedemption
          .find({
            user:
              req.user._id,
          })

          .populate(
            "coupon",
            "code name"
          )

          .populate(
            "order",
            "orderNumber totalPrice"
          )

          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        redemptions,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });

    }
  };


  export const validateCoupon =
  async (req, res) => {
    try {

      const {
        code,
        subtotal,
      } = req.body;

      if (!code) {
        return res
          .status(400)
          .json({
            valid: false,
            message:
              "Coupon code is required",
          });
      }

      const coupon =
        await Coupon.findOne({
          code:
            code
              .toUpperCase()
              .trim(),

          isActive: true,
        });

      if (!coupon) {
        return res
          .status(400)
          .json({
            valid: false,
            message:
              "Invalid coupon",
          });
      }

      /* START DATE */

      if (
        coupon.startsAt &&
        coupon.startsAt >
          new Date()
      ) {
        return res
          .status(400)
          .json({
            valid: false,
            message:
              "Coupon not started yet",
          });
      }

      /* EXPIRY */

      if (
        coupon.expiresAt &&
        coupon.expiresAt <
          new Date()
      ) {
        return res
          .status(400)
          .json({
            valid: false,
            message:
              "Coupon expired",
          });
      }

      /* USAGE LIMIT */

      if (
        coupon.usageLimit &&
        coupon.usageCount >=
          coupon.usageLimit
      ) {
        return res
          .status(400)
          .json({
            valid: false,
            message:
              "Coupon usage limit reached",
          });
      }

      /* MIN ORDER */

      if (
        subtotal <
        coupon.minOrderAmount
      ) {
        return res
          .status(400)
          .json({
            valid: false,
            message:
              `Minimum order ₹${coupon.minOrderAmount}`,
          });
      }

      let discount = 0;

      /* PERCENTAGE */

      if (
        coupon.discountType ===
        "PERCENTAGE"
      ) {

        discount =
          (subtotal *
            coupon.discountValue) /
          100;

        if (
          coupon.maxDiscountAmount
        ) {
          discount =
            Math.min(
              discount,
              coupon.maxDiscountAmount
            );
        }

      }

      /* FIXED */

      else if (
        coupon.discountType ===
        "FIXED"
      ) {

        discount =
          Math.min(
            coupon.discountValue,
            subtotal
          );

      }

      /* FREE SHIPPING */

      else if (
        coupon.discountType ===
        "FREE_SHIPPING"
      ) {

        discount = 0;

      }

      const finalTotal =
        Math.max(
          0,
          subtotal - discount
        );

      return res.json({
        valid: true,

        discount,

        finalTotal,

        coupon: {
          _id:
            coupon._id,

          code:
            coupon.code,

          name:
            coupon.name,

          discountType:
            coupon.discountType,

          discountValue:
            coupon.discountValue,

          maxDiscountAmount:
            coupon.maxDiscountAmount,
        },
      });

    } catch (error) {

      console.error(error);

      return res
        .status(500)
        .json({
          valid: false,
          message:
            "Server error",
        });

    }
  };
