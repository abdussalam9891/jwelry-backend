// controllers/wishlistController.js
import mongoose from "mongoose";
import Wishlist from "../models/wishlistModel.js";

// GET wishlist
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate({
        path: "product",
        select: "name price originalPrice images slug stock",
      })
      .lean();

    const products = items
      .map(item => item.product)
      .filter(Boolean);

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json({ message: "Added to wishlist" });

  } catch (err) {
    if (err.code === 11000) {
      // already exists — idempotent, treat as success
      return res.status(200).json({ message: "Already in wishlist" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// REMOVE from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    // always 200 — idempotent delete
    // frontend uses optimistic UI, 404 here triggers rollback incorrectly
    res.json({ message: "Removed from wishlist" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
