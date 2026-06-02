import Review from "../../models/reviewModel.js";

import { updateProductRating }
from "../../utils/updateProductRating.js";

import Product from "../../models/productModel.js";

// GET PRODUCT REVIEWS
export const getProductReviewsAdmin =
  async (req, res) => {

    try {

      const {
        page = 1,
        limit = 10,
        sort = "latest",
        reported,
        status,
      } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);

    const query = {
  product: req.params.productId,
  adminDeleted: false,
};

      if (reported === "true") {
        query.isReported = true;
      }

      if (status) {
        query.moderationStatus = status;
      }

      let sortOption = {
        createdAt: -1,
      };

      if (sort === "highest") {
        sortOption = {
          rating: -1,
          createdAt: -1,
        };
      }

      if (sort === "lowest") {
        sortOption = {
          rating: 1,
          createdAt: -1,
        };
      }

      const [
        reviews,
        total,
        product,
      ] = await Promise.all([

        Review.find(query)
          .populate(
            "user",
            "name email avatar"
          )
          .sort(sortOption)
          .skip(
            (pageNum - 1) *
            limitNum
          )
          .limit(limitNum),

        Review.countDocuments(query),

        Product.findById(
          req.params.productId
        ).select(
          `
          averageRating
          numReviews
          ratingBreakdown
          `
        ),

      ]);

      const reportedReviews =
        await Review.countDocuments({
          product:
            req.params.productId,
          isReported: true,
        });

      const imageReviews =
        await Review.countDocuments({
          product:
            req.params.productId,
          "images.0": {
            $exists: true,
          },
        });

      res.json({

        reviews,

        totalReviews: total,

        page: pageNum,

        totalPages:
          Math.ceil(
            total /
            limitNum
          ),

        reviewStats: {

          averageRating:
            product?.averageRating || 0,

          numReviews:
            product?.numReviews || 0,

          ratingBreakdown:
            product?.ratingBreakdown || {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
            },

          reportedReviews,

          imageReviews,

        },

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch reviews",
      });

    }

  };











// MODERATE REVIEW

export const moderateReview =
  async (req, res) => {

    try {

      const {
        moderationStatus,
        adminNote,
      } = req.body;

      const review =
        await Review.findById(
          req.params.reviewId
        );

      if (!review) {

        return res
          .status(404)
          .json({
            message:
              "Review not found",
          });

      }

      review.moderationStatus =
        moderationStatus;

      review.adminNote =
        adminNote || "";

      await review.save();

      await updateProductRating(
  review.product
);

      res.json({
        success: true,
        review,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Moderation failed",
      });

    }

  };

















// ADMIN DELETE REVIEW


export const deleteReviewAdmin =
  async (req, res) => {

    try {

      const {
        reason,
      } = req.body;

      const review =
        await Review.findById(
          req.params.reviewId
        );

      if (!review) {

        return res
          .status(404)
          .json({
            message:
              "Review not found",
          });

      }

      review.adminDeleted =
        true;

      review.adminDeleteReason =
        reason ||
        "Deleted by admin";

      await review.save();

      await updateProductRating(
  review.product
);

      res.json({
        success: true,
        message:
          "Review deleted",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Delete failed",
      });

    }

  };
