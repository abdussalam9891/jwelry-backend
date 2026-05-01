 import mongoose from "mongoose";
import Cart from "../models/cartModel.js";
import Wishlist from "../models/wishlistModel.js";

const MAX_CART_ITEMS = 20;


// GET cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "name price originalPrice images slug stock",
      })
      .lean();

    if (!cart) {
      return res.json({ items: [] });
    }

    // filter out deleted products
    cart.items = cart.items.filter(item => item.product !== null);

    res.json(cart);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ADD to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // first item — create cart
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity: 1 }],
      });

      return res.status(201).json({ message: "Added to cart" });
    }

    if (cart.items.length >= MAX_CART_ITEMS) {
      return res.status(400).json({ message: "Cart is full (max 20 items)" });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity >= 10) {
        return res.status(400).json({ message: "Max quantity reached for this item" });
      }
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(201).json({ message: "Added to cart" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// REMOVE from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } }
    );

    // idempotent — always 200
    res.json({ message: "Removed from cart" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE quantity
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const qty = parseInt(quantity, 10);

    if (!qty || qty < 1 || qty > 10) {
      return res.status(400).json({ message: "Quantity must be between 1 and 10" });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
      },
      { $set: { "items.$.quantity": qty } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    res.json({ message: "Quantity updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// MOVE TO CART (atomic — from wishlist)
export const moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const userId = req.user._id;

    // step 1: add to cart first
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      if (cart.items.length >= MAX_CART_ITEMS) {
        return res.status(400).json({ message: "Cart is full (max 20 items)" });
      }

      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (!existingItem) {
        cart.items.push({ product: productId, quantity: 1 });
        await cart.save();
      }
      // already in cart — still remove from wishlist below
    }

    // step 2: remove from wishlist (only after cart succeeds)
    await Wishlist.findOneAndDelete({ user: userId, product: productId });

    res.json({ message: "Moved to cart" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// CLEAR cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.json({ message: "Cart cleared" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
