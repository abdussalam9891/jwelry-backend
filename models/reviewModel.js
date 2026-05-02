// models/reviewModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: String,
  rating: Number,
  comment: String,
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
