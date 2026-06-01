import Review from "../../models/reviewModel.js";

export const deleteReviewAdmin =
  async (req, res) => {

    try {

      const review =
        await Review.findById(
          req.params.reviewId
        );

      if (!review) {

        return res.status(404)
          .json({
            message:
              "Review not found",
          });

      }

      const productId =
        review.product;

      await review.deleteOne();

      await updateProductRating(
        productId
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
          "Server error",
      });

    }

};
