// controllers/wishlistController.js
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// GET wishlist
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .select("product");

    res.json({
      items: items.map(i => i.product.toString())
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ADD to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    const exists = await Product.findById(productId);
    if (!exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json({ message: "Added to wishlist" });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// REMOVE from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const removed = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId,
    });

    if (!removed) {
      return res.status(404).json({ message: "Item not in wishlist" });
    }

    res.json({ message: "Removed from wishlist" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
