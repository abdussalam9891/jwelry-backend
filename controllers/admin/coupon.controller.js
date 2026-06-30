
import Coupon from "../../models/couponModel.js";
import CouponRedemption from "../../models/couponRedemptionModel.js";
import Order from "../../models/orderModel.js";

export const getCoupons = async (req, res) => {
  try {
    const {
      search = "",
      status = "ALL",
      discountType = "ALL",
      sort = "Newest",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};
    const now = new Date();

    /* SEARCH */

    if (search) {
      query.$or = [
        {
          code: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* STATUS FILTERS */

    if (status === "ACTIVE") {
      query.isActive = true;

      query.$and = [
        {
          $or: [
            {
              startsAt: {
                $exists: false,
              },
            },
            {
              startsAt: null,
            },
            {
              startsAt: {
                $lte: now,
              },
            },
          ],
        },

        {
          $or: [
            {
              expiresAt: {
                $exists: false,
              },
            },
            {
              expiresAt: null,
            },
            {
              expiresAt: {
                $gte: now,
              },
            },
          ],
        },
      ];
    }

    if (status === "INACTIVE") {
      query.isActive = false;
    }

    if (status === "EXPIRED") {
      query.expiresAt = {
        $lt: now,
      };
    }

    /* DISCOUNT TYPE FILTER */

    if (discountType !== "ALL") {
      query.discountType =
        discountType;
    }

    /* SORTING */

    const sortOptions = {
      Newest: {
        createdAt: -1,
      },

      Oldest: {
        createdAt: 1,
      },

      "Highest Discount": {
        discountValue: -1,
      },

      "Most Used": {
        usageCount: -1,
      },
    };

    const total =
      await Coupon.countDocuments(
        query
      );

    const coupons =
      await Coupon.find(query)
        .sort(
          sortOptions[sort] ||
            sortOptions.Newest
        )
        .skip(
          (Number(page) - 1) *
            Number(limit)
        )
        .limit(Number(limit));

    res.status(200).json({
      coupons,

      pagination: {
        total,

        page:
          Number(page),

        pages: Math.ceil(
          total /
            Number(limit)
        ),

        limit:
          Number(limit),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
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







 export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    const now = new Date();

    const isExpired =
      coupon.expiresAt &&
      new Date(coupon.expiresAt) < now;

    if (isExpired) {
      return res.status(400).json({
        message:
          "Expired coupons cannot be edited. Duplicate the coupon instead.",
      });
    }

    Object.assign(
      coupon,
      req.body
    );

    if (coupon.code) {
      coupon.code = coupon.code
        .toUpperCase()
        .trim();
    }

    if (
      coupon.startsAt &&
      coupon.expiresAt &&
      new Date(coupon.startsAt) >=
        new Date(coupon.expiresAt)
    ) {
      return res.status(400).json({
        message:
          "Expiry date must be after start date",
      });
    }

    await coupon.save();

    res.json(coupon);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
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
  console.error("Toggle Coupon Error:");
  console.error(error);
  console.error(error.stack);

  res.status(500).json({
    message: error.message,
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



      const now = new Date();

if (
  startsAt &&
  new Date(startsAt) < now
) {
  return res.status(400).json({
    message:
      "Start date cannot be in the past",
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


export const duplicateCoupon =
  async (req, res) => {
    try {

      const original =
        await Coupon.findById(
          req.params.id
        );

      if (!original) {
        return res
          .status(404)
          .json({
            message:
              "Coupon not found",
          });
      }

      res.status(200).json({
        code: "",

        name:
          original.name,

        description:
          original.description,

        discountType:
          original.discountType,

        discountValue:
          original.discountValue,

        minOrderAmount:
          original.minOrderAmount,

        maxDiscountAmount:
          original.maxDiscountAmount,

        usageLimit:
          original.usageLimit,

        perUserLimit:
          original.perUserLimit,

        firstOrderOnly:
          original.firstOrderOnly,

        startsAt: null,

        expiresAt: null,

        isActive: false,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Server error",
      });

    }
  };



