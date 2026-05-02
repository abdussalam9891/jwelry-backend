import mongoose from "mongoose";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Wishlist from "../models/wishlistModel.js";

const MAX_CART_ITEMS = 20;

// GET cart

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "slug stock", // keep it minimal
      })
      .lean();

    if (!cart) {
      return res.json({
        items: [],
        summary: {
          total: 0,
          savings: 0,
          itemCount: 0,
        },
      });
    }

    // 🔥 DO NOT FILTER ITEMS
    const items = cart.items || [];

    let total = 0;
    let savings = 0;
    let itemCount = 0;

    for (const item of items) {
      const price = item.price;
      const original = item.originalPrice || price;
      const qty = item.quantity;

      total += price * qty;
      savings += (original - price) * qty;
      itemCount += qty;
    }

    // 🔥 FORMAT DATA FOR FRONTEND
    const formattedItems = items.map((item) => ({
      productId: item.product?._id,
      name: item.name,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      slug: item.product?.slug,
    }));

    // 🔥 FINAL RESPONSE
    res.json({
      items: formattedItems,
      summary: {
        total,
        savings,
        itemCount,
      },
    });

  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD to cart


export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId } = req.body; // optional for now
    const userId = req.user._id;

    const product = await Product.findById(productId).select(
      "name price originalPrice images stock"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: "Out of stock" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // 🔥 FIND EXISTING ITEM (product + variant)
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        String(item.variantId || "") === String(variantId || "")
    );

    if (existingItem) {
      if (existingItem.quantity >= 10) {
        return res.status(400).json({ message: "Max quantity reached" });
      }

      if (existingItem.quantity + 1 > product.stock) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: product._id,
        variantId: variantId || null,
        quantity: 1,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        name: product.name,
        image: product.images?.[0] || null,
      });
    }

    await cart.save();

    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: itemId } } }
    );

    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE quantity

export const updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);

    if (!qty || qty < 1 || qty > 10) {
      return res.status(400).json({
        message: "Quantity must be between 1 and 10",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 stock check
    const product = await Product.findById(item.product).select("stock");

    if (!product || product.stock < qty) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    item.quantity = qty;

    await cart.save();

    res.json({
      message: "Quantity updated",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




export const moveToCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    //  check product exists + stock
    const product = await Product.findById(productId)
      .select("stock")
      .session(session);

    if (!product || product.stock < 1) {
      throw new Error("Product out of stock");
    }

    //  get cart inside transaction
    let cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart) {
      // create new cart
      cart = await Cart.create(
        [
          {
            user: userId,
            items: [{ product: productId, quantity: 1 }],
          },
        ],
        { session }
      );
    } else {
      if (cart.items.length >= MAX_CART_ITEMS) {
        throw new Error("Cart is full (max 20 items)");
      }

      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        //  increment safely (respect stock + max qty)
        if (existingItem.quantity >= 10) {
          throw new Error("Max quantity reached");
        }

        if (existingItem.quantity + 1 > product.stock) {
          throw new Error("Not enough stock");
        }

        existingItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }

      await cart.save({ session });
    }

    //  remove from wishlist ONLY after cart success
    await Wishlist.findOneAndDelete(
      { user: userId, product: productId },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Moved to cart" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);

    res.status(400).json({
      message: err.message || "Failed to move item to cart",
    });
  }
};

// CLEAR cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true }
    ).lean();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({
      message: "Cart cleared",
      items: [],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const cleanCart = async (userId) => {
  await Cart.updateOne(
    { user: userId },
    {
      $pull: { items: { product: null } }
    }
  );
};
