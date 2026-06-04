
import Coupon from "../../models/couponModel.js";
import CouponRedemption from "../../models/couponRedemptionModel.js";
import Order from "../../models/orderModel.js";

export const getCoupons =
  async (req, res) => {
    try {

      const coupons =
        await Coupon
          .find()
          .sort({
            createdAt: -1,
          });

      res.json(coupons);

    } catch (error) {

      res.status(500).json({
        message:
          "Server error",
      });

    }
  };








  export const getCoupon =
  async (req, res) => {
    try {

      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }

      res.json(coupon);

    } catch (error) {

      res.status(500).json({
        message:
          "Server error",
      });

    }
  };







  export const updateCoupon =
  async (req, res) => {
    try {

      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }

      Object.assign(
        coupon,
        req.body
      );

      if (
        coupon.code
      ) {
        coupon.code =
          coupon.code
            .toUpperCase()
            .trim();
      }

      await coupon.save();

      res.json(coupon);

    } catch (error) {

      res.status(500).json({
        message:
          "Server error",
      });

    }
  };


  export const toggleCouponStatus =
  async (req, res) => {

    try {

      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }

      coupon.isActive =
        !coupon.isActive;

      await coupon.save();

      res.json({
        success: true,
        isActive:
          coupon.isActive,
        message:
          coupon.isActive
            ? "Coupon enabled"
            : "Coupon disabled",
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Server error",
      });

    }

  };



  export const getCouponStats =
  async (req, res) => {
    try {

      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }

      const redemptions =
        await CouponRedemption
          .find({
            coupon:
              coupon._id,
          });

      const totalDiscount =
        redemptions.reduce(
          (sum, item) =>
            sum +
            item.discountAmount,
          0
        );

      res.json({
        couponCode:
          coupon.code,

        usageCount:
          coupon.usageCount,

        totalDiscountGiven:
          totalDiscount,

        redemptionCount:
          redemptions.length,
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Server error",
      });

    }
  };


export const createCoupon =
  async (req, res) => {
    try {

      const {
        code,
        name,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        usageLimit,
        perUserLimit,
        firstOrderOnly,
        isActive,
        startsAt,
        expiresAt,
      } = req.body;

      if (
        !code ||
        !name ||
        !discountType
      ) {
        return res.status(400).json({
          message:
            "Missing required fields",
        });
      }

      if (discountValue < 0) {
        return res.status(400).json({
          message:
            "Discount value cannot be negative",
        });
      }

      if (
        discountType ===
          "PERCENTAGE" &&
        discountValue > 100
      ) {
        return res.status(400).json({
          message:
            "Percentage discount cannot exceed 100%",
        });
      }

      if (
        startsAt &&
        expiresAt &&
        new Date(startsAt) >=
          new Date(expiresAt)
      ) {
        return res.status(400).json({
          message:
            "Expiry date must be after start date",
        });
      }

      if (
        usageLimit !== undefined &&
        usageLimit < 1
      ) {
        return res.status(400).json({
          message:
            "Usage limit must be greater than 0",
        });
      }

      if (
        perUserLimit !== undefined &&
        perUserLimit < 1
      ) {
        return res.status(400).json({
          message:
            "Per user limit must be greater than 0",
        });
      }

      const existingCoupon =
        await Coupon.findOne({
          code:
            code
              .toUpperCase()
              .trim(),
        });

      if (existingCoupon) {
        return res.status(400).json({
          message:
            "Coupon code already exists",
        });
      }

      const coupon =
        await Coupon.create({
          code:
            code
              .toUpperCase()
              .trim(),

          name,

          discountType,

          discountValue,

          minOrderAmount,

          maxDiscountAmount,

          usageLimit,

          perUserLimit,

          firstOrderOnly,

          isActive,

          startsAt,

          expiresAt,
        });

      res.status(201).json(
        coupon
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Server error",
      });

    }
  };






