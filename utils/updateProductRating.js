import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

export const updateProductRating =
  async (productId) => {

    const reviews =
      await Review.find({
        product: productId,

        adminDeleted: false,

        moderationStatus:
          "APPROVED",
      });

    const numReviews =
      reviews.length;

    let totalRating = 0;

    const breakdown = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach(
      (review) => {

        totalRating +=
          review.rating;

        breakdown[
          review.rating
        ]++;

      }
    );

    const averageRating =
      numReviews === 0
        ? 0
        : Number(
            (
              totalRating /
              numReviews
            ).toFixed(1)
          );

    await Product.findByIdAndUpdate(
      productId,
      {
        averageRating,

        numReviews,

        ratingBreakdown:
          breakdown,
      }
    );

  };
