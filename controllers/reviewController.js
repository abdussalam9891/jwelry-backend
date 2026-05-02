import Review from "../models/reviewModel.js";


export const getReviewsByProduct = async (req, res) => {
  try {
    console.log("Product ID:", req.params.productId);

    const reviews = await Review.find({
      product: req.params.productId,
    });

    console.log("Reviews found:", reviews);

    res.json(reviews);
  } catch (err) {
    console.error("GET REVIEWS ERROR:", err); // 🔥 THIS IS CRITICAL
    res.status(500).json({ message: err.message });
  }
};
