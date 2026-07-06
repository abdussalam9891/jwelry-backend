import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { getPurchasableProduct } from "../utils/productPurchase.js";

const MAX_CART_ITEMS = 20;

// GET cart

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "slug stock isActive",
      })
      .lean();

    if (!cart) {
      return res.json({
        items: [],
        pricing: {
          subtotal: 0,
          savings: 0,
          itemCount: 0,
        },
      });
    }

    const items = cart.items || [];

    let subtotal = 0;
    let savings = 0;
    let itemCount = 0;

    for (const item of items) {
      const price = item.price;
      const originalPrice = item.originalPrice || price;
      const qty = item.quantity;

      subtotal += price * qty;
      savings += (originalPrice - price) * qty;
      itemCount += qty;
    }

    const formattedItems = items.map((item) => ({
      _id: item._id,

      productId: item.product?._id,
      name: item.name,
      image: item.image,

      price: item.price,
      originalPrice: item.originalPrice,

      quantity: item.quantity,
      slug: item.product?.slug,

      variantId: item.variantId || null,
      variantDetails: item.variantDetails || null,
    }));

    res.json({
      items: formattedItems,
      pricing: {
        subtotal,
        savings,
        itemCount,
      },
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ADD to cart

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId } = req.body;

    const userId = req.user._id;

    const {
      product,
      variant,
      price,
      originalPrice,
      stock,
    } = await getPurchasableProduct({
      productId,
      variantId,
      quantity: 1,
    });

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() ===
          productId &&
        String(item.variantId || "") ===
          String(variant?._id || "")
    );

    if (existingItem) {
      if (existingItem.quantity >= 10) {
        return res.status(400).json({
          message: "Max quantity reached",
        });
      }

      if (
        existingItem.quantity + 1 >
        stock
      ) {
        return res.status(400).json({
          message: "Not enough stock",
        });
      }

      existingItem.quantity += 1;
    } else {
      if (
        cart.items.length >=
        MAX_CART_ITEMS
      ) {
        return res.status(400).json({
          message:
            "Cart is full (max 20 items)",
        });
      }

      cart.items.push({
        product: product._id,

        variantId:
          variant?._id || null,

        name: product.name,

        image:
          product.images?.[0]?.url ||
          null,

        price,

        originalPrice,

        quantity: 1,

        variantDetails: variant
          ? {
              size: variant.size,
              material:
                variant.material,
              sku: variant.sku,
            }
          : null,
      });
    }

    await cart.save();

    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    console.error(
      "ADD TO CART ERROR:",
      err
    );

    const clientErrors = [
      "Product is required",
      "Product not found",
      "Variant required",
      "Invalid variant",
      "Invalid quantity",
    ];

    if (
      clientErrors.includes(err.message) ||
      err.message.includes("Only")
    ) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

// REMOVE from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: itemId } } },
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

    const MAX_CART_QTY = 3;

    if (isNaN(qty) || qty < 1 || qty > MAX_CART_QTY) {
      return res.status(400).json({
        message: `Maximum ${MAX_CART_QTY} quantity allowed per item`,
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let availableStock = product.stock;

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);

      if (!variant) {
        return res.status(400).json({
          message: "Variant not found",
        });
      }

      availableStock = variant.stock;
    }

    if (availableStock < qty) {
      return res.status(400).json({
        message: `Only ${availableStock} item(s) available`,
      });
    }

    item.quantity = qty;

    await cart.save();

    // Recalculate cart pricing
    let subtotal = 0;
    let savings = 0;
    let itemCount = 0;

    for (const cartItem of cart.items) {
      const price = cartItem.price;
      const originalPrice = cartItem.originalPrice || price;
      const quantity = cartItem.quantity;

      subtotal += price * quantity;
      savings += (originalPrice - price) * quantity;
      itemCount += quantity;
    }

    res.json({
      message: "Quantity updated",
      item: {
        _id: item._id,
        quantity: item.quantity,
      },
      pricing: {
        subtotal,
        savings,
        itemCount,
      },
    });
  } catch (err) {
    console.error("UPDATE QUANTITY ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CLEAR cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { new: true },
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
      $pull: { items: { product: null } },
    },
  );
};
