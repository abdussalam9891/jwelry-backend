import cloudinary from "../config/cloudinary.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import { updateProductRating } from "../utils/updateProductRating.js";

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const { rating, comment } = req.body;

    // PRODUCT CHECK

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // RATING VALIDATION

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // COMMENT VALIDATION

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Review comment is required",
      });
    }

    // DUPLICATE REVIEW CHECK

    const existingReview = await Review.findOne({
      product: productId,

      user: req.user._id,

      adminDeleted: false,

      moderationStatus: "APPROVED",
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    // PURCHASE VALIDATION

    const purchased = await Order.exists({
      user: req.user._id,

      orderStatus: "DELIVERED",

      "items.product": productId,
    });

    if (!purchased) {
      return res.status(403).json({
        message: "You can review only delivered purchases",
      });
    }

    // REVIEW IMAGES

    const uploadedImages =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    // CREATE REVIEW

    const review = await Review.create({
      product: productId,

      user: req.user._id,

      userName: req.user.name,

      rating: Number(rating),

      comment: comment.trim(),

      verifiedPurchase: true,

      images: uploadedImages,
    });

    // UPDATE PRODUCT STATS

    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "latest" } = req.query;

    const pageNum = Math.max(1, Number(page));

    const limitNum = Math.max(1, Number(limit));

    const skip = (pageNum - 1) * limitNum;

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

    const [reviews, total, product] = await Promise.all([
      Review.find({
        product: req.params.productId,
        adminDeleted: false,
        moderationStatus: "APPROVED",
      })
        .sort(sortOption)

        .skip(skip)

        .limit(limitNum)

        .select(
          `
  _id
  user
  userName
  rating
  comment
  images
  verifiedPurchase
  createdAt
`,
        )

        .lean(),

      Review.countDocuments({
        product: req.params.productId,
        adminDeleted: false,
        moderationStatus: "APPROVED",
      }),

      Product.findById(req.params.productId).select(
        `
        averageRating
        numReviews
        ratingBreakdown
        `,
      ),
    ]);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

   const reviewsWithOwnerFlag = reviews.map(
  (review) => ({
    ...review,
    isOwner:
      req.user &&
      review.user.toString() ===
        req.user._id.toString(),
  })
);

res.json({
  reviews: reviewsWithOwnerFlag,
  averageRating: product.averageRating,
  numReviews: product.numReviews,
  ratingBreakdown: product.ratingBreakdown,
  page: pageNum,
  totalPages: Math.ceil(total / limitNum),
  totalReviews: total,
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.rating = Number(rating);

    review.comment = comment.trim();

    let oldImages = [];

    if (req.files && req.files.length > 0) {
      oldImages = [...review.images];

      review.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    await review.save();

    if (oldImages.length > 0) {
      await Promise.all(
        oldImages.map((image) => cloudinary.uploader.destroy(image.public_id)),
      );
    }

    await updateProductRating(review.product);

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteReview = async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,

    user: req.user._id,
  });

  if (!review) {
    return res.status(404).json({
      message: "Review not found",
    });
  }

  const productId = review.product;

  await review.deleteOne();

  await updateProductRating(productId);

  res.json({
    success: true,
  });
};
